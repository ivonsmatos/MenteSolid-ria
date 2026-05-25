import type { LocalTriagem } from '@/types/fhir';
import { groqClient, groqConfig } from '@/lib/groq/client';

interface DadosPacienteTriagem {
  nome?: string;
  idade?: number;
  historico?: string;
}

function classificarPrioridade(respostas: string): LocalTriagem['prioridade'] {
  const texto = respostas.toLowerCase();
  if (texto.includes('suic') || texto.includes('morrer')) {
    return 'urgente';
  }

  if (texto.includes('crise') || texto.includes('pânico') || texto.includes('violência')) {
    return 'alta';
  }

  if (texto.includes('ansiedade') || texto.includes('tristeza')) {
    return 'media';
  }

  return 'baixa';
}

export async function analisarTriagem(
  dadosPaciente: DadosPacienteTriagem,
  respostasFormulario: string
): Promise<{ nivelPrioridade: LocalTriagem['prioridade']; dadosEstruturados: Partial<LocalTriagem> }> {
  const nivelPrioridade = classificarPrioridade(respostasFormulario);

  if (!process.env.GROQ_API_KEY) {
    return {
      nivelPrioridade,
      dadosEstruturados: {
        prioridade: nivelPrioridade,
        sinalDeAlerta: nivelPrioridade === 'alta' || nivelPrioridade === 'urgente',
        alertaCVV188: nivelPrioridade === 'urgente'
      } as Partial<LocalTriagem>
    };
  }

  const completion = await groqClient.chat.completions.create({
    model: groqConfig.modeloPadrao,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content:
          'Extraia dados estruturados de triagem em JSON com os campos prioridade, sinaisRisco, sintomas e observacoes.'
      },
      {
        role: 'user',
        content: `Paciente: ${JSON.stringify(dadosPaciente)}\nRespostas: ${respostasFormulario}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  return {
    nivelPrioridade: (parsed.prioridade as LocalTriagem['prioridade']) ?? nivelPrioridade,
    dadosEstruturados: {
      prioridade: (parsed.prioridade as LocalTriagem['prioridade']) ?? nivelPrioridade,
      sintomasRelatados: Array.isArray(parsed.sintomas) ? (parsed.sintomas as string[]) : undefined,
      sinalDeAlerta: Boolean(parsed.sinaisRisco),
      alertaCVV188: Boolean(parsed.sinaisRisco)
    }
  };
}

export async function gerarResumoClinco(triagem: Partial<LocalTriagem>): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return [
      `Prioridade: ${triagem.prioridade ?? 'não informada'}`,
      `Motivo da busca: ${triagem.motivoDaBusca ?? 'não informado'}`,
      `Impacto na rotina: ${triagem.impactoNaRotina ?? 'não informado'}`
    ].join('\n');
  }

  const completion = await groqClient.chat.completions.create({
    model: groqConfig.modeloPadrao,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: 'Gere um resumo clínico estruturado e objetivo para encaminhamento, sem diagnóstico.'
      },
      {
        role: 'user',
        content: JSON.stringify(triagem)
      }
    ]
  });

  return completion.choices[0]?.message?.content?.trim() ?? '';
}
