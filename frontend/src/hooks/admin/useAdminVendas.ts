// encomendas do mês, peças vendidas, talão médio, caixa dia a dia, ranking
import { useEffect, useState } from 'react';
import { getVendas, type VendasDTO } from '../../api/admin/vendas';

export function useAdminVendas() {
  const [vendas, setVendas] = useState<VendasDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    getVendas()
      .then((dto) => {
        if (!cancelado) {
          setVendas(dto);
          setErro(null);
        }
      })
      .catch(() => {
        if (!cancelado) setErro('Não foi possível carregar as vendas.');
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { vendas, carregando, erro };
}
