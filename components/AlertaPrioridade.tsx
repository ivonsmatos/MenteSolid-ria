import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export function AlertaPrioridade() {
  return (
    <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-4 text-red-900">
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-5 w-5" />
        ATENÇÃO: Caso prioritário — CVV: 188
      </div>
      <Link className="mt-2 inline-block underline" href="tel:188">
        Ligar para o CVV 188
      </Link>
    </div>
  );
}
