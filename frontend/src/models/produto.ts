// Produto, Sec, Padrao, CORES (as const) — igual ao handoff §3

export const CORES = {
  rosa: { label: 'Rosa', lt: '#fbdce6', md: '#f2b8cd' },
  azul: { label: 'Azul', lt: '#dbeaf6', md: '#aecfe6' },
  lilas: { label: 'Lilás', lt: '#e8e1f7', md: '#c9bbe8' },
  amarelo: { label: 'Amarelo', lt: '#fbeec8', md: '#f4dc94' },
  verde: { label: 'Verde', lt: '#e2efd8', md: '#bcdba9' },
} as const;

export type Padrao = 'xadrez' | 'floral' | 'listras' | 'liso';

export const PADROES: Record<Padrao, string> = {
  xadrez: 'Xadrez',
  floral: 'Floral',
  listras: 'Listras',
  liso: 'Liso',
};

export type Sec = 'acessorios' | 'bebe' | 'mesa' | 'banho' | 'cama' | 'cozinha' | 'animais';

export const SECOES: { key: Sec; label: string }[] = [
  { key: 'acessorios', label: 'Acessórios' },
  { key: 'bebe', label: 'Bebé' },
  { key: 'mesa', label: 'Mesa' },
  { key: 'banho', label: 'Banho' },
  { key: 'cama', label: 'Cama' },
  { key: 'cozinha', label: 'Cozinha' },
  { key: 'animais', label: 'Pets' },
];

export interface Produto {
  id: number;
  nome: string;
  tipo: string;
  sec: Sec;
  preco: number;
  padrao: Padrao;
  cor: keyof typeof CORES;
  stock: number;
  medidas: string;
  tecido: string;
  combina: number[];
  nova?: boolean;
  destaque?: boolean;
  /** Key relativa do blob da foto principal (Azure Blob Storage) — sem foto, a loja usa o padrão do tecido. */
  fotoKey?: string;
  /** Ponto focal da foto principal (percentagem 0-100, omissão 50/50 = centro), aplicado via object-position onde a foto aparece com object-fit: cover. */
  fotoFocoX?: number;
  fotoFocoY?: number;
  /** Galeria completa de fotos, por ordem — usada no detalhe do produto. */
  fotos?: { id: number; key: string; ordem: number; principal: boolean; focoX: number; focoY: number }[];
}
