export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  stream?: boolean;
  top_k?: number;
  topK?: number;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: {
    index: number;
    message: { role: 'assistant'; content: string };
    finish_reason: 'stop' | 'length';
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: {
    index: number;
    delta: { role?: string; content?: string };
    finish_reason: string | null;
  }[];
}

export interface UpstreamStats {
  prefill_tokens?: number;
  decode_tokens?: number;
  total_tokens?: number;
  done_reason?: string;
}

export interface UpstreamPayload {
  messages: ChatMessage[];
  chatOptions: {
    selectedModel: string;
    systemPrompt: string;
    topK: number;
  };
  attachment: null;
}
