import { HeartHandshake, CalendarCheck2, BotMessageSquare } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <Header />
      <main className='mx-auto max-w-6xl px-4 py-10'>
        <section className='text-center'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            Você não precisa passar por isso sozinho.
          </h1>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-muted-foreground'>
            A MenteSolidária oferece acolhimento inicial com empatia e encaminhamento para profissionais voluntários.
          </p>
          <Button className='mt-6' asChild>
            <a href='#chat'>Começar acolhimento</a>
          </Button>
        </section>

        <section id='recursos' className='mt-12 grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <BotMessageSquare className='h-6 w-6 text-primary' />
              <CardTitle>Acolhimento IA</CardTitle>
              <CardDescription>Escuta inicial com linguagem humanizada e foco em segurança.</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
          <Card>
            <CardHeader>
              <HeartHandshake className='h-6 w-6 text-primary' />
              <CardTitle>Encaminhamento</CardTitle>
              <CardDescription>Triagem responsável para conectar você ao cuidado adequado.</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
          <Card>
            <CardHeader>
              <CalendarCheck2 className='h-6 w-6 text-primary' />
              <CardTitle>Agendamento</CardTitle>
              <CardDescription>Organize o primeiro atendimento com praticidade e acolhimento.</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </section>

        <section id='chat' className='mt-12'>
          <ChatContainer />
        </section>
      </main>
      <Footer />
    </div>
  );
}
