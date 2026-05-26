import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { absoluteUrl, getSiteUrl } from '@/lib/seo';

describe('seo helpers', () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_URL;
  beforeEach(() => { delete process.env.NEXT_PUBLIC_APP_URL; });
  afterEach(() => {
    if (originalEnv === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
    else process.env.NEXT_PUBLIC_APP_URL = originalEnv;
  });

  it('getSiteUrl usa fallback localhost', () => {
    expect(getSiteUrl()).toBe('http://localhost:3000');
  });

  it('getSiteUrl remove barra final', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://mentesolidaria.org/';
    expect(getSiteUrl()).toBe('https://mentesolidaria.org');
  });

  it('absoluteUrl monta URL absoluta com barra inicial', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://mentesolidaria.org';
    expect(absoluteUrl('/cadastro-paciente')).toBe('https://mentesolidaria.org/cadastro-paciente');
  });

  it('absoluteUrl funciona sem barra inicial', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://mentesolidaria.org';
    expect(absoluteUrl('cadastro-paciente')).toBe('https://mentesolidaria.org/cadastro-paciente');
  });
});
