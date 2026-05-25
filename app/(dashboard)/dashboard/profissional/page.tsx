import { Activity, Clock3, Users } from 'lucide-react';
import { MetricaCard } from '@/components/dashboard/MetricaCard';
import { USE_SUPABASE } from '@/lib/env';
import { getPacientes } from '@/lib/db';
import { listarPacientes } from '@/lib/supabase/pacientes';
import { listTriagensByProfissionalDb } from '@/lib/db';
import { listarTriagens } from '@/lib/supabase/triagens';
import { listEncaminhamentosByDestinoDb } from '@/lib/db';
import { listarEncaminhamentos } from '@/lib/supabase/encaminhamentos';
import { CalendarioAgendamento } from '@/components/agendamento/CalendarioAgendamento';

const PROFISSIONAL_EXEMPLO_ID = 'psicologia';

export default async function DashboardProfissionalPage() {
  const pacientes = USE_SUPABASE
    ? await listarPacientes({ profissionalId: undefined, perPage: 100 })
    : await getPacientes();

  const triagens = USE_SUPABASE
    ? await listarTriagens(PROFISSIONAL_EXEMPLO_ID)
    : await listTriagensByProfissionalDb(PROFISSIONAL_EXEMPLO_ID);

  const encaminhamentos = USE_SUPABASE
    ? await listarEncaminhamentos(PROFISSIONAL_EXEMPLO_ID)
    : await listEncaminhamentosByDestinoDb(PROFISSIONAL_EXEMPLO_ID);

  const hoje = new Date().toISOString().slice(0, 10);
  const triagensHoje = triagens.filter((triagem) => triagem.created_at?.startsWith?.(hoje)).length;
  const pendentes = encaminhamentos.filter((encaminhamento) => encaminhamento.status === 'pendente').length;
  const prioridadeAlta = triagens.filter(
    (triagem) => triagem.nivel_prioridade === 'alta' || triagem.nivel_prioridade === 'urgente'
  );

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do profissional</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricaCard icon={<Users size={18} />} label="Total de pacientes" valor={pacientes.length} />
        <MetricaCard icon={<Activity size={18} />} label="Triagens hoje" valor={triagensHoje} />
        <MetricaCard icon={<Clock3 size={18} />} label="Encaminhamentos pendentes" valor={pendentes} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3 rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold">Encaminhamentos recentes</h2>
          <ul className="space-y-2 text-sm">
            {encaminhamentos.slice(0, 5).map((encaminhamento) => (
              <li className="rounded border p-2" key={encaminhamento.id}>
                Paciente #{encaminhamento.paciente_id} — <strong>{encaminhamento.status}</strong>
              </li>
            ))}
            {!encaminhamentos.length ? <li>Nenhum encaminhamento recente.</li> : null}
          </ul>
        </section>

        <CalendarioAgendamento
          emailPaciente="paciente@example.com"
          nomePaciente="Paciente"
          profissionalId={PROFISSIONAL_EXEMPLO_ID}
        />
      </div>

      <section className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h2 className="text-lg font-semibold text-red-800">Alertas de prioridade alta</h2>
        <ul className="mt-2 space-y-1 text-sm text-red-700">
          {prioridadeAlta.slice(0, 5).map((triagem) => (
            <li key={triagem.id}>Triagem #{triagem.id} marcada como {triagem.nivel_prioridade}.</li>
          ))}
          {!prioridadeAlta.length ? <li>Sem casos críticos no momento.</li> : null}
        </ul>
      </section>
    </section>
  );
}
