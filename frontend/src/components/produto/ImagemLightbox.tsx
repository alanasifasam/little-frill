// caixa maior sobre as vistas do produto — teclado (Esc/setas), fecha no fundo
import { useEffect, useRef } from 'react';

export interface ImagemLightboxProps {
  /** Em modo 'swatch' são valores CSS `background`; em modo 'foto' são URLs de imagem. */
  vistas: string[];
  indiceAtivo: number;
  onNavegar: (delta: 1 | -1) => void;
  onFechar: () => void;
  /** @default 'swatch' */
  modo?: 'swatch' | 'foto';
}

export function ImagemLightbox({ vistas, indiceAtivo, onNavegar, onFechar, modo = 'swatch' }: ImagemLightboxProps) {
  const fecharRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fecharRef.current?.focus();
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
      if (e.key === 'ArrowLeft') onNavegar(-1);
      if (e.key === 'ArrowRight') onNavegar(1);
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onFechar, onNavegar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Imagem ampliada"
      onClick={onFechar}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'color-mix(in srgb, var(--color-text) 78%, transparent)',
        animation: 'lightbox-entrada 0.15s ease',
      }}
    >
      <button
        ref={fecharRef}
        type="button"
        aria-label="Fechar"
        onClick={onFechar}
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 0,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          fontSize: 20,
          cursor: 'pointer',
        }}
      >
        ×
      </button>

      <button
        type="button"
        aria-label="Vista anterior"
        onClick={(e) => {
          e.stopPropagation();
          onNavegar(-1);
        }}
        style={{
          position: 'absolute',
          left: 'var(--space-4)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: 0,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          fontSize: 22,
          cursor: 'pointer',
        }}
      >
        ‹
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(90vw, 640px)',
          height: 'min(80vh, 640px)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: modo === 'foto' ? undefined : vistas[indiceAtivo],
        }}
      >
        {modo === 'foto' && (
          <img
            src={vistas[indiceAtivo]}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>

      <button
        type="button"
        aria-label="Vista seguinte"
        onClick={(e) => {
          e.stopPropagation();
          onNavegar(1);
        }}
        style={{
          position: 'absolute',
          right: 'var(--space-4)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: 0,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          fontSize: 22,
          cursor: 'pointer',
        }}
      >
        ›
      </button>
    </div>
  );
}
