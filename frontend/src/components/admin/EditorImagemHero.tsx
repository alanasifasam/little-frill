// Caixa de foto do Hero da home: pré-visualização + upload real (multipart),
// autónomo do formulário do separador Site — a foto grava assim que se
// escolhe o ficheiro, sem depender do botão "Guardar" partilhado (o PUT
// genérico é JSON e já não aceita a key da foto).
import { useState, type ChangeEvent } from 'react';
import { swatch } from '../../lib/swatch';
import { urlFoto, validarFicheiroFoto } from '../../lib/fotos';
import { atualizarHeroFoto, rodarHeroFoto } from '../../api/admin/configuracaoSite';
import { mensagemErro } from '../../lib/erroApi';

const BOX_H = 180;

interface EditorImagemHeroProps {
  heroImagemKey?: string;
  onHeroFotoAtualizada: (novaKey: string) => void;
}

export function EditorImagemHero({ heroImagemKey, onHeroFotoAtualizada }: EditorImagemHeroProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const [aRodar, setARodar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const corTexto = 'color-mix(in srgb,var(--color-text) 62%,transparent)';
  const imagemMostrada = previewUrl ?? (heroImagemKey ? urlFoto(heroImagemKey) : undefined);

  async function selecionarFicheiro(e: ChangeEvent<HTMLInputElement>) {
    const ficheiro = e.target.files?.[0];
    e.target.value = '';
    if (!ficheiro) return;

    const erroValidacao = validarFicheiroFoto(ficheiro);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setErro(null);
    const url = URL.createObjectURL(ficheiro);
    setPreviewUrl(url);
    setAEnviar(true);
    try {
      const configuracao = await atualizarHeroFoto(ficheiro);
      onHeroFotoAtualizada(configuracao.heroImagemKey ?? '');
    } catch (erroPedido) {
      setErro(mensagemErro(erroPedido, 'Não foi possível enviar a fotografia.'));
    } finally {
      setAEnviar(false);
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    }
  }

  async function rodar(sentidoHorario: boolean) {
    setARodar(true);
    try {
      const configuracao = await rodarHeroFoto(sentidoHorario);
      onHeroFotoAtualizada(configuracao.heroImagemKey ?? '');
    } catch (erroPedido) {
      setErro(mensagemErro(erroPedido, 'Não foi possível rodar a fotografia.'));
    } finally {
      setARodar(false);
    }
  }

  return (
    <div>
      <div
        style={{
          position: 'relative',
          height: BOX_H,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: imagemMostrada ? undefined : swatch('xadrez', 'rosa'),
        }}
        aria-hidden={imagemMostrada ? undefined : 'true'}
      >
        {imagemMostrada && (
          <img src={imagemMostrada} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {heroImagemKey && (
          <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
            <button
              type="button"
              onClick={() => rodar(false)}
              disabled={aRodar}
              aria-label="Rodar a fotografia para a esquerda"
              title="Rodar à esquerda"
              style={{
                width: 22, height: 22, borderRadius: '50%', border: 0,
                background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 12,
                lineHeight: 1, cursor: 'pointer',
              }}
            >
              ↺
            </button>
            <button
              type="button"
              onClick={() => rodar(true)}
              disabled={aRodar}
              aria-label="Rodar a fotografia para a direita"
              title="Rodar à direita"
              style={{
                width: 22, height: 22, borderRadius: '50%', border: 0,
                background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 12,
                lineHeight: 1, cursor: 'pointer',
              }}
            >
              ↻
            </button>
          </div>
        )}
      </div>
      {!imagemMostrada && (
        <p style={{ fontSize: 13, color: corTexto, marginTop: 'var(--space-2)', lineHeight: 1.45 }}>
          Sem foto, o padrão do tecido serve de imagem.
        </p>
      )}
      <div className="field" style={{ marginTop: 'var(--space-2)' }}>
        <label htmlFor="site-hero-foto-ficheiro">Adicionar fotografia</label>
        <input
          id="site-hero-foto-ficheiro"
          className="input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={selecionarFicheiro}
          disabled={aEnviar}
          aria-describedby={erro ? 'site-hero-foto-erro' : undefined}
        />
      </div>
      {aEnviar && (
        <p style={{ fontSize: 13, color: corTexto, marginTop: 'var(--space-2)' }}>A enviar fotografia…</p>
      )}
      {erro && (
        <p id="site-hero-foto-erro" role="alert" style={{ fontSize: 13, color: 'var(--color-accent-700)', marginTop: 'var(--space-2)' }}>
          {erro}
        </p>
      )}
    </div>
  );
}
