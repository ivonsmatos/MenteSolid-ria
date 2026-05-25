'use client';

import type { KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, loading }: ChatInputProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className='flex items-end gap-2'>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder='Escreva como você está se sentindo...'
        className='max-h-40 min-h-20'
        disabled={loading}
      />
      <Button type='button' size='icon' onClick={onSubmit} disabled={loading || !value.trim()}>
        <SendHorizontal className='h-4 w-4' />
      </Button>
    </div>
  );
}
