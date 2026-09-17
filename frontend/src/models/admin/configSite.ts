// ConfigSite — configuração editável no separador Site (AdminEspec §2)
import type { Sec } from '../produto';
import type { MetodoPagamento } from '../encomenda';

export interface FlagsSite {
  bannerEnvio: boolean;
  mostrarStock: boolean;
  combinaCom: boolean;
  recolhaAtelie: boolean;
  cartaMensal: boolean;
  ferias: boolean;
}

export interface TarefaManutencao {
  key: string;
  feito: boolean;
}

export interface ConfigSite {
  flags: FlagsSite;
  secoesOn: Record<Sec, boolean>;
  metodosOn: Record<MetodoPagamento, boolean>;
  /** Envio grátis a partir de (€). */
  limiteEnvio: number;
  /** H1 da home. */
  titulo: string;
  /** Linha em itálico da home. */
  gancho: string;
  tarefas: TarefaManutencao[];
}
