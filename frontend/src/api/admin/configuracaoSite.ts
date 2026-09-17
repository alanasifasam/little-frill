// GET/PUT /api/admin/configuracao-site — título, gancho e limite de envio
// grátis editáveis no separador Site. Foto do Hero tem endpoint próprio
// (POST .../hero-foto, multipart) — não viaja no PUT genérico.
import { client } from '../client';

export interface ConfiguracaoSiteDTO {
  titulo: string;
  gancho: string;
  envioLimiarGratis: number;
  heroEyebrow: string;
  heroCorpo: string;
  heroCta1Label: string;
  heroCta2Label: string;
  heroImagemLegenda: string;
  /** Key relativa do blob da foto do Hero — só de leitura, definida via `atualizarHeroFoto`. */
  heroImagemKey?: string;
  confianca1Titulo: string;
  confianca1Texto: string;
  confianca2Titulo: string;
  confianca2Texto: string;
  confianca3Titulo: string;
  confianca3TextoModelo: string;
}

/** Corpo do PUT — não inclui `heroImagemKey`, que só o endpoint dedicado de upload altera. */
export type ConfiguracaoSiteInput = Omit<ConfiguracaoSiteDTO, 'heroImagemKey'>;

export async function getConfiguracaoSite(): Promise<ConfiguracaoSiteDTO> {
  const { data } = await client.get<ConfiguracaoSiteDTO>('/admin/configuracao-site');
  return data;
}

export async function atualizarConfiguracaoSite(input: ConfiguracaoSiteInput): Promise<ConfiguracaoSiteDTO> {
  const { data } = await client.put<ConfiguracaoSiteDTO>('/admin/configuracao-site', input);
  return data;
}

/** Envia uma fotografia nova (multipart) para o Hero da home. Devolve a configuração atualizada. */
export async function atualizarHeroFoto(ficheiro: File): Promise<ConfiguracaoSiteDTO> {
  const formData = new FormData();
  formData.append('ficheiro', ficheiro);
  const { data } = await client.post<ConfiguracaoSiteDTO>('/admin/configuracao-site/hero-foto', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Roda a foto do Hero 90° (direita ou esquerda). Devolve a configuração atualizada — a key muda a cada rotação. */
export async function rodarHeroFoto(sentidoHorario: boolean): Promise<ConfiguracaoSiteDTO> {
  const { data } = await client.patch<ConfiguracaoSiteDTO>('/admin/configuracao-site/hero-foto/rodar', { sentidoHorario });
  return data;
}
