// tabela de cadastros + editor lateral; cliente fiel (≥3 encomendas); apagar bloqueado com histórico (regra 5)
import { useAdminClientes } from '../../hooks/admin/useAdminClientes';
import { PainelEdicaoLateral } from '../../components/admin/PainelEdicaoLateral';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { formatarEuros } from '../../lib/moeda';

export function ClientesPage() {
  const { clientes, carregando, erro, aviso, editId, rascunho, atualizarRascunho, abrirNovo, abrirEdicao, cancelar, guardar, apagar } =
    useAdminClientes();

  if (carregando) return <p>A carregar os clientes…</p>;
  if (erro) return <p role="alert">{erro}</p>;

  const comCompras = clientes.filter((c) => c.nEncomendas > 0).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Clientes</h1>
          <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '38em' }}>
            {clientes.length} cadastros, {comCompras} com compras feitas.
          </p>
        </div>
        <Button variant="primary" onClick={abrirNovo} style={{ marginLeft: 'auto' }}>
          Novo cadastro
        </Button>
      </div>
      <AvisoLinha>{aviso}</AvisoLinha>

      <PainelEdicaoLateral titulo={editId === 'novo' ? 'Novo cadastro' : 'Editar cadastro'} aberto={editId !== null}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr 1fr 0.8fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
          <div className="field">
            <label htmlFor="cli-nome">Nome</label>
            <input id="cli-nome" className="input" value={rascunho.nome} placeholder="Maria" onChange={(e) => atualizarRascunho('nome', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="cli-sobrenome">Sobrenome</label>
            <input id="cli-sobrenome" className="input" value={rascunho.sobrenome} placeholder="Arrais" onChange={(e) => atualizarRascunho('sobrenome', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="cli-email">E-mail</label>
            <input id="cli-email" className="input" type="email" value={rascunho.email} placeholder="maria@exemplo.pt" onChange={(e) => atualizarRascunho('email', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="cli-tel">Telefone</label>
            <input id="cli-tel" className="input" value={rascunho.tel} placeholder="912 000 000" onChange={(e) => atualizarRascunho('tel', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="cli-cp">Código postal</label>
            <input id="cli-cp" className="input" value={rascunho.cp} placeholder="1250-066" onChange={(e) => atualizarRascunho('cp', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="cli-localidade">Localidade</label>
            <input id="cli-localidade" className="input" value={rascunho.localidade} placeholder="Lisboa" onChange={(e) => atualizarRascunho('localidade', e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Button variant="primary" onClick={guardar}>Guardar cadastro</Button>
          <Button variant="secondary" onClick={cancelar}>Cancelar</Button>
          {typeof editId === 'number' && (
            <Button variant="secondary" onClick={() => apagar(editId)}>Apagar</Button>
          )}
        </div>
      </PainelEdicaoLateral>

      <table className="table" style={{ width: '100%', marginTop: 'var(--space-6)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Nome</th>
            <th style={{ textAlign: 'left' }}>Contactos</th>
            <th style={{ textAlign: 'left' }}>Morada</th>
            <th style={{ textAlign: 'right' }}>Encomendas</th>
            <th style={{ textAlign: 'right' }}>Gasto</th>
            <th style={{ textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} style={{ background: editId === c.id ? 'var(--color-accent-100)' : 'transparent' }}>
              <td style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                {c.nome} {c.sobrenome}
                {c.fiel && (
                  <Tag variant="accent" style={{ marginLeft: 6 }}>
                    Cliente fiel
                  </Tag>
                )}
              </td>
              <td>
                <div>{c.email}</div>
                <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 60%,transparent)' }}>{c.tel}</div>
              </td>
              <td style={{ color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', whiteSpace: 'nowrap' }}>
                {c.cp} {c.localidade}
              </td>
              <td style={{ textAlign: 'right' }}>{c.nEncomendas}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{formatarEuros(c.gasto)}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button type="button" onClick={() => abrirEdicao(c.id)} className="link-quiet" style={{ fontStyle: 'normal', fontSize: 13, cursor: 'pointer' }}>
                  Editar
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
    </div>
  );
}
