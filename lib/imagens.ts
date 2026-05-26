// Catálogo central de imagens do Unsplash usadas no marketing.
// URLs apontam para o CDN do Unsplash (licença permissiva, atribuição apreciada).
// Para trocar, copie a URL "Download" no Unsplash sem o `?ixlib=...` final.

export interface ImagemUnsplash {
  url: string;
  alt: string;
  fotografo: string;
  fotografoUrl: string;
}

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;

export const IMG = {
  heroAcolhimento: {
    url: u('photo-1499209974431-9dddcece7f88'),
    alt: 'Mulher sorrindo em luz natural, símbolo de leveza e acolhimento.',
    fotografo: 'Allef Vinicius',
    fotografoUrl: 'https://unsplash.com/@seteph'
  },
  conversaCalma: {
    url: u('photo-1573497019940-1c28c88b4f3e'),
    alt: 'Duas pessoas conversando em ambiente tranquilo.',
    fotografo: 'Christina @ wocintechchat.com',
    fotografoUrl: 'https://unsplash.com/@wocintechchat'
  },
  maosUnidas: {
    url: u('photo-1488521787991-ed7bbaae773c'),
    alt: 'Mãos de pessoas se apoiando, gesto de solidariedade.',
    fotografo: 'Toa Heftiba',
    fotografoUrl: 'https://unsplash.com/@heftiba'
  },
  profissionalEscuta: {
    url: u('photo-1551836022-deb4988cc6c0'),
    alt: 'Profissional de saúde mental escutando com atenção.',
    fotografo: 'Priscilla Du Preez',
    fotografoUrl: 'https://unsplash.com/@priscilladupreez'
  },
  diversidade: {
    url: u('photo-1529156069898-49953e39b3ac'),
    alt: 'Grupo de pessoas diversas conversando ao ar livre.',
    fotografo: 'Tim Mossholder',
    fotografoUrl: 'https://unsplash.com/@timmossholder'
  },
  jovemPensativa: {
    url: u('photo-1517841905240-472988babdf9'),
    alt: 'Jovem em momento de reflexão tranquila.',
    fotografo: 'Brooke Cagle',
    fotografoUrl: 'https://unsplash.com/@brookecagle'
  },
  encontroComunidade: {
    url: u('photo-1521791136064-7986c2920216'),
    alt: 'Pessoas em encontro comunitário em São Paulo.',
    fotografo: 'Antenna',
    fotografoUrl: 'https://unsplash.com/@antenna'
  },
  cuidadoFamilia: {
    url: u('photo-1542385151-efd9000785a0'),
    alt: 'Família abraçada em momento de carinho.',
    fotografo: 'Liane Metzler',
    fotografoUrl: 'https://unsplash.com/@silentsoul'
  },
  paisagemBrasileira: {
    url: u('photo-1483729558449-99ef09a8c325'),
    alt: 'Paisagem natural brasileira ao amanhecer.',
    fotografo: 'David Mark',
    fotografoUrl: 'https://unsplash.com/@davidmark'
  }
} satisfies Record<string, ImagemUnsplash>;

export type ChaveImagem = keyof typeof IMG;
