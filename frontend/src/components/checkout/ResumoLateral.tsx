// .card reutilizado em morada + pagamento — linhas do carrinho + subtotal/envio/total
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { TecidoSwatch } from '../ui/TecidoSwatch';
import type { ItemCarrinho } from '../../hooks/useCarrinho';

export interface ResumoLateralProps {
  itens: ItemCarrinho[];
  subtotal: number;
  envio: number;
  total: number;
  mostrarSubtotal?: boolean;
}

export function ResumoLateral({ itens, subtotal, envio, total, mostrarSubtotal = true }: ResumoLateralProps) {
  const totalItens = itens.reduce((t, i) => t + i.qty, 0);
  const countCesto = totalItens === 1 ? '1 peça no carrinho' : `${totalItens} peças no carrinho`;

  return (
    <div className="card elev-sm">
      <div className="card-kicker">{countCesto}</div>
      {itens.map(({ produto, qty }) => (
        <div key={produto.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
          <TecidoSwatch
            padrao={produto.padrao}
            cor={produto.cor}
            altura={38}
            style={{ width: 38, borderRadius: 2 }}
            imagemUrl={produto.fotoKey ? urlFoto(produto.fotoKey) : undefined}
            focoX={produto.fotoFocoX}
            focoY={produto.fotoFocoY}
          />
          <span>
            {produto.nome} × {qty}
          </span>
          <span style={{ marginLeft: 'auto' }}>{formatarEuros(produto.preco * qty)}</span>
        </div>
      ))}
      <div style={{ height: 1, background: 'var(--color-divider)', margin: 'var(--space-2) 0' }} />
      {mostrarSubtotal && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <span>Subtotal</span>
          <span>{formatarEuros(subtotal)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
        <span>Envio</span>
        <span>{envio === 0 ? 'grátis' : formatarEuros(envio)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: 21, marginTop: 6 }}>
        <span>Total</span>
        <span>{formatarEuros(total)}</span>
      </div>
    </div>
  );
}
