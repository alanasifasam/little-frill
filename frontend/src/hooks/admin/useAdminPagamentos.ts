// métodos no checkout (interruptor + repartição + edição de taxas/IBAN) e transações
import { useCallback, useEffect, useState } from 'react';
import {
  alternarMetodo,
  definirPagoTransacao,
  getPagamentos,
  guardarMetodo as guardarMetodoApi,
  type AtualizarMetodoPagamentoInput,
  type PagamentosDTO,
} from '../../api/admin/pagamentos';
import type { MetodoPagamento } from '../../models/admin/encomenda';
import { mensagemErro } from '../../lib/erroApi';

export function useAdminPagamentos() {
  const [pagamentos, setPagamentos] = useState<PagamentosDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    setCarregando(true);
    getPagamentos()
      .then((dto) => {
        setPagamentos(dto);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar os pagamentos.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function alternar(metodo: MetodoPagamento, label: string) {
    const ativo = await alternarMetodo(metodo);
    setAviso(`${label} ${ativo ? 'ligado no checkout.' : 'desligado do checkout.'}`);
    carregar();
  }

  async function alternarPago(ref: string) {
    await definirPagoTransacao(ref);
    carregar();
  }

  async function guardarMetodo(metodo: string, input: AtualizarMetodoPagamentoInput) {
    try {
      await guardarMetodoApi(metodo, input);
      setAviso('Método atualizado.');
      carregar();
      return true;
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível atualizar o método.'));
      return false;
    }
  }

  return { pagamentos, carregando, erro, aviso, alternar, alternarPago, guardarMetodo };
}
