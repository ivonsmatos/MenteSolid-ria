import 'server-only';

const GROQ_BASE_URL = process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1';
const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  role: ChatRole;
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ChatToolCall[];
}

export interface ChatToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export interface ChatTool {
  type: 'function';
  function: { name: string; description: string; parameters: object };
}

export interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    index: number;
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | string;
    message: ChatMessage;
  }>;
}

export class GroqError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = 'GroqError';
  }
}

export async function chatCompletion(params: {
  messages: ChatMessage[];
  tools?: ChatTool[];
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  temperature?: number;
  maxTokens?: number;
}): Promise<ChatCompletionResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqError('GROQ_API_KEY não configurada.', 500);
  }

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: params.messages,
      tools: params.tools,
      tool_choice: params.toolChoice ?? (params.tools ? 'auto' : undefined),
      temperature: params.temperature ?? 0.3,
      max_tokens: params.maxTokens ?? 800
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new GroqError(
      `Falha Groq (${response.status}): ${detail.slice(0, 200)}`,
      response.status
    );
  }

  return (await response.json()) as ChatCompletionResponse;
}
