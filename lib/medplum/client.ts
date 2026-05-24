import 'server-only';
import { MedplumClient } from '@medplum/core';

const medplumBaseUrl = process.env.NEXT_PUBLIC_MEDPLUM_BASE_URL ?? 'https://api.medplum.com/';
const medplumClientId = process.env.MEDPLUM_CLIENT_ID;
const medplumClientSecret = process.env.MEDPLUM_CLIENT_SECRET;

// Singleton centralizado para manter uma única instância de conexão com o Medplum.
export const medplumClient: MedplumClient = new MedplumClient({
  baseUrl: medplumBaseUrl,
  clientId: medplumClientId,
  clientSecret: medplumClientSecret
});

let authPromise: Promise<void> | null = null;

// Faz login client credentials quando necessário, evitando múltiplos logins concorrentes.
export async function ensureMedplumAuth(): Promise<void> {
  if (!medplumClientId || !medplumClientSecret) {
    throw new Error('Credenciais do Medplum não configuradas.');
  }

  if (!authPromise) {
    authPromise = medplumClient
      .startClientLogin(medplumClientId, medplumClientSecret)
      .then(() => undefined)
      .catch((error) => {
        authPromise = null;
        throw error;
      });
  }

  await authPromise;
}
