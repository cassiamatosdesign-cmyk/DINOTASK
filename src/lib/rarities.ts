import type { Rarity, RarityId } from '../types';

// Quando houver múltiplos dinos por raridade, adicione os caminhos aqui.
// Ex: dinoImages: ['/dinos/comum-1.png', '/dinos/comum-2.png', ...]
// Se vazio, usa dinoImage como fallback.
const DINO_VARIANTS: Record<RarityId, string[]> = {
  comum:    [],
  raro:     [],
  epico:    [],
  lendario: [],
};

export function pickDinoImage(rarityId: RarityId): string {
  const variants = DINO_VARIANTS[rarityId];
  if (variants.length === 0) {
    return `/dinos/${rarityId}.png`;
  }
  return variants[Math.floor(Math.random() * variants.length)];
}

export const RARITIES: Rarity[] = [
  { id:'comum',    label:'Comum',    dinoName:'Leafy', threshold:10, weekNumber:1, whisper:'Pequenos passos, grandes mudanças.',     meaning:'O começo de tudo.',              dinoImage:'/dinos/comum.png',    cardImage:'/collection/cards/leafy.png',  coverImage:'/collection/covers/comum.png',    color:'var(--r-comum)',    glowColor:'rgba(93,232,160,0.25)',  bg:'rgba(93,232,160,0.05)'  },
  { id:'raro',     label:'Raro',     dinoName:'Auri',  threshold:10, weekNumber:2, whisper:'Você está criando um novo ritmo.',       meaning:'Serenidade e profundidade.',     dinoImage:'/dinos/raro.png',     cardImage:'/collection/cards/auri.png',   coverImage:'/collection/covers/raro.png',     color:'var(--r-raro)',     glowColor:'rgba(96,165,250,0.28)',  bg:'rgba(96,165,250,0.05)'  },
  { id:'epico',    label:'Épico',    dinoName:'Lumy',  threshold:10, weekNumber:3, whisper:'Grandes mudanças nascem de dentro.',     meaning:'A transformação acontece quando você insiste em continuar.', dinoImage:'/dinos/epico.png',    cardImage:'/collection/cards/lumy.png',   coverImage:'/collection/covers/epico.png',    color:'var(--r-epico)',    glowColor:'rgba(192,132,252,0.28)', bg:'rgba(192,132,252,0.06)' },
  { id:'lendario', label:'Lendário', dinoName:'Vael',  threshold:10, weekNumber:4, whisper:'A constância cria lendas.',              meaning:'Raridade absoluta. Presença que inspira.', dinoImage:'/dinos/lendario.png', cardImage:'/collection/cards/vael.png',   coverImage:'/collection/covers/lendario.png', color:'var(--r-lendario)', glowColor:'rgba(251,191,36,0.32)',  bg:'rgba(251,191,36,0.05)'  },
];

// Sempre começa do Comum — baseado na semana do usuário, não do calendário
export function getRarityForUserWeek(userWeekNumber: number): Rarity {
  const idx = (userWeekNumber - 1) % 4;
  return RARITIES[idx];
}

export function getRarityById(id: RarityId): Rarity {
  return RARITIES.find(r => r.id === id) ?? RARITIES[0];
}

export function getEggImage(done: number): string {
  if (done >= 8) return '/eggs/estagio3.png';
  if (done >= 4) return '/eggs/estagio2.png';
  return '/eggs/estagio1.png';
}

export function getEggStageLabel(done: number): string {
  if (done >= 10) return 'Pronto para nascer!';
  if (done >= 8)  return 'Quase lá...';
  return 'Ovo em evolução';
}
