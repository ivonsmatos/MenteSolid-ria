import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';

export function CVVBanner() {
  return (
    <div
      aria-label="Centro de Valorização da Vida"
      className="sticky bottom-0 z-40 border-t border-red-300 bg-red-50/95 backdrop-blur"
      role="region"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-3 text-sm">
        <div className="flex items-center gap-2 text-red-900">
          <LifeBuoy aria-hidden className="h-5 w-5" />
          <span>
            Em crise? Ligue para o <strong>CVV</strong> a qualquer hora, gratuitamente.
          </span>
        </div>
        <Link
          className="rounded bg-red-700 px-3 py-1 font-semibold text-white hover:bg-red-800"
          href="tel:188"
        >
          Ligar 188
        </Link>
      </div>
    </div>
  );
}
