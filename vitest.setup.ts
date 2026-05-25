import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('@/lib/supabase/client', () => ({
  supabaseClient: {
    from: vi.fn()
  },
  supabaseAdmin: {
    from: vi.fn(),
    auth: {
      admin: {
        createUser: vi.fn()
      }
    }
  }
}));

vi.mock('@/lib/groq/client', () => ({
  groqClient: {
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  },
  groqConfig: {
    modeloPadrao: 'llama3-70b-8192'
  }
}));

vi.mock('@/lib/medplum/client', () => ({
  medplumClient: {
    createResource: vi.fn(),
    readResource: vi.fn()
  },
  ensureMedplumAuth: vi.fn()
}));
