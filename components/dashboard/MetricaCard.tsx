import { ReactNode } from 'react';

interface MetricaCardProps {
  icon: ReactNode;
  valor: string | number;
  label: string;
}

export function MetricaCard({ icon, valor, label }: MetricaCardProps) {
  return (
    <article className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-center gap-3">
        <div className="rounded bg-blue-50 p-2 text-blue-700">{icon}</div>
        <div>
          <p className="text-2xl font-semibold">{valor}</p>
          <p className="text-sm text-slate-600">{label}</p>
        </div>
      </div>
    </article>
  );
}
