// detalhe de uma encomenda por referência, via api/encomendas
import { useEffect, useState } from 'react';
import { getEncomenda } from '../api/encomendas';
import type { EncomendaDetalhe } from '../models/encomenda';

export function useEncomenda(referencia: string | undefined) {
  const [encomenda, setEncomenda] = useState<EncomendaDetalhe | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!referencia) {
      setEncomenda(undefined);
      setCarregando(false);
      return;
    }
    let cancelado = false;
    setCarregando(true);
    getEncomenda(referencia)
      .then((resultado) => {
        if (cancelado) return;
        setEncomenda(resultado);
        setErro(null);
      })
      .catch(() => {
        if (!cancelado) setErro('Não foi possível carregar esta encomenda. Tente novamente.');
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [referencia]);

  return { encomenda, carregando, erro };
}
