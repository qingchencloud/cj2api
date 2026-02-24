import type { ChatMessage, ChatRequest, UpstreamPayload } from './types';
import { DEFAULT_MODEL } from './utils';

const UPSTREAM_URL = 'https://chatjimmy.ai/api/chat';

const UPSTREAM_HEADERS = {
  'content-type': 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

function extractSystemPrompt(messages: ChatMessage[]): {
  chatMessages: ChatMessage[];
  systemPrompt: string;
} {
  const systemParts: string[] = [];
  const chatMessages: ChatMessage[] = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemParts.push(msg.content);
    } else {
      chatMessages.push(msg);
    }
  }

  return { chatMessages, systemPrompt: systemParts.join('\n') };
}

export async function fetchUpstream(body: ChatRequest): Promise<Response> {
  const model = body.model || DEFAULT_MODEL;
  const topK = body.top_k ?? body.topK ?? 8;
  const messages = body.messages ?? [];

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('messages 不能为空');
  }

  const { chatMessages, systemPrompt } = extractSystemPrompt(messages);

  const payload: UpstreamPayload = {
    messages: chatMessages,
    chatOptions: { selectedModel: model, systemPrompt, topK },
    attachment: null,
  };

  const resp = await fetch(UPSTREAM_URL, {
    method: 'POST',
    headers: UPSTREAM_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    throw new Error(`上游返回 ${resp.status}: ${detail}`);
  }

  return resp;
}
