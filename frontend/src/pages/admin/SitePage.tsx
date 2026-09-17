// modo de férias, texto da página inicial (hero + colunas de confiança) +
// limite de envio grátis, e secções visíveis da loja
import { useEffect, useState } from 'react';
import { useAdminSite } from '../../hooks/admin/useAdminSite';
import { Interruptor } from '../../components/admin/Interruptor';
import { AvisoLinha } from '../../components/admin/AvisoLinha';
import { EditorImagemHero } from '../../components/admin/EditorImagemHero';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';

export function SitePage() {
  const {
    configuracaoSite,
    seccoes,
    feriasLigadas,
    carregando,
    erro,
    aviso,
    guardarConfiguracaoSite,
    atualizarHeroImagemLocal,
    alternarFerias,
    alternarSeccaoVisivel,
  } = useAdminSite();

  const [titulo, setTitulo] = useState('');
  const [gancho, setGancho] = useState('');
  const [envioLimiarGratis, setEnvioLimiarGratis] = useState(0);
  const [heroEyebrow, setHeroEyebrow] = useState('');
  const [heroCorpo, setHeroCorpo] = useState('');
  const [heroCta1Label, setHeroCta1Label] = useState('');
  const [heroCta2Label, setHeroCta2Label] = useState('');
  const [heroImagemLegenda, setHeroImagemLegenda] = useState('');
  const [confianca1Titulo, setConfianca1Titulo] = useState('');
  const [confianca1Texto, setConfianca1Texto] = useState('');
  const [confianca2Titulo, setConfianca2Titulo] = useState('');
  const [confianca2Texto, setConfianca2Texto] = useState('');
  const [confianca3Titulo, setConfianca3Titulo] = useState('');
  const [confianca3TextoModelo, setConfianca3TextoModelo] = useState('');
  const [inicializado, setInicializado] = useState(false);

  useEffect(() => {
    if (configuracaoSite && !inicializado) {
      setTitulo(configuracaoSite.titulo);
      setGancho(configuracaoSite.gancho);
      setEnvioLimiarGratis(configuracaoSite.envioLimiarGratis);
      setHeroEyebrow(configuracaoSite.heroEyebrow);
      setHeroCorpo(configuracaoSite.heroCorpo);
      setHeroCta1Label(configuracaoSite.heroCta1Label);
      setHeroCta2Label(configuracaoSite.heroCta2Label);
      setHeroImagemLegenda(configuracaoSite.heroImagemLegenda);
      setConfianca1Titulo(configuracaoSite.confianca1Titulo);
      setConfianca1Texto(configuracaoSite.confianca1Texto);
      setConfianca2Titulo(configuracaoSite.confianca2Titulo);
      setConfianca2Texto(configuracaoSite.confianca2Texto);
      setConfianca3Titulo(configuracaoSite.confianca3Titulo);
      setConfianca3TextoModelo(configuracaoSite.confianca3TextoModelo);
      setInicializado(true);
    }
  }, [configuracaoSite, inicializado]);

  if (carregando) return <p>A carregar a configuração do site…</p>;
  if (erro || !configuracaoSite) return <p role="alert">{erro ?? 'Não foi possível carregar a configuração do site.'}</p>;

  const seccoesAtivas = seccoes.filter((s) => s.ativa).length;
  const totalPecas = seccoes.reduce((soma, s) => soma + s.pecas, 0);

  function submeterConfiguracaoSite() {
    guardarConfiguracaoSite({
      titulo,
      gancho,
      envioLimiarGratis,
      heroEyebrow,
      heroCorpo,
      heroCta1Label,
      heroCta2Label,
      heroImagemLegenda,
      confianca1Titulo,
      confianca1Texto,
      confianca2Titulo,
      confianca2Texto,
      confianca3Titulo,
      confianca3TextoModelo,
    });
  }

  return (
    <div>
      <h1 style={{ fontSize: 46, margin: 'var(--space-2) 0 var(--space-2)', letterSpacing: '-0.025em' }}>Site e manutenção</h1>
      <p style={{ fontSize: 17, color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', maxWidth: '38em' }}>
        {feriasLigadas ? 'Modo de férias ligado.' : 'Loja a funcionar normalmente.'}
      </p>
      {feriasLigadas && (
        <p style={{ fontSize: 15, color: 'var(--color-accent-700)', marginTop: 'var(--space-2)' }}>
          Modo de férias ligado — a loja aceita encomendas mas avisa que só saem no regresso.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', marginTop: 'var(--space-6)', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
            Funcionalidades da loja
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-divider)' }}>
            <Interruptor id="feature-ferias" ligado={feriasLigadas} onChange={alternarFerias} label="Modo de férias" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>Modo de férias</div>
              <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 2 }}>
                Aceita encomendas mas avisa que só saem no regresso.
              </div>
            </div>
            <Tag variant={feriasLigadas ? 'accent-2' : 'neutral'} style={{ whiteSpace: 'nowrap' }}>
              {feriasLigadas ? 'Ligado' : 'Desligado'}
            </Tag>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16, marginBottom: 'var(--space-2)' }}>
              Foto principal da home
            </div>
            <EditorImagemHero heroImagemKey={configuracaoSite.heroImagemKey} onHeroFotoAtualizada={atualizarHeroImagemLocal} />
            <div className="field" style={{ marginTop: 'var(--space-3)' }}>
              <label htmlFor="site-hero-legenda">Hero — legenda da imagem</label>
              <input
                id="site-hero-legenda"
                className="input"
                value={heroImagemLegenda}
                onChange={(e) => setHeroImagemLegenda(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
            Texto da página inicial
          </div>
          <div className="field">
            <label htmlFor="site-titulo">Título</label>
            <input id="site-titulo" className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-gancho">Gancho</label>
            <input id="site-gancho" className="input" value={gancho} onChange={(e) => setGancho(e.target.value)} />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)', maxWidth: 220 }}>
            <label htmlFor="site-limite">Limite de envio grátis (€)</label>
            <input
              id="site-limite"
              className="input"
              type="number"
              min={0}
              step={5}
              value={envioLimiarGratis}
              onChange={(e) => setEnvioLimiarGratis(Number(e.target.value))}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-hero-eyebrow">Hero — antetítulo</label>
            <input
              id="site-hero-eyebrow"
              className="input"
              value={heroEyebrow}
              onChange={(e) => setHeroEyebrow(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-hero-corpo">Hero — texto</label>
            <textarea
              id="site-hero-corpo"
              className="input"
              rows={3}
              value={heroCorpo}
              onChange={(e) => setHeroCorpo(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-hero-cta1">Hero — botão principal</label>
            <input
              id="site-hero-cta1"
              className="input"
              value={heroCta1Label}
              onChange={(e) => setHeroCta1Label(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-hero-cta2">Hero — botão secundário</label>
            <input
              id="site-hero-cta2"
              className="input"
              value={heroCta2Label}
              onChange={(e) => setHeroCta2Label(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 'var(--space-4)', borderLeft: '3px solid var(--color-accent)', paddingLeft: 'var(--space-3)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.02em' }}>{titulo}</div>
            <div style={{ fontStyle: 'italic', fontSize: 15, color: 'var(--color-accent-700)', marginTop: 6 }}>{gancho}</div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          height: 14, opacity: 'var(--ruffle-op)',
          background: 'radial-gradient(circle at 12px -2px,transparent 11px,var(--color-accent-200) 11px) 0 0/24px 14px repeat-x',
          margin: 'var(--space-8) 0 var(--space-6)',
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
            Colunas de confiança
          </div>
          <div className="field">
            <label htmlFor="site-confianca1-titulo">Coluna 1 — título</label>
            <input
              id="site-confianca1-titulo"
              className="input"
              value={confianca1Titulo}
              onChange={(e) => setConfianca1Titulo(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-confianca1-texto">Coluna 1 — texto</label>
            <textarea
              id="site-confianca1-texto"
              className="input"
              rows={3}
              value={confianca1Texto}
              onChange={(e) => setConfianca1Texto(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="site-confianca2-titulo">Coluna 2 — título</label>
            <input
              id="site-confianca2-titulo"
              className="input"
              value={confianca2Titulo}
              onChange={(e) => setConfianca2Titulo(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-confianca2-texto">Coluna 2 — texto</label>
            <textarea
              id="site-confianca2-texto"
              className="input"
              rows={3}
              value={confianca2Texto}
              onChange={(e) => setConfianca2Texto(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-4)' }}>
            <label htmlFor="site-confianca3-titulo">Coluna 3 — título</label>
            <input
              id="site-confianca3-titulo"
              className="input"
              value={confianca3Titulo}
              onChange={(e) => setConfianca3Titulo(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginTop: 'var(--space-3)' }}>
            <label htmlFor="site-confianca3-texto">Coluna 3 — texto</label>
            <textarea
              id="site-confianca3-texto"
              className="input"
              rows={3}
              value={confianca3TextoModelo}
              onChange={(e) => setConfianca3TextoModelo(e.target.value)}
            />
            <div style={{ fontSize: 12, color: 'color-mix(in srgb,var(--color-text) 55%,transparent)', marginTop: 4 }}>
              O texto literal <code>{'{valor}'}</code> é substituído automaticamente pelo limite de envio grátis na loja.
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 'var(--space-3)' }}>
            Secções visíveis · {seccoesAtivas} de {seccoes.length} secções, {totalPecas} peças
          </div>
          {seccoes.map((s) => (
            <div key={s.chave} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-divider)' }}>
              <Interruptor id={`seccao-${s.chave}`} ligado={s.ativa} onChange={() => alternarSeccaoVisivel(s.chave)} label={s.label} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)', marginTop: 2 }}>
                  {s.pecas} {s.pecas === 1 ? 'peça' : 'peças'}
                </div>
              </div>
              <Tag variant={s.ativa ? 'outline' : 'neutral'} style={{ whiteSpace: 'nowrap' }}>{s.ativa ? 'Visível' : 'Escondida'}</Tag>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Button variant="primary" onClick={submeterConfiguracaoSite}>
          Guardar
        </Button>
        <AvisoLinha>{aviso}</AvisoLinha>
      </div>
    </div>
  );
}
