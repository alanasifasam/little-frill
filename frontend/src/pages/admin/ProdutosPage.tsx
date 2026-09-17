// CRUD do catálogo + imagem; editor lateral com margem calculada ao vivo
import { Link } from 'react-router-dom';
import { useAdminProdutos } from '../../hooks/admin/useAdminProdutos';
import { PainelEdicaoLateral } from '../../components/admin/PainelEdicaoLateral';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { EditorImagemProduto } from '../../components/admin/EditorImagemProduto';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { TecidoSwatch } from '../../components/ui/TecidoSwatch';
import { formatarEuros } from '../../lib/moeda';
import { urlFoto } from '../../lib/fotos';
import { CORES, PADROES, SECOES, type Sec } from '../../models/produto';
import { TIPOS } from '../../mocks/admin/produtos.mock';

function margemTexto(preco: number, custo: number): string {
  return preco > 0 ? `${Math.round(((preco - custo) / preco) * 100)}%` : '—';
}

export function ProdutosPage() {
  const {
    produtos, carregando, erro, aviso, editId, rascunho, atualizarRascunho,
    abrirNovo, abrirEdicao, cancelar, guardar, apagar, alternar, atualizarFotosProduto,
  } = useAdminProdutos();

  if (carregando) return <p>A carregar os produtos…</p>;
  if (erro) return <p role="alert">{erro}</p>;

  const nVisiveis = produtos.filter((p) => p.ativo).length;
  const nDestaque = produtos.filter((p) => p.destaque).length;

  const totalPreco = produtos.reduce((total, p) => total + p.preco, 0);
  const totalCusto = produtos.reduce((total, p) => total + p.custo, 0);
  const totalStock = produtos.reduce((total, p) => total + p.stock, 0);
  const totalVendidas = produtos.reduce((total, p) => total + p.vendidas, 0);
  const margemTotal = margemTexto(totalPreco, totalCusto);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Produtos</h1>
          <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '38em' }}>
            {produtos.length} peças no catálogo, {nVisiveis} visíveis na loja e {nDestaque} em destaque na home.
          </p>
        </div>
        <Button variant="primary" onClick={abrirNovo} style={{ marginLeft: 'auto' }}>
          Nova peça
        </Button>
      </div>
      <AvisoLinha>{aviso}</AvisoLinha>

      <PainelEdicaoLateral titulo={editId === 'novo' ? 'Nova peça' : 'Editar peça'} aberto={editId !== null}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-3)', alignItems: 'start' }}>
          <div>
            <EditorImagemProduto
              produtoId={typeof editId === 'number' ? editId : null}
              padrao={rascunho.padrao}
              cor={rascunho.cor}
              fotos={typeof editId === 'number' ? produtos.find((p) => p.id === editId)?.fotos ?? [] : []}
              onFotosChange={(novasFotos) => {
                if (typeof editId === 'number') atualizarFotosProduto(editId, novasFotos);
              }}
            />
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="field">
                <label htmlFor="prod-nome">Nome</label>
                <input id="prod-nome" className="input" value={rascunho.nome} placeholder="Bolsa Alentejo" onChange={(e) => atualizarRascunho('nome', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="prod-tipo">Tipo</label>
                <select id="prod-tipo" className="input" value={rascunho.tipo} onChange={(e) => atualizarRascunho('tipo', e.target.value)}>
                  {TIPOS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="prod-sec">Secção</label>
                <select id="prod-sec" className="input" value={rascunho.sec} onChange={(e) => atualizarRascunho('sec', e.target.value as Sec)}>
                  {SECOES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                {editId === 'novo' ? (
                  <>
                    <label htmlFor="prod-stock">Stock inicial</label>
                    <input id="prod-stock" className="input" type="number" min={0} value={rascunho.stock} onChange={(e) => atualizarRascunho('stock', Number(e.target.value))} />
                  </>
                ) : (
                  <>
                    <label htmlFor="prod-stock-atual">Stock atual</label>
                    <p id="prod-stock-atual" style={{ margin: 0, padding: '9px 0', fontWeight: 600 }}>
                      {rascunho.stock} — ajustar em{' '}
                      <Link to="/admin/stock" style={{ fontWeight: 400 }}>
                        Stock
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <div className="field">
                <label htmlFor="prod-preco">Preço (€)</label>
                <input id="prod-preco" className="input" type="number" min={0} step={0.5} value={rascunho.preco} onChange={(e) => atualizarRascunho('preco', Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="prod-custo">Custo (€)</label>
                <input id="prod-custo" className="input" type="number" min={0} step={0.1} value={rascunho.custo} onChange={(e) => atualizarRascunho('custo', Number(e.target.value))} />
              </div>
              <div className="field">
                <label htmlFor="prod-padrao">Padrão</label>
                <select id="prod-padrao" className="input" value={rascunho.padrao} onChange={(e) => atualizarRascunho('padrao', e.target.value as typeof rascunho.padrao)}>
                  {Object.entries(PADROES).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="prod-cor">Cor</label>
                <select id="prod-cor" className="input" value={rascunho.cor} onChange={(e) => atualizarRascunho('cor', e.target.value as typeof rascunho.cor)}>
                  {Object.entries(CORES).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field" style={{ marginTop: 'var(--space-3)' }}>
              <label htmlFor="prod-tecido">Tecido e acabamento</label>
              <input id="prod-tecido" className="input" value={rascunho.tecido} placeholder="Algodão xadrez, forro de sarja" onChange={(e) => atualizarRascunho('tecido', e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Button variant="primary" onClick={() => guardar()}>
                Guardar peça
              </Button>
              <Button variant="secondary" onClick={cancelar}>Cancelar</Button>
              {typeof editId === 'number' && (
                <Button variant="secondary" onClick={() => apagar(editId)}>Apagar</Button>
              )}
              <span style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginLeft: 'auto' }}>
                Margem: {margemTexto(rascunho.preco, rascunho.custo)}
              </span>
            </div>
          </div>
        </div>
      </PainelEdicaoLateral>

      <table className="table" style={{ width: '100%', marginTop: 'var(--space-6)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Peça</th>
            <th style={{ textAlign: 'left' }}>Tipo</th>
            <th style={{ textAlign: 'right' }}>Preço</th>
            <th style={{ textAlign: 'right' }}>Custo</th>
            <th style={{ textAlign: 'right' }}>Margem</th>
            <th style={{ textAlign: 'right' }}>Stock</th>
            <th style={{ textAlign: 'right' }}>Vendidas</th>
            <th style={{ textAlign: 'left' }}>Na loja</th>
            <th style={{ textAlign: 'left' }}>Home</th>
            <th style={{ textAlign: 'left' }}>Nova</th>
            <th style={{ textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p.id} style={{ background: editId === p.id ? 'var(--color-accent-100)' : 'transparent' }}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <TecidoSwatch
                    padrao={p.padrao}
                    cor={p.cor}
                    imagemUrl={p.fotoKey ? urlFoto(p.fotoKey) : undefined}
                    focoX={p.fotoFocoX}
                    focoY={p.fotoFocoY}
                    altura={44}
                    style={{ width: 44, flex: 'none' }}
                  />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{p.nome}</span>
                </div>
              </td>
              <td style={{ color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', whiteSpace: 'nowrap' }}>{p.tipo}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatarEuros(p.preco)}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: 'var(--color-accent-800)' }}>{formatarEuros(p.custo)}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: 'var(--color-accent-700)' }}>{margemTexto(p.preco, p.custo)}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{p.stock}</td>
              <td style={{ textAlign: 'right' }}>{p.vendidas}</td>
              <td>
                <button type="button" onClick={() => alternar(p.id, 'ativo')} className="link-quiet" style={{ fontStyle: 'normal', cursor: 'pointer' }}>
                  <Tag variant={p.ativo ? 'outline' : 'neutral'}>{p.ativo ? 'Na loja' : 'Escondida'}</Tag>
                </button>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => alternar(p.id, 'destaque')}
                  className="link-quiet"
                  style={{ fontStyle: 'normal', cursor: 'pointer', color: p.destaque ? 'var(--color-accent-700)' : 'color-mix(in srgb,var(--color-text) 45%,transparent)' }}
                >
                  {p.destaque ? 'Destaque' : '—'}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => alternar(p.id, 'nova')}
                  className="link-quiet"
                  style={{ fontStyle: 'normal', cursor: 'pointer', color: p.nova ? 'var(--color-accent-700)' : 'color-mix(in srgb,var(--color-text) 45%,transparent)' }}
                >
                  {p.nova ? 'Nova' : '—'}
                </button>
              </td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button type="button" onClick={() => abrirEdicao(p.id)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                  Editar
                </button>
                <span style={{ color: 'var(--color-divider)' }}> · </span>
                <button type="button" onClick={() => apagar(p.id)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                  Apagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ borderTop: '2px solid var(--color-divider)', fontWeight: 600 }}>
            <td colSpan={2}>Total</td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatarEuros(totalPreco)}</td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatarEuros(totalCusto)}</td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: 'var(--color-accent-700)' }}>{margemTotal}</td>
            <td style={{ textAlign: 'right' }}>{totalStock}</td>
            <td style={{ textAlign: 'right' }}>{totalVendidas}</td>
            <td colSpan={4} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

