import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'MenteSolidária',
  description: 'Plataforma de apoio em saúde mental com encaminhamento social.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link className="text-lg font-bold text-blue-700" href="/">
              🧠 MenteSolidária
            </Link>
            <div className="flex gap-4 text-sm font-medium">
              <Link href="/login">Login</Link>
              <Link href="/dashboard/profissional">Dashboard</Link>
              <Link href="/pacientes">Pacientes</Link>
              <Link href="/profissionais">Profissionais</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
