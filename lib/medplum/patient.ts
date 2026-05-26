import type { Patient } from '@medplum/fhirtypes';
import type { LocalPatient } from '@/types/fhir';

const CPF_SYSTEM = 'https://mentesolidaria.com.br/cpf';
const VULNERABILIDADE_EXTENSION_URL =
  'https://mentesolidaria.com.br/fhir/StructureDefinition/vulnerabilidade-socioeconomica';

function splitName(nome: string): { given: string[]; family?: string } {
  const parts = nome.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return { given: parts.length ? parts : ['Não informado'] };
  }

  return {
    given: parts.slice(0, -1),
    family: parts[parts.length - 1]
  };
}

function mapGeneroToFhir(
  genero: LocalPatient['genero']
): Patient['gender'] | undefined {
  if (!genero) {
    return undefined;
  }

  const map: Record<NonNullable<LocalPatient['genero']>, NonNullable<Patient['gender']>> = {
    masculino: 'male',
    feminino: 'female',
    nao_binario: 'other',
    prefiro_nao_dizer: 'unknown'
  };

  return map[genero];
}

function mapGeneroFromFhir(gender: Patient['gender']): LocalPatient['genero'] | undefined {
  if (!gender) {
    return undefined;
  }

  const map: Record<NonNullable<Patient['gender']>, NonNullable<LocalPatient['genero']>> = {
    male: 'masculino',
    female: 'feminino',
    other: 'nao_binario',
    unknown: 'prefiro_nao_dizer'
  };

  return map[gender];
}

// Converte o modelo local para FHIR Patient mantendo CPF e vulnerabilidade em campos padronizados.
export function toFhirPatient(localPatient: LocalPatient): Patient {
  const split = splitName(localPatient.nome);

  return {
    resourceType: 'Patient',
    id: localPatient.id,
    name: [
      {
        use: 'official',
        given: split.given,
        family: split.family,
        text: localPatient.nome
      }
    ],
    identifier: localPatient.cpf
      ? [
          {
            system: CPF_SYSTEM,
            value: localPatient.cpf
          }
        ]
      : undefined,
    birthDate: localPatient.dataNascimento ?? undefined,
    gender: mapGeneroToFhir(localPatient.genero),
    telecom: [
      ...(localPatient.telefone
        ? [
            {
              system: 'phone' as const,
              value: localPatient.telefone,
              use: 'mobile' as const
            }
          ]
        : []),
      ...(localPatient.email
        ? [
            {
              system: 'email' as const,
              value: localPatient.email,
              use: 'home' as const
            }
          ]
        : [])
    ],
    extension:
      typeof localPatient.vulnerabilidadeSocioeconomica === 'boolean'
        ? [
            {
              url: VULNERABILIDADE_EXTENSION_URL,
              valueBoolean: localPatient.vulnerabilidadeSocioeconomica
            }
          ]
        : undefined
  };
}

// Converte o Patient do Medplum para o formato local usado no produto.
export function fromFhirPatient(fhirPatient: Patient): LocalPatient {
  const nomeCompleto =
    fhirPatient.name?.[0]?.text ??
    `${fhirPatient.name?.[0]?.given?.join(' ') ?? ''} ${fhirPatient.name?.[0]?.family ?? ''}`.trim() ??
    'Não informado';

  const cpf = fhirPatient.identifier?.find((identifier) => identifier.system === CPF_SYSTEM)?.value;
  const telefone = fhirPatient.telecom?.find((contact) => contact.system === 'phone')?.value;
  const email = fhirPatient.telecom?.find((contact) => contact.system === 'email')?.value;
  const vulnerabilidade = fhirPatient.extension?.find(
    (extension) => extension.url === VULNERABILIDADE_EXTENSION_URL
  )?.valueBoolean;

  return {
    id: fhirPatient.id,
    nome: nomeCompleto || 'Não informado',
    cpf,
    dataNascimento: fhirPatient.birthDate,
    telefone,
    email,
    genero: mapGeneroFromFhir(fhirPatient.gender),
    vulnerabilidadeSocioeconomica:
      typeof vulnerabilidade === 'boolean' ? vulnerabilidade : undefined
  };
}
