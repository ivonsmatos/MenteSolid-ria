// Camada mínima de observabilidade.
// Hoje: log estruturado em stdout (compatível com Cloudflare/Vercel/etc.).
// Upgrade fácil: substituir `emit` por chamada ao Sentry/Logflare/Axiom etc.

export interface LogEvent {
  level: 'info' | 'warn' | 'error';
  msg: string;
  context?: Record<string, unknown>;
  err?: { name?: string; message?: string; stack?: string };
  occurredAt: string;
}

function emit(event: LogEvent): void {
  // eslint-disable-next-line no-console
  const writer = event.level === 'error' ? console.error : event.level === 'warn' ? console.warn : console.log;
  try {
    writer(JSON.stringify(event));
  } catch {
    writer(`[obs] ${event.level} ${event.msg}`);
  }
}

function isoNow(): string {
  return new Date().toISOString();
}

export function logInfo(msg: string, context?: Record<string, unknown>): void {
  emit({ level: 'info', msg, context, occurredAt: isoNow() });
}

export function logWarn(msg: string, context?: Record<string, unknown>): void {
  emit({ level: 'warn', msg, context, occurredAt: isoNow() });
}

export function captureError(err: unknown, context?: Record<string, unknown>): void {
  const errObj =
    err instanceof Error
      ? { name: err.name, message: err.message, stack: err.stack }
      : { name: 'NonError', message: String(err) };
  emit({
    level: 'error',
    msg: errObj.message,
    err: errObj,
    context,
    occurredAt: isoNow()
  });
}
