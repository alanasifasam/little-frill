// Caminho de uma foto de produto/hero: a API guarda só a key relativa do
// blob (nunca o URL completo) e é ela própria que serve os bytes, porque o
// contentor no Blob Storage é privado. Sem key (produto ainda sem fotografia
// carregada), devolve um placeholder local.
const PLACEHOLDER = '/img/sem-foto.svg';

export function urlFoto(key?: string): string {
  if (!key) return PLACEHOLDER;
  return `${import.meta.env.VITE_API_URL ?? '/api'}/fotos/${key}`;
}

// Regras de validação client-side partilhadas pelos dois uploaders de foto
// (produto e hero) — espelham ValidacaoFotoUpload no backend, que é quem
// decide de facto. Manter os dois em sincronia evita o tipo de divergência
// que já existiu aqui (frontend a dizer um limite, backend outro).
export const TIPOS_PERMITIDOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];
export const TAMANHO_MAXIMO_FOTO_BYTES = 10 * 1024 * 1024;

export function validarFicheiroFoto(ficheiro: File): string | null {
  if (!TIPOS_PERMITIDOS_FOTO.includes(ficheiro.type)) {
    return 'Formato não suportado — escolha uma imagem JPEG, PNG ou WebP.';
  }
  if (ficheiro.size > TAMANHO_MAXIMO_FOTO_BYTES) {
    return 'Ficheiro demasiado grande — o máximo são 10MB.';
  }
  return null;
}
