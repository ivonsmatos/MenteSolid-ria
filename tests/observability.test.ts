import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { captureError, logInfo, logWarn } from '@/lib/observability';

describe('observability', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errSpy.mockRestore();
  });

  it('logInfo emite JSON em console.log', () => {
    logInfo('hello', { x: 1 });
    expect(logSpy).toHaveBeenCalledTimes(1);
    const arg = logSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(arg);
    expect(parsed.level).toBe('info');
    expect(parsed.msg).toBe('hello');
    expect(parsed.context).toEqual({ x: 1 });
    expect(typeof parsed.occurredAt).toBe('string');
  });

  it('logWarn emite em console.warn', () => {
    logWarn('atenção');
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('captureError serializa Error', () => {
    captureError(new Error('boom'), { rota: '/x' });
    expect(errSpy).toHaveBeenCalledTimes(1);
    const arg = errSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(arg);
    expect(parsed.level).toBe('error');
    expect(parsed.err.message).toBe('boom');
    expect(parsed.context).toEqual({ rota: '/x' });
  });

  it('captureError trata non-Error', () => {
    captureError('string puro');
    const arg = errSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(arg);
    expect(parsed.err.message).toBe('string puro');
    expect(parsed.err.name).toBe('NonError');
  });
});
