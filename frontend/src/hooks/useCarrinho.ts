// consome CarrinhoContext, expõe add/remover/setQty/limpar + totais derivados (subtotal, envio, total)
import { useContext, useEffect, useMemo, useState } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { getProduto } from '../api/produtos';
import { calcularCustoEnvio, notaEnvioGratis } from '../models/encomenda';
import { useSiteInfo } from './useSiteInfo';
import type { Produto } from '../models/produto';

export interface ItemCarrinho {
  produto: Produto;
  qty: number;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) {
    throw new Error('useCarrinho tem de ser usado dentro de <CarrinhoProvider>.');
  }
  const { linhas, dispatch, notificacao, notificar } = ctx;
  const { siteInfo } = useSiteInfo();

  // cache local de produtos já resolvidos via API; `null` marca um id já
  // pedido mas sem produto encontrado (apagado, ou falha de rede).
  const [cache, setCache] = useState<Map<number, Produto | null>>(new Map());

  useEffect(() => {
    const idsEmFalta = linhas.map((l) => l.id).filter((id) => !cache.has(id));
    if (idsEmFalta.length === 0) return;

    let cancelado = false;
    Promise.allSettled(idsEmFalta.map((id) => getProduto(id))).then((resultados) => {
      if (cancelado) return;
      setCache((atual) => {
        const proximo = new Map(atual);
        resultados.forEach((resultado, i) => {
          const id = idsEmFalta[i];
          proximo.set(id, resultado.status === 'fulfilled' ? resultado.value ?? null : null);
        });
        return proximo;
      });
    });

    return () => {
      cancelado = true;
    };
  }, [linhas, cache]);

  // "a carregar" enquanto houver linhas cujo produto ainda não foi resolvido
  // (nem encontrado, nem confirmado como inexistente) — calculado no render,
  // sem estado paralelo.
  const carregando = useMemo(() => linhas.some((l) => !cache.has(l.id)), [linhas, cache]);

  const itensDetalhados = useMemo<ItemCarrinho[]>(
    () =>
      linhas.reduce<ItemCarrinho[]>((acc, linha) => {
        const produto = cache.get(linha.id);
        if (produto) acc.push({ produto, qty: linha.qty });
        return acc;
      }, []),
    [linhas, cache]
  );

  const subtotal = useMemo(
    () => itensDetalhados.reduce((total, item) => total + item.produto.preco * item.qty, 0),
    [itensDetalhados]
  );

  const totalItens = useMemo(() => linhas.reduce((total, l) => total + l.qty, 0), [linhas]);

  // Nesta página o método de envio ainda não foi escolhido (isso acontece em
  // /checkout/morada); a estimativa assume CTT, tal como o protótipo.
  const envio = calcularCustoEnvio(subtotal, 'ctt', siteInfo.envioCustoPadrao, siteInfo.envioLimiarGratis);
  const total = subtotal + envio;
  const envioNota = notaEnvioGratis(subtotal, siteInfo.envioLimiarGratis);

  function guardarNoCache(produto: Produto) {
    setCache((atual) => {
      if (atual.get(produto.id) === produto) return atual;
      const proximo = new Map(atual);
      proximo.set(produto.id, produto);
      return proximo;
    });
  }

  function add(produto: Produto, qty = 1) {
    dispatch({ type: 'ADD', id: produto.id, qty });
    guardarNoCache(produto);
    notificar(`Adicionado ao carrinho: ${produto.nome}`);
  }

  function addPar(produtoA: Produto, produtoB: Produto) {
    dispatch({ type: 'ADD', id: produtoA.id, qty: 1 });
    dispatch({ type: 'ADD', id: produtoB.id, qty: 1 });
    guardarNoCache(produtoA);
    guardarNoCache(produtoB);
    notificar(`Adicionado ao carrinho: ${produtoA.nome} + ${produtoB.nome}`);
  }

  function remover(id: number) {
    dispatch({ type: 'REMOVER', id });
  }

  function setQty(id: number, qty: number) {
    dispatch({ type: 'SET_QTY', id, qty });
  }

  function limpar() {
    dispatch({ type: 'LIMPAR' });
  }

  return {
    linhas,
    itensDetalhados,
    carregando,
    totalItens,
    subtotal,
    envio,
    total,
    envioNota,
    notificacao,
    add,
    addPar,
    remover,
    setQty,
    limpar,
  };
}
