import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';

export function CVVBanner() {
  return (
    <div
      aria-label="Centro de Valorização da Vida"
      className="sticky bottom-0 z-40 border-t border-coral/20 bg-coral text-white shadow-soft"
      role="region"
    >
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
        <div className="flex items-center gap-2">
          <LifeBuoy aria-hidden className="h-5 w-5" />
          <span>
            Em crise? Ligue para o <strong>CVV</strong> a qualquer hora, gratuitamente.
          </span>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-full bg-sun-200 px-4 py-1.5 font-semibold text-coral-700 hover:bg-sun-300"
          href="tel:188"
        >
          Ligar 188
        </Link>
      </div>
    </div>
  );
}
