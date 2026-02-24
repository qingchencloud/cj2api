import type { ChatRequest, ChatCompletionResponse, ChatCompletionChunk } from './types';
import { generateId, parseUpstreamResponse, buildUsage, CORS_HEADERS } from './utils';
import { fetchUpstream } from './upstream';

async function handleNonStream(body: ChatRequest): Promise<Response> {
  const model = body.model || 'llama3.1-8B';
  const resp = await fetchUpstream(body);
  const raw = await resp.text();
  const { content, stats } = parseUpstreamResponse(raw);

  const result: ChatCompletionResponse = {
    id: generateId(),
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
      },
    ],
    usage: buildUsage(stats),
  };

  return new Response(JSON.stringify(result), {
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function createStreamResponse(body: ChatRequest, rawText: string): Response {
  const model = body.model || 'llama3.1-8B';
  const { content, stats } = parseUpstreamResponse(rawText);
  const id = generateId();
  const created = Math.floor(Date.now() / 1000);
  const encoder = new TextEncoder();
  const chunks = splitContent(content);

  const readable = new ReadableStream({
    async start(controller) {
      const firstChunk: ChatCompletionChunk = {
        id, object: 'chat.completion.chunk', created, model,
        choices: [{ index: 0, delta: { role: 'assistant', content: '' }, finish_reason: null }],
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(firstChunk)}\n\n`));

      for (const piece of chunks) {
        const chunk: ChatCompletionChunk = {
          id, object: 'chat.completion.chunk', created, model,
          choices: [{ index: 0, delta: { content: piece }, finish_reason: null }],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      }

      const endChunk: ChatCompletionChunk = {
        id, object: 'chat.completion.chunk', created, model,
        choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`));

      if (stats) {
        const usageChunk = {
          id, object: 'chat.completion.chunk', created, model,
          choices: [],
          usage: buildUsage(stats),
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(usageChunk)}\n\n`));
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function splitContent(text: string): string[] {
  if (!text) return [];
  const pieces: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + 3 + Math.floor(Math.random() * 10), text.length);
    if (end < text.length) {
      for (let j = end; j > i + 2; j--) {
        const ch = text[j];
        if (' ,.。，\n!？'.includes(ch)) { end = j + 1; break; }
      }
    }
    pieces.push(text.substring(i, end));
    i = end;
  }
  return pieces;
}

export async function handleChatCompletions(request: Request): Promise<Response> {
  let body: ChatRequest;
  try {
    body = await request.json() as ChatRequest;
  } catch {
    return new Response(
      JSON.stringify({ error: { message: '请求体 JSON 解析失败', type: 'invalid_request_error' } }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: { message: 'messages 字段不能为空', type: 'invalid_request_error' } }),
      { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }

  try {
    if (body.stream) {
      const resp = await fetchUpstream(body);
      const raw = await resp.text();
      return createStreamResponse(body, raw);
    }
    return await handleNonStream(body);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: { message: err.message || '内部错误', type: 'server_error' } }),
      { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }
}