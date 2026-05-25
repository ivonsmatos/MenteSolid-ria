import type { Session } from 'next-auth';

export function requireAuth(session: Session | null): asserts session is Session {
  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado.');
  }
}

export function requireProfissional(session: Session | null): asserts session is Session {
  requireAuth(session);
  if (session.user.perfil !== 'profissional') {
    throw new Error('Acesso permitido apenas para profissionais.');
  }
}

export function requirePaciente(session: Session | null): asserts session is Session {
  requireAuth(session);
  if (session.user.perfil !== 'paciente') {
    throw new Error('Acesso permitido apenas para pacientes.');
  }
}
