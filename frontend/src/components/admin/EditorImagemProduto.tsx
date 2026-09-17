// Galeria de fotos do produto: miniaturas existentes (cada uma com apagar,
// definir principal e ajuste de ponto focal) + upload real de uma ou várias
// fotografias novas (multipart, envio imediato ao escolher os ficheiros,
// um de cada vez — a API recalcula ordem/principal a partir do produto
// nesse instante, por isso os envios têm de ser sequenciais, nunca em
// paralelo). Ordem = ordem de registo; para reordenar, apaga e volta a
// adicionar.
import { useState, type ChangeEvent, type MouseEvent } from 'react';
import {
  adicionarFotoProduto, definirFocoProduto, definirFotoPrincipal, removerFotoProduto, rodarFotoProduto,
  type ProdutoFotoDTO,
} from '../../api/admin/produtos';
import { urlFoto, validarFicheiroFoto } from '../../lib/fotos';
import { mensagemErro } from '../../lib/erroApi';
import { swatch } from '../../lib/swatch';
import { CORES, type Padrao } from '../../models/produto';
import { Tag } from '../ui/Tag';

const MINIATURA = 90;
const AJUSTE_LARGURA = 280;
const AJUSTE_ALTURA = 200;

interface EditorImagemProdutoProps {
  /** null enquanto a peça ainda não foi guardada uma primeira vez (sem id). */
  produtoId: number | null;
  padrao: Padrao;
  cor: keyof typeof CORES;
  fotos: ProdutoFotoDTO[];
  onFotosChange: (novasFotos: ProdutoFotoDTO[]) => void;
}

interface PreviewEmEnvio {
  id: string;
  url: string;
}

