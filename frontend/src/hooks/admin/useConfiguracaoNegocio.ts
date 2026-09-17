// parâmetros do mês (meta, custo real de envio CTT, custos fixos, modo férias) —
// formulário lateral usado no Painel
import { useCallback, useEffect, useState } from 'react';
import {
  atualizarConfiguracaoNegocio, getConfiguracaoNegocio, type ConfiguracaoNegocioDTO,
} from '../../api/admin/configuracaoNegocio';
import { mensagemErro } from '../../lib/erroApi';

export function useConfiguracaoNegocio() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoNegocioDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    setCarregando(true);
    getConfiguracaoNegocio()
      .then((dto) => {
        setConfiguracao(dto);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar a configuração do negócio.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function guardar(input: ConfiguracaoNegocioDTO): Promise<boolean> {
    try {
      const guardada = await atualizarConfiguracaoNegocio(input);
      setConfiguracao(guardada);
      setAviso('Parâmetros do mês atualizados.');
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível guardar os parâmetros do mês.'));
      return false;
    }
  }

  return { configuracao, carregando, erro, aviso, guardar };
}
