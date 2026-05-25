import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Mensagem } from '@/types';

interface ChatMessageProps {
  message: Mensagem;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(message.timestamp);

  return (
    <div className={cn('flex w-full gap-3', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar>
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
      )}
      <div className={cn('max-w-[85%] rounded-2xl px-4 py-3 text-sm', isUser ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground border')}>
        <p className='whitespace-pre-wrap'>{message.content}</p>
        <div className='mt-2 flex items-center gap-2'>
          <span className='text-xs opacity-70'>{time}</span>
          {message.alertaCVV && <Badge variant='destructive'>Atenção CVV 188</Badge>}
        </div>
      </div>
      {isUser && (
        <Avatar>
          <AvatarFallback>Você</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
