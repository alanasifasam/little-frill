// .table — medidas, tecido, lavagem, envio
import type { Produto } from '../../models/produto';

export interface MedidasTabelaProps {
  produto: Produto;
}

export function MedidasTabela({ produto }: MedidasTabelaProps) {
  return (
    <table className="table" style={{ maxWidth: 420, marginBottom: 'var(--space-6)' }}>
      <tbody>
        <tr>
          <td style={{ width: '40%' }}>Medidas</td>
          <td>{produto.medidas}</td>
        </tr>
        <tr>
          <td>Tecido</td>
          <td>{produto.tecido}</td>
        </tr>
        <tr>
          <td>Lavagem</td>
          <td>Máquina a 30°, ferro morno</td>
        </tr>
        <tr>
          <td>Envio</td>
          <td>2 a 4 dias úteis · CTT</td>
        </tr>
      </tbody>
    </table>
  );
}
