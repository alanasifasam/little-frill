// título/gancho da home, parâmetros de envio reais e estado do modo de
// férias, via GET /api/site-info (público). Estado inicial com os valores de
// segurança de hoje, para não haver "flash" enquanto a resposta não chega.
import { useEffect, useState } from 'react';
import { getSiteInfo, type SiteInfoDTO } from '../api/siteInfo';

const SITE_INFO_OMISSAO: SiteInfoDTO = {
  titulo: 'Presentes que não existem em mais nenhuma casa.',
  gancho: 'Cada peça tem par: leve o conjunto e poupe no envio.',
  envioCustoPadrao: 4.5,
  envioLimiarGratis: 50,
  feriasLigadas: false,
  seccoesAtivas: ['acessorios', 'bebe', 'mesa', 'banho', 'cama', 'cozinha', 'animais'],
  heroEyebrow: 'Ateliê · Lisboa, Portugal',
  heroCorpo:
    'Bolsas, necessaires, capas de portátil e de Kindle, porta-moedas — e o enxoval todo para o bebé, a mesa, o banho, a cama, a cozinha e os pets da casa.',
  heroCta1Label: 'Ver todas as peças',
  heroCta2Label: 'Acessórios',
  heroImagemLegenda: 'Algodão xadrez rosa, o padrão da casa desde 2019.',
  heroImagemKey: undefined,
  confianca1Titulo: 'Uma pessoa, uma máquina',
  confianca1Texto:
    'Tudo é cortado, cosido e passado a ferro no ateliê. Se pedir dois iguais, saem dois iguais — nunca idênticos.',
  confianca2Titulo: 'Tecidos que aguentam',
  confianca2Texto:
    'Algodão e linho pré-lavados, forro de sarja e fita de viés feita do mesmo pano. Máquina a 30°, sem drama.',
  confianca3Titulo: 'Envio de Portugal',
  confianca3TextoModelo:
    'Expedimos em 2 a 4 dias úteis por CTT, ou pode vir buscar ao ateliê. Grátis acima de {valor}.',
};

export function useSiteInfo() {
  const [siteInfo, setSiteInfo] = useState<SiteInfoDTO>(SITE_INFO_OMISSAO);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    getSiteInfo()
      .then((resultado) => {
        if (!cancelado) setSiteInfo(resultado);
      })
      .catch(() => {
        // falha silenciosa: mantém os valores de segurança
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { siteInfo, carregando };
}
