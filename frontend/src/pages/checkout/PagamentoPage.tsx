// passo 2/3 — PassosIndicador + PagamentoOpcoes (campos condicionais) + ResumoLateral
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout, type CheckoutState } from '../../hooks/useCheckout';
import { useCarrinho } from '../../hooks/useCarrinho';
import { useMetodosPagamentoDisponiveis } from '../../hooks/useMetodosPagamentoDisponiveis';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { postEncomenda } from '../../api/encomendas';
import type { ErroApi } from '../../api/client';
import { PassosIndicador } from '../../components/checkout/PassosIndicador';
import { PagamentoOpcoes } from '../../components/checkout/PagamentoOpcoes';
import { ResumoLateral } from '../../components/checkout/ResumoLateral';
import { Button } from '../../components/ui/Button';
import { calcularCustoEnvio, type Endereco, type EncomendaInput } from '../../models/encomenda';
import { formatarEuros } from '../../lib/moeda';

function validarPagamento(estado: CheckoutState): Record<string, string> {
  const erros: Record<string, string> = {};
  if (estado.pagamento === 'cartao') {
    if (!estado.cartao.numero.trim()) erros.numero = 'Indique o número do cartão.';
    if (!estado.cartao.validade.trim()) erros.validade = 'Indique a validade.';
    if (!estado.cartao.cvv.trim()) erros.cvv = 'Indique o CVV.';
  }
  if (estado.querFatura && !estado.nif.trim()) {
    erros.nif = 'Indique o NIF para a fatura.';
  }
  return erros;
}

export function PagamentoPage() {
  const { estado, definirPagamento, atualizarCampo } = useCheckout();
  const { itensDetalhados, subtotal, linhas, limpar: limparCarrinho } = useCarrinho();
  const { metodosDisponiveis } = useMetodosPagamentoDisponiveis();
  const { siteInfo } = useSiteInfo();
  const navigate = useNavigate();
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);

  const envio = calcularCustoEnvio(subtotal, estado.envio, siteInfo.envioCustoPadrao, siteInfo.envioLimiarGratis);
  const total = subtotal + envio;

  useEffect(() => {
    if (metodosDisponiveis.length > 0 && !metodosDisponiveis.some((m) => m.metodo === estado.pagamento)) {
      definirPagamento(metodosDisponiveis[0].metodo);
    }
  }, [metodosDisponiveis, estado.pagamento, definirPagamento]);

  async function finalizar() {
    const proximosErros = validarPagamento(estado);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    const payload: EncomendaInput = {
      itens: linhas,
      entrega: estado.morada as Endereco,
      metodoEnvio: estado.envio,
      metodoPagamento: estado.pagamento,
      nif: estado.querFatura ? estado.nif : undefined,
      cartao: estado.pagamento === 'cartao' ? estado.cartao : undefined,
      subtotal,
      envio,
      total,
    };

    setAEnviar(true);
    setErroEnvio(null);
    try {
      const confirmada = await postEncomenda(payload);
      atualizarCampo('ultimaEncomenda', confirmada);
      limparCarrinho();
      navigate('/checkout/confirmacao');
    } catch (erro) {
      const erroApi = erro as ErroApi;
      setErroEnvio(erroApi.error ?? 'Não foi possível finalizar a encomenda. Tente novamente.');
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div>
      <PassosIndicador passoAtual={2} />
      <h1 style={{ fontSize: 48, margin: '0 0 var(--space-6)', letterSpacing: '-0.02em' }}>Pagamento</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div style={{ maxWidth: 620 }}>
          <PagamentoOpcoes
            metodo={estado.pagamento}
            onMetodoChange={definirPagamento}
            cartao={estado.cartao}
            onCartaoChange={(c) => atualizarCampo('cartao', c)}
            querFatura={estado.querFatura}
            onQuerFaturaChange={(v) => atualizarCampo('querFatura', v)}
            nif={estado.nif}
            onNifChange={(v) => atualizarCampo('nif', v)}
            erros={erros}
            metodosDisponiveis={metodosDisponiveis}
          />
          {erroEnvio && (
            <p role="alert" style={{ color: 'var(--color-accent-800)', marginTop: 'var(--space-4)' }}>
              {erroEnvio}
            </p>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            <Button variant="primary" style={{ fontSize: 15, padding: '13px 26px' }} onClick={finalizar} disabled={aEnviar}>
              Finalizar encomenda · {formatarEuros(total)}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/checkout/morada')}>
              Voltar à morada
            </Button>
          </div>
        </div>
        <ResumoLateral itens={itensDetalhados} subtotal={subtotal} envio={envio} total={total} mostrarSubtotal={false} />
      </div>
    </div>
  );
}
