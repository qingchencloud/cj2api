import { DEFAULT_MODEL, CORS_HEADERS } from './utils';

export function handleModels(): Response {
  const data = {
    object: 'list',
    data: [
      {
        id: DEFAULT_MODEL,
        object: 'model',
        created: 1700000000,
        owned_by: 'system',
        permission: [],
      },
    ],
  };

  return new Response(JSON.stringify(data), {
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
