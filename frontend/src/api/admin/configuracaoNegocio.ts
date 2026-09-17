// GET/PUT /api/admin/configuracao-negocio — parâmetros do mês usados no Painel
// (meta, custo real de envio CTT, modo férias). Os custos fixos deixaram de
// ser editáveis aqui — passaram a ser derivados da soma das linhas ativas de
// custo fixo, geridas em "Custos e lucro" (cf. api/admin/custosFixos.ts).
import { client } from '../client';

export interface ConfiguracaoNegocioDTO {
  metaMes: number;
  envioRealCtt: number;
  feriasLigadas: boolean;
}

export async function getConfiguracaoNegocio(): Promise<ConfiguracaoNegocioDTO> {
  const { data } = await client.get<ConfiguracaoNegocioDTO>('/admin/configuracao-negocio');
  return data;
}

export async function atualizarConfiguracaoNegocio(input: ConfiguracaoNegocioDTO): Promise<ConfiguracaoNegocioDTO> {
  const { data } = await client.put<ConfiguracaoNegocioDTO>('/admin/configuracao-negocio', input);
  return data;
}