export function EditorImagemProduto({ produtoId, padrao, cor, fotos, onFotosChange }: EditorImagemProdutoProps) {
  const [previews, setPreviews] = useState<PreviewEmEnvio[]>([]);
  const [aEnviar, setAEnviar] = useState(false);
  const [erroUpload, setErroUpload] = useState<string | null>(null);
  const [aApagarId, setAApagarId] = useState<number | null>(null);
  const [aPrincipalId, setAPrincipalId] = useState<number | null>(null);
  const [ajusteId, setAjusteId] = useState<number | null>(null);
  const [aFoco, setAFoco] = useState(false);
  const [aRodar, setARodar] = useState(false);

  const corTexto = 'color-mix(in srgb,var(--color-text) 62%,transparent)';

  async function selecionarFicheiro(e: ChangeEvent<HTMLInputElement>) {
    const ficheiros = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = '';
    if (ficheiros.length === 0 || !produtoId) return;

    const validos: File[] = [];
    const mensagensFalha: string[] = [];
    for (const ficheiro of ficheiros) {
      const erroValidacao = validarFicheiroFoto(ficheiro);
      if (erroValidacao) {
        mensagensFalha.push(`${ficheiro.name} — ${erroValidacao}`);
      } else {
        validos.push(ficheiro);
      }
    }

    if (validos.length === 0) {
      setErroUpload(mensagensFalha.join(' '));
      return;
    }

    setErroUpload(null);
    const emEnvio: PreviewEmEnvio[] = validos.map((ficheiro, indice) => ({
      id: `${ficheiro.name}-${ficheiro.lastModified}-${indice}-${Math.random()}`,
      url: URL.createObjectURL(ficheiro),
    }));
    setPreviews(emEnvio);
    setAEnviar(true);

    // Envio sequencial e propositado: a API recalcula ordem/principal a
    // partir do estado atual do produto em cada pedido, pelo que enviar em
    // paralelo (Promise.all) criaria condições de corrida. Cada foto é
    // acrescentada a `fotos` assim que a sua própria chamada termina.
    let fotosAtuais = fotos;
    for (let indice = 0; indice < validos.length; indice += 1) {
      const ficheiro = validos[indice];
      try {
        const novaFoto = await adicionarFotoProduto(produtoId, ficheiro);
        fotosAtuais = [...fotosAtuais, novaFoto];
        onFotosChange(fotosAtuais);
      } catch (erro) {
        mensagensFalha.push(`${ficheiro.name} — ${mensagemErro(erro, 'não foi possível enviar.')}`);
      } finally {
        URL.revokeObjectURL(emEnvio[indice].url);
        setPreviews((atual) => atual.filter((p) => p.id !== emEnvio[indice].id));
      }
    }

    setAEnviar(false);
    if (mensagensFalha.length > 0) {
      setErroUpload(
        mensagensFalha.length === ficheiros.length
          ? `Nenhuma fotografia foi enviada: ${mensagensFalha.join(' ')}`
          : `${mensagensFalha.length} de ${ficheiros.length} fotografias não foram enviadas: ${mensagensFalha.join(' ')}`,
      );
    }
  }

  async function apagar(fotoId: number) {
    if (!produtoId) return;
    setAApagarId(fotoId);
    try {
      await removerFotoProduto(produtoId, fotoId);
      onFotosChange(fotos.filter((f) => f.id !== fotoId));
    } catch (erro) {
      setErroUpload(mensagemErro(erro, 'Não foi possível apagar a fotografia.'));
    } finally {
      setAApagarId(null);
    }
  }

  async function marcarPrincipal(fotoId: number) {
    if (!produtoId) return;
    setAPrincipalId(fotoId);
    try {
      const atualizada = await definirFotoPrincipal(produtoId, fotoId);
      onFotosChange(fotos.map((f) => (f.id === atualizada.id ? atualizada : { ...f, principal: false })));
    } catch (erro) {
      setErroUpload(mensagemErro(erro, 'Não foi possível definir a fotografia principal.'));
    } finally {
      setAPrincipalId(null);
    }
  }

  async function ajustarFoco(e: MouseEvent<HTMLDivElement>, fotoId: number) {
    if (!produtoId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const focoX = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    const focoY = Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)));
    setAFoco(true);
    try {
      const atualizada = await definirFocoProduto(produtoId, fotoId, focoX, focoY);
      onFotosChange(fotos.map((f) => (f.id === atualizada.id ? atualizada : f)));
    } catch (erro) {
      setErroUpload(mensagemErro(erro, 'Não foi possível ajustar o ponto focal.'));
    } finally {
      setAFoco(false);
    }
  }

  async function rodar(fotoId: number, sentidoHorario: boolean) {
    if (!produtoId) return;
    setARodar(true);
    try {
      const atualizada = await rodarFotoProduto(produtoId, fotoId, sentidoHorario);
      onFotosChange(fotos.map((f) => (f.id === atualizada.id ? atualizada : f)));
    } catch (erro) {
      setErroUpload(mensagemErro(erro, 'Não foi possível rodar a fotografia.'));
    } finally {
      setARodar(false);
    }
  }

  const fotoEmAjuste = fotos.find((f) => f.id === ajusteId) ?? null;

  if (produtoId === null) {
    return (
      <div>
        <div
          style={{ width: MINIATURA, height: MINIATURA, borderRadius: 'var(--radius-md)', background: swatch(padrao, cor) }}
          aria-hidden="true"
        />
        <p style={{ fontSize: 13, color: corTexto, marginTop: 'var(--space-2)', lineHeight: 1.45 }}>
          Guarde a peça primeiro para poder adicionar fotos.
        </p>
      </div>
    );
  }

  if (fotoEmAjuste) {
    return (
      <div>
        <p style={{ fontSize: 13, color: corTexto, marginBottom: 'var(--space-2)' }}>
          Clique na fotografia para marcar o ponto que deve ficar sempre visível, mesmo quando a caixa cortar a imagem.
        </p>
        <div
          onClick={(e) => ajustarFoco(e, fotoEmAjuste.id)}
          style={{
            position: 'relative',
            width: AJUSTE_LARGURA,
            height: AJUSTE_ALTURA,
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--color-bg)',
            cursor: aFoco ? 'wait' : 'crosshair',
          }}
        >
          <img
            src={urlFoto(fotoEmAjuste.key)}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: `${fotoEmAjuste.focoX}%`,
              top: `${fotoEmAjuste.focoY}%`,
              width: 14,
              height: 14,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              border: '2px solid var(--color-bg)',
              background: 'var(--color-accent)',
              boxShadow: 'var(--shadow-sm)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <button
            type="button"
            onClick={() => rodar(fotoEmAjuste.id, false)}
            disabled={aRodar}
            className="btn btn-secondary"
            aria-label="Rodar a fotografia para a esquerda"
            title="Rodar à esquerda"
            style={{ fontSize: 13, padding: '8px 14px' }}
          >
            ↺
          </button>
          <button
            type="button"
            onClick={() => rodar(fotoEmAjuste.id, true)}
            disabled={aRodar}
            className="btn btn-secondary"
            aria-label="Rodar a fotografia para a direita"
            title="Rodar à direita"
            style={{ fontSize: 13, padding: '8px 14px' }}
          >
            ↻
          </button>
          <button
            type="button"
            onClick={() => setAjusteId(null)}
            className="btn btn-secondary"
            style={{ fontSize: 13, padding: '8px 14px' }}
          >
            Fechar
          </button>
        </div>
        {erroUpload && (
          <p role="alert" style={{ fontSize: 13, color: 'var(--color-accent-700)', marginTop: 'var(--space-2)' }}>
            {erroUpload}
          </p>
        )}
      </div>
    );
  }

  const mostrarGaleria = fotos.length > 0 || previews.length > 0;

  return (
    <div>
      {!mostrarGaleria ? (
        <>
          <div
            style={{ width: MINIATURA, height: MINIATURA, borderRadius: 'var(--radius-md)', background: swatch(padrao, cor) }}
            aria-hidden="true"
          />
          <p style={{ fontSize: 13, color: corTexto, marginTop: 'var(--space-2)', lineHeight: 1.45 }}>
            Sem foto, o padrão do tecido serve de imagem.
          </p>
        </>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {fotos.map((img) => (
            <div key={img.id} style={{ position: 'relative', width: MINIATURA, height: MINIATURA }}>
              <button
                type="button"
                onClick={() => setAjusteId(img.id)}
                aria-label={`Ajustar o ponto focal de ${img.principal ? 'esta fotografia (principal)' : 'esta fotografia'}`}
                style={{
                  display: 'block', width: '100%', height: '100%', padding: 0, border: 0,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  backgroundImage: `url(${urlFoto(img.key)})`, backgroundSize: 'cover',
                  backgroundPosition: `${img.focoX}% ${img.focoY}%`,
                }}
              />
              {img.principal ? (
                <Tag
                  variant="accent"
                  style={{ position: 'absolute', top: 4, left: 4, fontSize: 10, pointerEvents: 'none' }}
                >
                  Principal
                </Tag>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    marcarPrincipal(img.id);
                  }}
                  disabled={aPrincipalId === img.id}
                  aria-label="Definir esta fotografia como principal"
                  title="Definir como principal"
                  style={{
                    position: 'absolute', top: 4, left: 4, width: 22, height: 22, borderRadius: '50%',
                    border: 0, background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 12,
                    lineHeight: 1, cursor: 'pointer',
                  }}
                >
                  ★
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  apagar(img.id);
                }}
                disabled={aApagarId === img.id}
                aria-label="Apagar esta fotografia"
                style={{
                  position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%',
                  border: 0, background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13,
                  lineHeight: 1, cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ))}
          {previews.map((preview, indice) => (
            <div key={preview.id} style={{ position: 'relative', width: MINIATURA, height: MINIATURA }}>
              <div
                aria-hidden="true"
                style={{
                  width: '100%', height: '100%', borderRadius: 'var(--radius-md)',
                  backgroundImage: `url(${preview.url})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  opacity: 0.55,
                }}
              />
              <span
                style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, textAlign: 'center', color: 'var(--color-text)',
                }}
              >
                {indice === 0 ? 'A enviar…' : 'Na fila…'}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="field" style={{ marginTop: 'var(--space-2)', maxWidth: 260 }}>
        <label htmlFor="prod-foto-ficheiro">Adicionar fotografias</label>
        <input
          id="prod-foto-ficheiro"
          className="input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={selecionarFicheiro}
          disabled={aEnviar}
          aria-describedby={erroUpload ? 'prod-foto-erro' : undefined}
        />
      </div>
      {erroUpload && (
        <p id="prod-foto-erro" role="alert" style={{ fontSize: 13, color: 'var(--color-accent-700)', marginTop: 'var(--space-2)' }}>
          {erroUpload}
        </p>
      )}
    </div>
  );
}
