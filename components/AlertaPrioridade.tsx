import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export function AlertaPrioridade() {
  return (
    <div
      className="mb-4 rounded-2xl border border-coral/20 bg-coral-50 p-4 text-coral-700"
      role="alert"
    >
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-5 w-5" />
        ATENÇÃO: caso prioritário — CVV 188
      </div>
      <Link
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-coral px-4 py-1.5 text-sm font-semibold text-white hover:bg-coral-500"
        href="tel:188"
      >
        Ligar para o CVV 188
      </Link>
    </div>
  );
}
