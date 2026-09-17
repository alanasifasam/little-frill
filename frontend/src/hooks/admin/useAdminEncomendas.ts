// linha por encomenda: estado, rastreio, pagamento, anular/reabrir, apagar
import { useCallback, useEffect, useState } from 'react';
import {
  alternarPago,
  anular as anularEncomenda,
  apagarEncomenda,
  definirEstado,
  definirRastreio,
  getEncomendasAdmin,
  reabrir as reabrirEncomenda,
  type EncomendaLinha,
} from '../../api/admin/encomendas';
import { ESTADOS_ENCOMENDA, type EstadoEncomenda } from '../../models/encomenda';
import { mensagemErro } from '../../lib/erroApi';

export function useAdminEncomendas() {
  const [encomendas, setEncomendas] = useState<EncomendaLinha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');

  const carregar = useCallback(() => {
    setCarregando(true);
    getEncomendasAdmin()
      .then((lista) => {
        setEncomendas(lista);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar as encomendas.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function mudarEstado(ref: string, estado: EstadoEncomenda) {
    try {
      const atualizado = await definirEstado(ref, estado);
      setAviso(`${ref} passou a ${ESTADOS_ENCOMENDA[atualizado.estado]}.`);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível mudar o estado.'));
    }
  }

  async function mudarRastreio(ref: string, rastreio: string) {
    try {
      await definirRastreio(ref, rastreio);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível gravar o código de rastreio.'));
    }
  }

  async function alternarPagamento(ref: string) {
    try {
      const atualizado = await alternarPago(ref);
      setAviso(`${ref} marcada como ${atualizado.pago ? 'paga' : 'por pagar'}.`);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível atualizar o pagamento.'));
    }
  }

  async function anular(ref: string) {
    try {
      await anularEncomenda(ref);
      setAviso(`${ref} anulada — saiu da caixa e o stock voltou.`);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível anular a encomenda.'));
    }
  }

  async function reabrir(ref: string) {
    try {
      await reabrirEncomenda(ref);
      setAviso(`${ref} reaberta — voltou a contar na caixa e no stock.`);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível reabrir a encomenda.'));
    }
  }

  async function apagar(ref: string) {
    try {
      await apagarEncomenda(ref);
      setAviso(`${ref} apagada do registo.`);
      carregar();
    } catch (e) {
      setAviso(mensagemErro(e, 'Não foi possível apagar a encomenda.'));
    }
  }

  return { encomendas, carregando, erro, aviso, mudarEstado, mudarRastreio, alternarPagamento, anular, reabrir, apagar };
}
