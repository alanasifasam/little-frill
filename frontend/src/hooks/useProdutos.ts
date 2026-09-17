// lista de produtos + filtros (sec, padrao, cor, precoMax, soStock, ordenar), via api/produtos
import { useCallback, useEffect, useState } from 'react';
import { getProdutos } from '../api/produtos';
import { CORES, type Padrao, type Produto, type Sec } from '../models/produto';

export type Ordenar = 'destaque' | 'baratos' | 'caros' | 'nome';

export interface FiltrosCatalogo {
  padrao: Padrao | 'tudo';
  cor: keyof typeof CORES | 'tudo';
  precoMax: number;
  soStock: boolean;
  ordenar: Ordenar;
}

const FILTROS_INICIAIS: FiltrosCatalogo = {
  padrao: 'tudo',
  cor: 'tudo',
  precoMax: 90,
  soStock: false,
  ordenar: 'destaque',
};

/** Filtros e lista de produtos de uma página de catálogo. A secção vem da rota
 * (`:sec`), o resto é estado local da página, guardado aqui. */
export function useProdutos(sec?: Sec) {
  const [filtros, setFiltros] = useState<FiltrosCatalogo>(FILTROS_INICIAIS);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    getProdutos({
      sec,
      padrao: filtros.padrao === 'tudo' ? undefined : filtros.padrao,
      cor: filtros.cor === 'tudo' ? undefined : filtros.cor,
      precoMax: filtros.precoMax,
      soStock: filtros.soStock,
      ordenar: filtros.ordenar,
    })
      .then((resultado) => {
        if (!cancelado) {
          setProdutos(resultado);
          setErro(null);
        }
      })
      .catch(() => {
        if (!cancelado) setErro('Não foi possível carregar o catálogo. Tente novamente.');
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [sec, filtros]);

  const atualizarFiltro = useCallback(<K extends keyof FiltrosCatalogo>(chave: K, valor: FiltrosCatalogo[K]) => {
    setFiltros((f) => ({ ...f, [chave]: valor }));
  }, []);

  const limparFiltros = useCallback(() => setFiltros(FILTROS_INICIAIS), []);

  return { produtos, filtros, atualizarFiltro, limparFiltros, carregando, erro };
}
