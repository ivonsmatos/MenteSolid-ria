import type { Metadata } from 'next';
import { Award, BookOpen, CalendarCheck, Users } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { SecaoBeneficios } from '@/components/SecaoBeneficios';
import { CTAFinal } from '@/components/CTAFinal';
import { JsonLd } from '@/components/JsonLd';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Para profissionais voluntários (psicólogos e psiquiatras)',
  description:
    'Seja voluntário(a) no MenteSolidária. Receba casos triados, agenda integrada com Cal.com, certificação de horas e plataforma segura sob LGPD.',
  alternates: { canonical: '/para-profissionais' },
  keywords: ['voluntariado psicólogo', 'voluntariado psiquiatra', 'CRP CRM voluntário', 'plataforma saúde mental']
};

const jobPostingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VolunteerOpportunity',
  name: 'Voluntariado em saúde mental — MenteSolidária',
  description:
    'Oportunidade de voluntariado para psicólogos (CRP) e psiquiatras (CRM) atenderem pessoas em vulnerabilidade socioeconômica.',
  url: absoluteUrl('/para-profissionais'),
  hiringOrganization: { '@type': 'Organization', name: 'MenteSolidária' },
  applicantLocationRequirements: { '@type': 'Country', name: 'Brasil' },
  jobLocationType: 'TELECOMMUTE',
  qualifications: 'Registro ativo em CRP (psicólogos) ou CRM (psiquiatras).'
};

export default function ParaProfissionaisPage() {
  return (
    <>
      <JsonLd data={jobPostingJsonLd} />
      <Hero
        chapeu="Para profissionais"
        ctas={[
          { href: '/login', label: 'Quero ser voluntário(a)' },
          { href: '/impacto', label: 'Ver impacto', variante: 'secondary' }
        ]}
        imagem="profissionalEscuta"
        subtitulo="Atenda casos triados, com contexto clínico organizado pela IA e gestão integrada de agenda. Sem planilhas, sem WhatsApp informal."
        titulo="Sua hora voluntária com o impacto que ela merece."
        tom="leaf"
      />

      <SecaoBeneficios
        chapeu="Vantagens"
        itens={[
          { icone: <BookOpen className="h-6 w-6" />, titulo: 'Triagem estruturada', texto: 'Cada caso chega com motivo, sintomas, impacto e sinal de risco já organizados.' },
          { icone: <Users className="h-6 w-6" />, titulo: 'Fila inteligente', texto: 'Casos prioritários (com sinal de alerta) aparecem primeiro no seu painel.' },
          { icone: <CalendarCheck className="h-6 w-6" />, titulo: 'Cal.com integrado', texto: 'Seu link de agendamento aparece para o paciente assim que você assume o caso.' },
          { icone: <Award className="h-6 w-6" />, titulo: 'Certificação de horas', texto: 'Certificado imprimível com horas voluntárias acumuladas — válido para currículo e concursos.' },
          { icone: <BookOpen className="h-6 w-6" />, titulo: 'Sem custo', texto: 'A plataforma é gratuita para o atendimento social.' },
          { icone: <Users className="h-6 w-6" />, titulo: 'Carteira particular (opcional)', texto: 'Plano Freemium libera os mesmos recursos para sua carteira de pacientes pagantes.' }
        ]}
        subtitulo="Desenhado por e para profissionais voluntários, com salvaguardas clínicas e tecnologia leve."
        titulo="O painel que respeita seu tempo"
      />

      <section className="bg-mint-100 py-16">
        <div className="container-page mx-auto max-w-3xl space-y-3 text-slate-800">
          <h2 className="text-2xl font-bold text-slate-900">Requisitos para ser voluntário(a)</h2>
          <ul className="space-y-2 text-lg">
            <li>· Registro ativo em <strong>CRP</strong> (psicólogos) ou <strong>CRM</strong> (psiquiatras).</li>
            <li>· Disponibilidade mínima recomendada de 2 atendimentos por mês.</li>
            <li>· Aceitar nossos princípios éticos (sem diagnóstico via IA, CVV em risco, LGPD).</li>
            <li>· Cadastro autorizado pela equipe administrativa.</li>
          </ul>
          <p className="text-sm text-slate-600">
            O cadastro é por convite. Solicite acesso pelo botão abaixo.
          </p>
        </div>
      </section>

      <CTAFinal
        ctaPrimario={{ href: '/contato?assunto=voluntariado', label: 'Quero me cadastrar' }}
        ctaSecundario={{ href: '/como-funciona', label: 'Como funciona' }}
        titulo="Seu próximo paciente está esperando alguém como você."
        tom="coral"
      />
    </>
  );
}
