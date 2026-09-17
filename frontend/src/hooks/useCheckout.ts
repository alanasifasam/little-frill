// estado de morada/envio/pagamento partilhado entre os 3 passos do checkout
import { useCallback, useEffect, useState } from 'react';
import type { Endereco, EncomendaConfirmada, MetodoEnvio, MetodoPagamento } from '../models/encomenda';

const CHAVE_SESSAO = 'lf_checkout';

export interface CheckoutState {
  morada: Partial<Endereco>;
  envio: MetodoEnvio;
  pagamento: MetodoPagamento;
  querFatura: boolean;
  nif: string;
  cartao: { numero: string; validade: string; cvv: string };
  /** Preenchido depois de `postEncomenda` responder com sucesso, para a página de confirmação. */
  ultimaEncomenda?: EncomendaConfirmada;
}

const ESTADO_INICIAL: CheckoutState = {
  morada: { pais: 'PT' },
  envio: 'ctt',
  pagamento: 'mbway',
  querFatura: false,
  nif: '',
  cartao: { numero: '', validade: '', cvv: '' },
};

function lerEstadoGuardado(): CheckoutState {
  try {
    const bruto = sessionStorage.getItem(CHAVE_SESSAO);
    if (!bruto) return ESTADO_INICIAL;
    return { ...ESTADO_INICIAL, ...(JSON.parse(bruto) as Partial<CheckoutState>) };
  } catch {
    return ESTADO_INICIAL;
  }
}

/** Estado de morada/envio/pagamento partilhado entre /checkout/morada,
 * /checkout/pagamento e /checkout/confirmacao, guardado em sessionStorage. */
export function useCheckout() {
  const [estado, setEstado] = useState<CheckoutState>(lerEstadoGuardado);

  useEffect(() => {
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(estado));
  }, [estado]);

  const atualizarMorada = useCallback((dados: Partial<Endereco>) => {
    setEstado((e) => ({ ...e, morada: { ...e.morada, ...dados } }));
  }, []);

  const definirEnvio = useCallback((envio: MetodoEnvio) => {
    setEstado((e) => ({ ...e, envio }));
  }, []);

  const definirPagamento = useCallback((pagamento: MetodoPagamento) => {
    setEstado((e) => ({ ...e, pagamento }));
  }, []);

  const atualizarCampo = useCallback(<K extends keyof CheckoutState>(chave: K, valor: CheckoutState[K]) => {
    setEstado((e) => ({ ...e, [chave]: valor }));
  }, []);

  const limpar = useCallback(() => {
    sessionStorage.removeItem(CHAVE_SESSAO);
    setEstado(ESTADO_INICIAL);
  }, []);

  return { estado, atualizarMorada, definirEnvio, definirPagamento, atualizarCampo, limpar };
}
