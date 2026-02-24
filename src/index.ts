import { handleChatCompletions } from './chat';
import { handleModels } from './models';
import { renderDemoPage } from './page';
import { CORS_HEADERS } from './utils';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (path === '/' && request.method === 'GET') {
      return new Response(renderDemoPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (
      (path === '/v1/chat/completions' || path === '/chat/completions') &&
      request.method === 'POST'
    ) {
      return handleChatCompletions(request);
    }

    if (
      (path === '/v1/models' || path === '/models') &&
      request.method === 'GET'
    ) {
      return handleModels();
    }

    return new Response(
      JSON.stringify({ error: { message: 'Not Found', type: 'invalid_request_error' } }),
      { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  },
};
