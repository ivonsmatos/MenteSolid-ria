import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      nome: string;
      email: string;
      perfil?: 'paciente' | 'profissional';
      crp_crm?: string;
    };
  }

  interface User {
    perfil?: 'paciente' | 'profissional';
    crp_crm?: string;
    supabaseAccessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    nome?: string;
    perfil?: 'paciente' | 'profissional';
    crp_crm?: string;
    supabaseAccessToken?: string;
  }
}
