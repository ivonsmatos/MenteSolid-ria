export interface Mensagem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  alertaCVV?: boolean;
}

export interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  vulnerabilidadeSocioeconomica: boolean;
  consentimentoLgpd: boolean;
  createdAt: Date;
}
