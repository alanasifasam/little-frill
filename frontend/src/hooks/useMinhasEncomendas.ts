// lista de encomendas do utilizador autenticado, via api/encomendas
import { useEffect, useState } from 'react';
import { getMinhasEncomendas } from '../api/encomendas';
import type { EncomendaResumo } from '../models/encomenda';

export function useMinhasEncomendas() {
  const [encomendas, setEncomendas] = useState<EncomendaResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    getMinhasEncomendas()
      .then((resultado) => {
        if (cancelado) return;
        const ordenado = [...resultado].sort(
          (a, b) => new Date(b.criada).getTime() - new Date(a.criada).getTime()
        );
        setEncomendas(ordenado);
        setErro(null);
      })
      .catch(() => {
        if (!cancelado) setErro('Não foi possível carregar as suas encomendas. Tente novamente.');
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { encomendas, carregando, erro };
}
