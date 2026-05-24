import { PacienteForm } from '@/components/PacienteForm';

export default function NovoPacientePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Cadastro de paciente</h1>
      <PacienteForm />
    </section>
  );
}
