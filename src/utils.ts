import type { UpstreamStats } from './types';

export const DEFAULT_MODEL = 'llama3.1-8B';

export function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `chatcmpl-${id}`;
}

export function parseUpstreamResponse(raw: string): {
  content: string;
  stats: UpstreamStats | null;
} {
  const statsStart = raw.lastIndexOf('<|stats|>');
  if (statsStart === -1) {
    return { content: raw, stats: null };
  }

  const content = raw.substring(0, statsStart);
  const statsEnd = raw.lastIndexOf('<|/stats|>');
  if (statsEnd === -1) {
    return { content, stats: null };
  }

  const statsJson = raw.substring(statsStart + 9, statsEnd);
  try {
    return { content, stats: JSON.parse(statsJson) };
  } catch {
    return { content, stats: null };
  }
}

export function buildUsage(stats: UpstreamStats | null) {
  return {
    prompt_tokens: stats?.prefill_tokens ?? -1,
    completion_tokens: stats?.decode_tokens ?? -1,
    total_tokens: stats?.total_tokens ?? -1,
  };
}

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
