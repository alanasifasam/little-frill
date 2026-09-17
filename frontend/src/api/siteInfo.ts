// GET /api/site-info — endpoint público (sem autenticação) com o título e o
// gancho da home, os parâmetros de envio reais e o estado do modo de férias.
import { client } from './client';

export interface SiteInfoDTO {
  titulo: string;
  gancho: string;
  envioCustoPadrao: number;
  envioLimiarGratis: number;
  feriasLigadas: boolean;
  seccoesAtivas: string[];
  heroEyebrow: string;
  heroCorpo: string;
  heroCta1Label: string;
  heroCta2Label: string;
  heroImagemLegenda: string;
  heroImagemKey?: string;
  confianca1Titulo: string;
  confianca1Texto: string;
  confianca2Titulo: string;
  confianca2Texto: string;
  confianca3Titulo: string;
  confianca3TextoModelo: string;
}

export async function getSiteInfo(): Promise<SiteInfoDTO> {
  const { data } = await client.get<SiteInfoDTO>('/site-info');
  return data;
}
