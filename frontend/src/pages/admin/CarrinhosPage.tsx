// carrinhos abertos: cliente/visitante, peças, idade, quente/abandonado, converter/apagar
import { useAdminCarrinhos } from '../../hooks/admin/useAdminCarrinhos';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { Tag } from '../../components/ui/Tag';
import { formatarEuros } from '../../lib/moeda';

function idadeTexto(horas: number): string {
  return horas < 24 ? `há ${horas} horas` : `há ${Math.round(horas / 24)} dias`;
}

export function CarrinhosPage() {
  const { carrinhos, carregando, erro, aviso, converter, apagar } = useAdminCarrinhos();

  if (carregando) return <p>A carregar os carrinhos…</p>;
  if (erro) return <p role="alert">{erro}</p>;

  const resumo =
    carrinhos.length === 0
      ? 'Nenhum carrinho aberto agora.'
      : `${carrinhos.length} carrinhos por fechar, ${formatarEuros(carrinhos.reduce((t, c) => t + c.total, 0))} em jogo.`;

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Carrinhos</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '40em' }}>{resumo}</p>
      <AvisoLinha>{aviso}</AvisoLinha>

      <table className="table" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Cliente</th>
            <th style={{ textAlign: 'left' }}>Peças no carrinho</th>
            <th style={{ textAlign: 'right' }}>Valor</th>
            <th style={{ textAlign: 'left' }}>Aberto</th>
            <th style={{ textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {carrinhos.map((c) => (
            <tr key={c.id}>
              <td>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{c.clienteNome}</div>
                <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{c.email}</div>
              </td>
              <td>{c.itens.map((i) => `${i.qty} × ${i.nome}`).join(', ')}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatarEuros(c.total)}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Tag variant={c.quente ? 'accent' : 'neutral'}>{c.quente ? 'Ainda quente' : 'Abandonado'}</Tag>
                <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)', marginTop: 3 }}>{idadeTexto(c.horas)}</div>
              </td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button type="button" onClick={() => converter(c.id)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                  Passar a encomenda
                </button>
                <span style={{ color: 'var(--color-divider)' }}> · </span>
                <button type="button" onClick={() => apagar(c.id)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                  Apagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 'var(--space-4)', maxWidth: '40em', lineHeight: 1.5 }}>
        Passar a encomenda cria uma referência nova, por pagar, com as mesmas peças — serve para quando a cliente fecha por mensagem ou no ateliê.
      </p>
    </div>
  );
}
