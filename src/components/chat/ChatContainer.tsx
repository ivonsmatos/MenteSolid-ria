'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import type { Mensagem } from '@/types';

const CVV_PATTERN = /(cvv|188|risco de vida|suicídio|suicidio)/i;

export function ChatContainer() {
  const [messages, setMessages] = useState<Mensagem[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Olá, eu sou o assistente de acolhimento inicial da MenteSolidária. Estou aqui para te ouvir com cuidado e respeito. Como você está hoje?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCVVAlert, setShowCVVAlert] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const payloadMessages = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;

    const userMessage: Mensagem = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage: Mensagem = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...payloadMessages, { role: 'user', content }] })
      });

      if (!response.ok || !response.body) {
        throw new Error('Falha ao iniciar streaming da IA.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamFinished = false;

      while (!streamFinished) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        while (buffer.includes('\n\n')) {
          const separatorIndex = buffer.indexOf('\n\n');
          const rawEvent = buffer.slice(0, separatorIndex);
          buffer = buffer.slice(separatorIndex + 2);
          const eventData = rawEvent
            .split('\n')
            .find((line) => line.startsWith('data: '))
            ?.replace('data: ', '')
            .trim();

          if (!eventData) continue;
          if (eventData === '[DONE]') {
            streamFinished = true;
            break;
          }

          const { text } = JSON.parse(eventData) as { text?: string };
          if (!text) continue;

          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content: `${message.content}${text}`,
                    alertaCVV: CVV_PATTERN.test(`${message.content}${text}`)
                  }
                : message
            )
          );

          if (CVV_PATTERN.test(text)) {
            setShowCVVAlert(true);
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: 'Desculpe, tivemos uma instabilidade temporária. Tente novamente em alguns instantes.'
              }
            : message
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='mx-auto w-full max-w-3xl rounded-2xl border bg-card p-4 shadow-sm'>
      {showCVVAlert && (
        <div className='mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
          <AlertTriangle className='h-4 w-4' />
          Se houver risco imediato, ligue gratuitamente para o CVV 188 (24h).
        </div>
      )}
      <ScrollArea className='h-[360px] pr-3'>
        <div className='space-y-4'>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <Separator className='my-4' />
      <ChatInput value={input} onChange={setInput} onSubmit={sendMessage} loading={loading} />
    </section>
  );
}
