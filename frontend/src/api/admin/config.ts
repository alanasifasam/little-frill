// GET/PUT /api/admin/config — ConfigSite (features, secções, envio grátis, copy da home, tarefas)
import { db } from './_db';
import type { ConfigSite, FlagsSite } from '../../models/admin/configSite';
import type { Sec } from '../../models/produto';

export async function getConfigSite(): Promise<ConfigSite> {
  return db.config;
}

export async function guardarConfigSite(config: ConfigSite): Promise<ConfigSite> {
  db.config = config;
  return db.config;
}

export async function alternarFeature(key: keyof FlagsSite): Promise<boolean> {
  db.config.flags[key] = !db.config.flags[key];
  return db.config.flags[key];
}

export async function alternarSecao(sec: Sec): Promise<boolean> {
  db.config.secoesOn[sec] = !db.config.secoesOn[sec];
  return db.config.secoesOn[sec];
}

export async function definirLimiteEnvio(valor: number): Promise<void> {
  db.config.limiteEnvio = valor;
}

export async function definirTitulo(valor: string): Promise<void> {
  db.config.titulo = valor;
}

export async function definirGancho(valor: string): Promise<void> {
  db.config.gancho = valor;
}

export async function alternarTarefa(key: string): Promise<boolean> {
  const tarefa = db.config.tarefas.find((t) => t.key === key);
  if (!tarefa) throw new Error('Tarefa não encontrada.');
  tarefa.feito = !tarefa.feito;
  return tarefa.feito;
}
