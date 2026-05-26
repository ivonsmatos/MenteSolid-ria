// Camada determinística de interceptação semântica.
// Antes de chamar a IA, varremos a mensagem por padrões inequívocos de risco.
// Se algum bater, devolvemos uma resposta imediata orientando ao CVV 188 sem
// gastar tokens — e marcamos o caso como prioritário para a triagem final.

const PADROES_RISCO: RegExp[] = [
  /\bsuic[ií]d/i,
  /\bme\s+matar\b/i,
  /\bmatar[\-\s]?me\b/i,
  /\btirar\s+(?:a\s+)?minha\s+vida\b/i,
  /\bacabar\s+(?:com\s+)?(?:tudo|comigo|com\s+a\s+minha\s+vida)\b/i,
  /\bn[ãa]o\s+aguent[oa]\s+(?:mais|viver|continuar)\b/i,
  /\bautom?utila[cç][ãa]o\b/i,
  /\bme\s+cortar\b/i,
  /\bquero\s+(?:morrer|desaparecer|sumir)\b/i,
  /\bn[ãa]o\s+quero\s+(?:mais\s+)?viver\b/i,
  /\bsem\s+sa[ií]da\b/i,
  /\bn[ãa]o\s+vejo\s+sa[ií]da\b/i,
  /\bplano\s+(?:de\s+)?suic[ií]dio\b/i
];

export interface DeteccaoRisco {
  risco: boolean;
  padraoMatched?: string;
}

export function detectarRisco(texto: string): DeteccaoRisco {
  for (const padrao of PADROES_RISCO) {
    if (padrao.test(texto)) {
      return { risco: true, padraoMatched: padrao.source };
    }
  }
  return { risco: false };
}

export const MENSAGEM_EMERGENCIA_CVV = `Sinto muito que você esteja passando por isso. Por favor, ligue agora para o CVV no 188. É gratuito e funciona 24 horas. Você consegue fazer essa ligação agora? Se preferir, também posso te ajudar a chamar alguém de confiança. Estou aqui.`;
