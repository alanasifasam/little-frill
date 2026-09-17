// /minhas-encomendas — exige sessão; tabela mestre + painel de detalhe (Ver seguimento)
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMinhasEncomendas } from '../hooks/useMinhasEncomendas';
import { ESTADOS_ENCOMENDA, TAG_ESTILO_ESTADO, TAG_VARIANTE_ESTADO } from '../models/encomenda';
import { formatarEuros } from '../lib/moeda';
import { Tag } from '../components/ui/Tag';
import { Ruffle } from '../components/ui/Ruffle';
import { DetalheEncomenda } from '../components/conta/DetalheEncomenda';

export function MinhasEncomendasPage() {
  const { utilizador } = useAuth();
  const { encomendas, carregando, erro } = useMinhasEncomendas();
  const [referenciaSelecionada, setReferenciaSelecionada] = useState<string | null>(null);

  if (!utilizador) {
    return <Navigate to="/entrar" replace state={{ from: '/minhas-encomendas' }} />;
  }

  const selecionada = referenciaSelecionada ?? encomendas[0]?.referencia ?? null;

  return (
    <div>
      <h1 style={{ fontSize: 52, margin: '0 0 var(--space-6)', letterSpacing: '-0.02em' }}>Os meus pedidos</h1>

      {carregando && <p>A carregar…</p>}
      {erro && (
        <p role="alert" style={{ color: 'var(--color-accent-800)' }}>
          {erro}
        </p>
      )}

      {!carregando && !erro && encomendas.length === 0 && (
        <div style={{ maxWidth: '30em' }}>
          <p style={{ fontSize: 18, fontStyle: 'italic' }}>Ainda não tem encomendas.</p>
          <Link to="/catalogo" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 'var(--space-3)' }}>
            Ver o catálogo
          </Link>
        </div>
      )}

      {!carregando && !erro && encomendas.length > 0 && (
        <>
          <table className="table" style={{ maxWidth: 760 }}>
            <thead>
              <tr>
                {['Referência', 'Data', 'Itens', 'Total', 'Estado', ''].map((coluna) => (
                  <th
                    key={coluna}
                    style={{
                      textAlign: 'left',
                      fontWeight: 400,
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
                      paddingBottom: 'var(--space-2)',
                    }}
                  >
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {encomendas.map((encomenda) => {
                const ativa = encomenda.referencia === selecionada;
                return (
                  <tr
                    key={encomenda.referencia}
                    onClick={() => setReferenciaSelecionada(encomenda.referencia)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        boxShadow: ativa ? 'inset 3px 0 0 var(--color-accent)' : undefined,
                        paddingLeft: ativa ? 'var(--space-2)' : undefined,
                      }}
                    >
                      {encomenda.referencia}
                    </td>
                    <td>{new Date(encomenda.criada).toLocaleDateString('pt-PT')}</td>
                    <td>{encomenda.numeroItens}</td>
                    <td>{formatarEuros(encomenda.total)}</td>
                    <td>
                      <Tag variant={TAG_VARIANTE_ESTADO[encomenda.estado]} style={TAG_ESTILO_ESTADO[encomenda.estado]}>
                        {ESTADOS_ENCOMENDA[encomenda.estado]}
                      </Tag>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="link-quiet"
                        style={{ fontStyle: 'normal' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReferenciaSelecionada(encomenda.referencia);
                        }}
                      >
                        Ver seguimento
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {selecionada && (
            <>
              <Ruffle cor="var(--color-accent-200)" tamanho="sm" style={{ margin: 'var(--space-6) 0' }} />
              <DetalheEncomenda referencia={selecionada} />
            </>
          )}
        </>
      )}
    </div>
  );
}
