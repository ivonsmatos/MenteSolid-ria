import { describe, expect, it } from 'vitest';
import { fromFhirPatient, toFhirPatient } from '@/lib/medplum/patient';

describe('medplum/patient', () => {
  it('deve mapear paciente local completo para FHIR Patient', () => {
    const fhir = toFhirPatient({
      id: 'pac-1',
      nome: 'Ana Maria Silva',
      cpf: '12345678900',
      dataNascimento: '1990-01-01',
      telefone: '11999999999',
      email: 'ana@example.com',
      genero: 'feminino',
      vulnerabilidadeSocioeconomica: true
    });

    expect(fhir.resourceType).toBe('Patient');
    expect(fhir.identifier?.[0]?.value).toBe('12345678900');
    expect(fhir.extension?.[0]?.valueBoolean).toBe(true);
    expect(fhir.gender).toBe('female');
    expect(fhir.telecom).toHaveLength(2);
  });

  it('deve mapear Patient FHIR para modelo local com campos opcionais', () => {
    const local = fromFhirPatient({
      resourceType: 'Patient',
      id: 'pac-2',
      name: [{ text: 'João Souza' }],
      identifier: [{ system: 'https://mentesolidaria.com.br/cpf', value: '11122233344' }],
      extension: [
        {
          url: 'https://mentesolidaria.com.br/fhir/StructureDefinition/vulnerabilidade-socioeconomica',
          valueBoolean: false
        }
      ]
    });

    expect(local.id).toBe('pac-2');
    expect(local.nome).toBe('João Souza');
    expect(local.cpf).toBe('11122233344');
    expect(local.vulnerabilidadeSocioeconomica).toBe(false);
  });
});
