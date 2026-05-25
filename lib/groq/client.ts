import Groq from 'groq-sdk';

const GROQ_MODEL_PADRAO = 'llama3-70b-8192';
const apiKey = process.env.GROQ_API_KEY ?? 'gsk_placeholder';

const globalForGroq = globalThis as unknown as { groqClientSingleton?: Groq };

export const groqClient =
  globalForGroq.groqClientSingleton ??
  new Groq({
    apiKey
  });

if (!globalForGroq.groqClientSingleton) {
  globalForGroq.groqClientSingleton = groqClient;
}

export const groqConfig = {
  modeloPadrao: GROQ_MODEL_PADRAO
};
