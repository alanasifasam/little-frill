// detalhe de um produto por id, via api/produtos
import { useEffect, useState } from 'react';
import { getProduto } from '../api/produtos';
import type { Produto } from '../models/produto';

export function useProduto(id: number) {
  const [produto, setProduto] = useState<Produto | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    getProduto(id)
      .then((resultado) => {
        if (cancelado) return;
        setProduto(resultado);
        setErro(resultado ? null : 'Não encontrámos esta peça.');
      })
      .catch(() => {
        if (!cancelado) setErro('Não foi possível carregar esta peça. Tente novamente.');
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [id]);

  return { produto, carregando, erro };
}
