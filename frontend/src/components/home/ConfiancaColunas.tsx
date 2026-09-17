// 3 colunas de confiança (uma pessoa/máquina, tecidos, envio)
import { formatarEuros } from '../../lib/moeda';
import { useSiteInfo } from '../../hooks/useSiteInfo';

export function ConfiancaColunas() {
  const { siteInfo } = useSiteInfo();

  const colunas = [
    {
      titulo: siteInfo.confianca1Titulo,
      texto: siteInfo.confianca1Texto,
    },
    {
      titulo: siteInfo.confianca2Titulo,
      texto: siteInfo.confianca2Texto,
    },
    {
      titulo: siteInfo.confianca3Titulo,
      texto: siteInfo.confianca3TextoModelo.replace('{valor}', formatarEuros(siteInfo.envioLimiarGratis)),
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-8)', marginTop: 90, maxWidth: 960 }}>
      {colunas.map((c) => (
        <div key={c.titulo}>
          <h3 style={{ fontSize: 21, marginBottom: 'var(--space-2)' }}>{c.titulo}</h3>
          <p style={{ fontSize: 14, color: 'color-mix(in srgb,var(--color-text) 75%,transparent)' }}>{c.texto}</p>
        </div>
      ))}
    </div>
  );
}
