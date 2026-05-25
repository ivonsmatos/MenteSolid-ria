import Link from 'next/link';

export function Header() {
  return (
    <header className='border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4'>
        <Link href='/' className='text-lg font-semibold'>
          🧠 MenteSolidária
        </Link>
        <nav className='flex items-center gap-4 text-sm'>
          <Link href='#recursos' className='text-muted-foreground hover:text-foreground'>
            Recursos
          </Link>
          <a href='https://www.cvv.org.br/' target='_blank' rel='noreferrer' className='font-semibold text-destructive'>
            CVV 188
          </a>
        </nav>
      </div>
    </header>
  );
}
