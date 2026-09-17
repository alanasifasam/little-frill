// texto da home, limite de envio grátis, secções visíveis e o interruptor de
// modo de férias (partilhado com o Painel, via configuracao-negocio) do
// separador Site.
import { useCallback, useEffect, useState } from 'react';
import {
  atualizarConfiguracaoSite, getConfiguracaoSite, type ConfiguracaoSiteDTO, type ConfiguracaoSiteInput,
} from '../../api/admin/configuracaoSite';
import {
  alternarSeccao as alternarSeccaoApi, getSeccoes, type SeccaoConfigDTO,
} from '../../api/admin/seccoes';
import { getProdutosAdmin } from '../../api/admin/produtos';
import {
  atualizarConfiguracaoNegocio, getConfiguracaoNegocio, type ConfiguracaoNegocioDTO,
} from '../../api/admin/configuracaoNegocio';
import { SECOES } from '../../models/produto';
import { mensagemErro } from '../../lib/erroApi';

export interface SeccaoVisivel {
  chave: string;
  label: string;
  ativa: boolean;
  pecas: number;
}

const LABEL_SECCAO = new Map(SECOES.map((s) => [s.key as string, s.label]));

export function useAdminSite() {
  const [configuracaoSite, setConfiguracaoSite] = useState<ConfiguracaoSiteDTO | null>(null);
  const [seccoesConfig, setSeccoesConfig] = useState<SeccaoConfigDTO[]>([]);
  const [contagemPorSeccao, setContagemPorSeccao] = useState<Map<string, number>>(new Map());
  const [configuracaoNegocio, setConfiguracaoNegocio] = useState<ConfiguracaoNegocioDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    setCarregando(true);
    Promise.all([getConfiguracaoSite(), getSeccoes(), getConfiguracaoNegocio(), getProdutosAdmin()])
      .then(([site, seccoesDto, negocio, produtos]) => {
        setConfiguracaoSite(site);
        setSeccoesConfig(seccoesDto);
        setConfiguracaoNegocio(negocio);
        const contagem = new Map<string, number>();
        produtos.forEach((p) => {
          contagem.set(p.sec, (contagem.get(p.sec) ?? 0) + 1);
        });
        setContagemPorSeccao(contagem);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar a configuração do site.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function guardarConfiguracaoSite(input: ConfiguracaoSiteInput): Promise<boolean> {
    try {
      const guardada = await atualizarConfiguracaoSite(input);
      setConfiguracaoSite(guardada);
      setAviso('Texto da página inicial atualizado.');
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível guardar a configuração do site.'));
      return false;
    }
  }

  /** Atualiza a key da foto do Hero em memória depois do upload dedicado — sem depender do "Guardar" geral. */
  function atualizarHeroImagemLocal(novaKey: string) {
    setConfiguracaoSite((atual) => (atual ? { ...atual, heroImagemKey: novaKey } : atual));
    setAviso('Foto principal da home atualizada.');
  }

  async function alternarFerias() {
    if (!configuracaoNegocio) return;
    try {
      const proxima = await atualizarConfiguracaoNegocio({
        ...configuracaoNegocio,
        feriasLigadas: !configuracaoNegocio.feriasLigadas,
      });
      setConfiguracaoNegocio(proxima);
      setAviso(proxima.feriasLigadas ? 'Modo de férias ligado.' : 'Modo de férias desligado.');
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível alternar o modo de férias.'));
    }
  }

  async function alternarSeccaoVisivel(chave: string) {
    try {
      const atualizada = await alternarSeccaoApi(chave);
      setSeccoesConfig((atual) => atual.map((s) => (s.seccao === chave ? atualizada : s)));
      const label = LABEL_SECCAO.get(chave) ?? chave;
      setAviso(`${label} ${atualizada.ativa ? 'visível na loja.' : 'escondida da loja.'}`);
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível atualizar a secção.'));
    }
  }

  const seccoes: SeccaoVisivel[] = seccoesConfig.map((s) => ({
    chave: s.seccao,
    label: LABEL_SECCAO.get(s.seccao) ?? s.seccao,
    ativa: s.ativa,
    pecas: contagemPorSeccao.get(s.seccao) ?? 0,
  }));

  return {
    configuracaoSite,
    seccoes,
    feriasLigadas: configuracaoNegocio?.feriasLigadas ?? false,
    carregando,
    erro,
    aviso,
    guardarConfiguracaoSite,
    atualizarHeroImagemLocal,
    alternarFerias,
    alternarSeccaoVisivel,
  };
}
