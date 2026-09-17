// passo 1/3 — PassosIndicador + MoradaForm + EnvioOpcoes + ResumoLateral
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCheckout';
import { useCarrinho } from '../../hooks/useCarrinho';
import { useAuth } from '../../hooks/useAuth';
import { useSiteInfo } from '../../hooks/useSiteInfo';
import { PassosIndicador } from '../../components/checkout/PassosIndicador';
import { MoradaForm } from '../../components/checkout/MoradaForm';
import { EnvioOpcoes } from '../../components/checkout/EnvioOpcoes';
import { ResumoLateral } from '../../components/checkout/ResumoLateral';
import { Button } from '../../components/ui/Button';
import { calcularCustoEnvio, type Endereco } from '../../models/encomenda';

const REGEX_CODIGO_POSTAL = /^\d{4}-\d{3}$/;

function validarMorada(morada: Partial<Endereco>): Partial<Record<keyof Endereco, string>> {
  const erros: Partial<Record<keyof Endereco, string>> = {};
  if (!morada.nome?.trim()) erros.nome = 'Indique o nome completo.';
  if (!morada.telefone?.trim()) erros.telefone = 'Indique um telefone de contacto.';
  if (!morada.email?.trim()) erros.email = 'Indique um e-mail.';
  if (!morada.morada?.trim()) erros.morada = 'Indique a morada.';
  if (!morada.codigoPostal || !REGEX_CODIGO_POSTAL.test(morada.codigoPostal)) {
    erros.codigoPostal = 'Formato esperado: 0000-000.';
  }
  if (!morada.localidade?.trim()) erros.localidade = 'Indique a localidade.';
  if (!morada.distrito?.trim()) erros.distrito = 'Escolha um distrito.';
  return erros;
}

export function MoradaPage() {
  const { estado, atualizarMorada, definirEnvio } = useCheckout();
  const { itensDetalhados, subtotal } = useCarrinho();
  const { utilizador } = useAuth();
  const { siteInfo } = useSiteInfo();
  const navigate = useNavigate();
  const [erros, setErros] = useState<Partial<Record<keyof Endereco, string>>>({});

  if (!utilizador) {
    return <Navigate to="/entrar" replace state={{ from: '/checkout/morada' }} />;
  }

  const envio = calcularCustoEnvio(subtotal, estado.envio, siteInfo.envioCustoPadrao, siteInfo.envioLimiarGratis);
  const total = subtotal + envio;

  function submeter() {
    const proximosErros = validarMorada(estado.morada);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length === 0) {
      navigate('/checkout/pagamento');
    }
  }

  return (
    <div>
      <PassosIndicador passoAtual={1} />
      <h1 style={{ fontSize: 48, margin: '0 0 var(--space-6)', letterSpacing: '-0.02em' }}>Onde entregamos?</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div>
          <MoradaForm valor={estado.morada} onChange={atualizarMorada} erros={erros} />

          <h2 style={{ fontSize: 22, margin: 'var(--space-8) 0 var(--space-3)' }}>Como quer receber</h2>
          <EnvioOpcoes
            value={estado.envio}
            onChange={definirEnvio}
            subtotal={subtotal}
            custoPadrao={siteInfo.envioCustoPadrao}
            limiarGratis={siteInfo.envioLimiarGratis}
          />
          <p
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              color: 'color-mix(in srgb,var(--color-text) 60%,transparent)',
              marginTop: 'var(--space-4)',
              maxWidth: '44em',
            }}
          >
            Entregamos apenas em Portugal — continente e ilhas. Encomendas para as ilhas seguem por CTT com 1 a 2
            dias extra.
          </p>
          <Button variant="primary" style={{ fontSize: 15, padding: '13px 26px', marginTop: 'var(--space-4)' }} onClick={submeter}>
            Continuar para pagamento
          </Button>
        </div>
        <ResumoLateral itens={itensDetalhados} subtotal={subtotal} envio={envio} total={total} />
      </div>
    </div>
  );
}
