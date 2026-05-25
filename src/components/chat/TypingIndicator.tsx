export function TypingIndicator() {
  return (
    <div className='inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2'>
      <span className='h-2 w-2 animate-pulse-soft rounded-full bg-primary [animation-delay:0ms]' />
      <span className='h-2 w-2 animate-pulse-soft rounded-full bg-primary [animation-delay:200ms]' />
      <span className='h-2 w-2 animate-pulse-soft rounded-full bg-primary [animation-delay:400ms]' />
    </div>
  );
}
