// linha do carrinho — swatch, nome, stepper de qty, total, remover
import { Link } from 'react-router-dom';
import { TecidoSwatch } from '../ui/TecidoSwatch';
import { Button } from '../ui/Button';
import { QuantidadeStepper } from '../produto/QuantidadeStepper';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { PADROES, type Produto } from '../../models/produto';

export interface LinhaCarrinhoProps {
  produto: Produto;
  qty: number;
  onQtyChange: (qty: number) => void;
  onRemover: () => void;
}

export function LinhaCarrinho({ produto, qty, onQtyChange, onRemover }: LinhaCarrinhoProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        alignItems: 'center',
        padding: 'var(--space-4) 0',
        borderTop: '1px solid var(--color-divider)',
      }}
    >
      <Link to={`/produto/${produto.id}`} style={{ flex: 'none' }} aria-label={`Ver ${produto.nome}, ${produto.tecido}`}>
        <TecidoSwatch
          padrao={produto.padrao}
          cor={produto.cor}
          altura={92}
          style={{ width: 92 }}
          imagemUrl={produto.fotoKey ? urlFoto(produto.fotoKey) : undefined}
          focoX={produto.fotoFocoX}
          focoY={produto.fotoFocoY}
        />
      </Link>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>
          {produto.tipo}
        </div>
        <Link
          to={`/produto/${produto.id}`}
          style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 20, marginTop: 2, color: 'var(--color-text)' }}
        >
          {produto.nome}
        </Link>
        <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>
          {formatarEuros(produto.preco)} cada · {PADROES[produto.padrao]}
        </div>
      </div>
      <QuantidadeStepper value={qty} onChange={onQtyChange} />
      <div style={{ width: 96, textAlign: 'right', fontSize: 17 }}>{formatarEuros(produto.preco * qty)}</div>
      <Button variant="ghost" style={{ fontSize: 13 }} onClick={onRemover}>
        remover
      </Button>
    </div>
  );
}
