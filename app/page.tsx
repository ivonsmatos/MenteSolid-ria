import Link from 'next/link';
import { ChatAcolhimento } from '@/components/acolhimento/ChatAcolhimento';
import { getServerSession } from '@/lib/auth/config';

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Plataforma de acolhimento em saúde mental gratuita</h1>
      <p className="max-w-3xl text-slate-700">
        O MenteSolidária conecta pessoas em vulnerabilidade a profissionais voluntários por meio de triagem
        estruturada e encaminhamento humanizado.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Link className="rounded-lg bg-white p-6 shadow hover:shadow-md" href="/pacientes">
          <h2 className="text-xl font-semibold">Pacientes</h2>
          <p className="mt-2 text-slate-600">Cadastre, busque e acompanhe o encaminhamento inicial.</p>
        </Link>
        <Link className="rounded-lg bg-white p-6 shadow hover:shadow-md" href="/profissionais">
          <h2 className="text-xl font-semibold">Profissionais voluntários</h2>
          <p className="mt-2 text-slate-600">Gerencie especialistas parceiros para encaminhamento seguro.</p>
        </Link>
      </div>
      {session ? <ChatAcolhimento /> : null}
    </section>
  );
}
