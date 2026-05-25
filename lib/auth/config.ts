import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getServerSession as nextGetServerSession, type NextAuthOptions } from 'next-auth';
import { supabaseAdmin, supabaseClient } from '@/lib/supabase/client';

type PerfilUsuario = 'paciente' | 'profissional';

async function carregarPerfil(email: string): Promise<{
  id?: string;
  nome?: string;
  perfil?: PerfilUsuario;
  crp_crm?: string;
}> {
  const [{ data: paciente }, { data: profissional }] = await Promise.all([
    supabaseAdmin.from('pacientes').select('id,nome,email').eq('email', email).maybeSingle(),
    supabaseAdmin
      .from('profissionais')
      .select('id,nome,email,crp_crm')
      .eq('email', email)
      .maybeSingle()
  ]);

  if (profissional) {
    return {
      id: profissional.id,
      nome: profissional.nome,
      perfil: 'profissional',
      crp_crm: profissional.crp_crm
    };
  }

  if (paciente) {
    return {
      id: paciente.id,
      nome: paciente.nome,
      perfil: 'paciente'
    };
  }

  return {};
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        senha: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const senha = credentials?.senha;

        if (!email || !senha) {
          return null;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password: senha
        });

        if (error || !data.user) {
          return null;
        }

        const perfil = await carregarPerfil(email);

        return {
          id: perfil.id ?? data.user.id,
          email,
          name: perfil.nome ?? data.user.user_metadata?.name ?? email,
          perfil: perfil.perfil,
          crp_crm: perfil.crp_crm,
          supabaseAccessToken: data.session?.access_token
        } as {
          id: string;
          email: string;
          name: string;
          perfil?: PerfilUsuario;
          crp_crm?: string;
          supabaseAccessToken?: string;
        };
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : [])
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? undefined;
        token.nome = user.name ?? undefined;
        token.email = user.email ?? undefined;
        token.perfil = (user as { perfil?: PerfilUsuario }).perfil;
        token.crp_crm = (user as { crp_crm?: string }).crp_crm;
        token.supabaseAccessToken = (user as { supabaseAccessToken?: string }).supabaseAccessToken;
      }

      if (token.email && (!token.perfil || !token.id)) {
        const perfil = await carregarPerfil(token.email);
        token.id = perfil.id ?? token.id;
        token.nome = perfil.nome ?? token.nome;
        token.perfil = perfil.perfil ?? token.perfil;
        token.crp_crm = perfil.crp_crm ?? token.crp_crm;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.nome = (token.nome as string | undefined) ?? session.user.nome ?? '';
        session.user.email = (token.email as string | undefined) ?? session.user.email ?? '';
        session.user.perfil = token.perfil as PerfilUsuario | undefined;
        session.user.crp_crm = token.crp_crm as string | undefined;
      }

      return session;
    }
  }
};

export function getServerSession() {
  return nextGetServerSession(authOptions);
}
