// select destaque | baratos | caros | nome
import type { Ordenar } from '../../hooks/useProdutos';

export interface OrdenarSelectProps {
  value: Ordenar;
  onChange: (valor: Ordenar) => void;
}

export function OrdenarSelect({ value, onChange }: OrdenarSelectProps) {
  return (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value as Ordenar)}
      aria-label="Ordenar produtos"
      style={{ width: 'auto', minWidth: 180 }}
    >
      <option value="destaque">Ordenar: destaque</option>
      <option value="baratos">Preço, mais baixo</option>
      <option value="caros">Preço, mais alto</option>
      <option value="nome">Nome A–Z</option>
    </select>
  );
}
