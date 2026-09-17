// H1 + gancho + CTAs "Ver todas as peças" / "Acessórios" (copy fixa do handoff §6)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruffle } from '../ui/Ruffle';
import { swatch } from '../../lib/swatch';
import { urlFoto } from '../../lib/fotos';
import { CORES } from '../../models/produto';
import { useSiteInfo } from '../../hooks/useSiteInfo';

export function Hero() {
  const { siteInfo } = useSiteInfo();
  const heroImagemUrl = siteInfo.heroImagemKey ? urlFoto(siteInfo.heroImagemKey) : undefined;

  // Se a foto do Hero não carregar (key sem blob correspondente), cai para o
  // swatch de tecido em vez de deixar uma imagem partida no topo da home.
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    setFalhou(false);
  }, [heroImagemUrl]);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'var(--space-8)', alignItems: 'end' }}>
      <div style={{ paddingBottom: 'var(--space-4)' }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-700)',
            marginBottom: 'var(--space-3)',
          }}
        >
          {siteInfo.heroEyebrow}
        </div>
        <h1 style={{ fontSize: 70, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '0 0 var(--space-3)', maxWidth: '11em' }}>
          {siteInfo.titulo}
        </h1>
        <p style={{ fontSize: 17, fontStyle: 'italic', color: 'var(--color-accent-700)', margin: '0 0 var(--space-3)' }}>
          {siteInfo.gancho}
        </p>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.5,
            maxWidth: '34em',
            color: 'color-mix(in srgb,var(--color-text) 78%,transparent)',
          }}
        >
          {siteInfo.heroCorpo}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <Link to="/catalogo" className="btn btn-primary" style={{ fontSize: 15, padding: '12px 22px' }}>
            {siteInfo.heroCta1Label}
          </Link>
          <Link to="/catalogo/acessorios" className="btn btn-secondary" style={{ fontSize: 15, padding: '12px 22px' }}>
            {siteInfo.heroCta2Label}
          </Link>
        </div>
      </div>
      <div>
        {heroImagemUrl && !falhou ? (
          <img
            src={heroImagemUrl}
            alt={siteInfo.heroImagemLegenda}
            loading="lazy"
            onError={() => setFalhou(true)}
            style={{ height: 420, width: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{ height: 420, borderRadius: 'var(--radius-md)', background: swatch('xadrez', 'rosa') }}
          />
        )}
        <Ruffle cor={CORES.rosa.lt} tamanho="lg" />
        <div
          style={{
            fontSize: 11,
            color: 'color-mix(in srgb,var(--color-text) 55%,transparent)',
            marginTop: 'var(--space-2)',
          }}
        >
          {siteInfo.heroImagemLegenda}
        </div>
      </div>
    </div>
  );
}
