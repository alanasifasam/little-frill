// checkbox estilizado como interruptor, reaproveita .radio/.dot (ver ui/RadioOption)
export interface InterruptorProps {
  id: string;
  ligado: boolean;
  onChange: () => void;
  /** Nome acessível — obrigatório porque o interruptor não mostra texto junto ao próprio input. */
  label: string;
}

export function Interruptor({ id, ligado, onChange, label }: InterruptorProps) {
  return (
    <label className="radio" style={{ margin: 0 }}>
      <input type="checkbox" id={id} checked={ligado} onChange={onChange} aria-label={label} />
      <span className="dot" style={{ borderRadius: 'var(--radius-sm)' }} />
    </label>
  );
}
