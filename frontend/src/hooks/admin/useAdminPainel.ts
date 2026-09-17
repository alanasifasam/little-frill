// leitura do mês em curso — sem ações, só as métricas e as listas do Painel
import { useCallback, useEffect, useState } from 'react';
import { getPainel, type PainelDTO } from '../../api/admin/painel';

export function useAdminPainel() {
  const [painel, setPainel] = useState<PainelDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    getPainel()
      .then((dto) => {
        setPainel(dto);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar o painel.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { painel, carregando, erro, recarregar: carregar };
}
