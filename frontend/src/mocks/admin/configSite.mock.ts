// features do site, secções com contagem de peças, tarefas de manutenção e
// configuração inicial da loja (protótipo: FEATURES, SECOES, TAREFAS, state inicial)
import { SECOES, type Sec } from '../../models/produto';
import type { ConfigSite, TarefaManutencao } from '../../models/admin/configSite';

export const FEATURES: { key: keyof ConfigSite['flags']; label: string; nota: string }[] = [
  { key: 'bannerEnvio', label: 'Barra de envio grátis', nota: 'Faixa no topo da loja com o valor que falta para o envio ser nosso.' },
  { key: 'mostrarStock', label: 'Mostrar stock nas peças', nota: '"3 prontas na prateleira" ou "só 2 — última fornada".' },
  { key: 'combinaCom', label: 'Sugestões "Combina com"', nota: 'Pares por baixo do catálogo e na página da peça.' },
  { key: 'recolhaAtelie', label: 'Recolha no ateliê', nota: 'Opção grátis no checkout, terça a sábado.' },
  { key: 'cartaMensal', label: 'Carta mensal', nota: 'Caixa de subscrição no registo e no rodapé.' },
  { key: 'ferias', label: 'Modo de férias', nota: 'Aceita encomendas mas avisa que só saem no regresso.' },
];

/** Contagem de peças por secção, na mesma ordem de `SECOES` (models/produto.ts);
 * a chave da secção Pets é `animais`, o rótulo mostrado é sempre "Pets". */
export const PECAS_POR_SECAO: Record<Sec, number> = {
  acessorios: 8,
  bebe: 2,
  mesa: 2,
  banho: 2,
  cama: 2,
  cozinha: 2,
  animais: 2,
};

export const TAREFAS: (TarefaManutencao & { label: string; nota: string })[] = [
  { key: 'fotos', label: 'Trocar padrões por fotografias reais', nota: 'Faltam Cama e Pets', feito: false },
  { key: 'qr', label: 'Ligar os QR dos cartões ao site', nota: 'Os cartões impressos usam código de exemplo', feito: false },
  { key: 'backup', label: 'Cópia de segurança da base de dados', nota: 'Semanal, domingo à noite', feito: true },
  { key: 'ctt', label: 'Confirmar tabela de preços dos CTT', nota: 'Revista em julho', feito: true },
  { key: 'rgpd', label: 'Rever texto de privacidade e cookies', nota: 'Pendente desde a abertura', feito: false },
];

export const CONFIG_SITE_INICIAL: ConfigSite = {
  flags: {
    bannerEnvio: true,
    mostrarStock: true,
    combinaCom: true,
    recolhaAtelie: true,
    cartaMensal: true,
    ferias: false,
  },
  secoesOn: Object.fromEntries(SECOES.map((s) => [s.key, true])) as Record<Sec, boolean>,
  metodosOn: { mbway: true, multibanco: true, cartao: true, transferencia: false },
  limiteEnvio: 50,
  titulo: 'Presentes que não existem em mais nenhuma casa.',
  gancho: 'Cada peça tem par: leve o conjunto e poupe no envio.',
  tarefas: TAREFAS.map((t) => ({ key: t.key, feito: t.feito })),
};
