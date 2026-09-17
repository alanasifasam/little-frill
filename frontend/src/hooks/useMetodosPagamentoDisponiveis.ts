// métodos de pagamento ativos + dados de pagamento do ateliê (IBAN/MB WAY), via api/metodosPagamento
import { useEffect, useState } from 'react';
import { getMetodosPagamentoDisponiveis, type MetodoPagamentoDisponivel } from '../api/metodosPagamento';

/** Métodos de pagamento ativos no checkout (desligados no admin não aparecem cá). */
export function useMetodosPagamentoDisponiveis() {
  const [metodosDisponiveis, setMetodosDisponiveis] = useState<MetodoPagamentoDisponivel[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    getMetodosPagamentoDisponiveis()
      .then((resultado) => {
        if (!cancelado) setMetodosDisponiveis(resultado);
      })
      .catch(() => {
        // falha silenciosa: mantém a lista vazia, PagamentoOpcoes mostra tudo
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { metodosDisponiveis, carregando };
}
