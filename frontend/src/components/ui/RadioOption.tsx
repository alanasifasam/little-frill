// .radio + .dot, usado em envio/pagamento/checkboxes
import type { CSSProperties, ReactNode } from 'react';

export interface RadioOptionProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: ReactNode;
  nota?: ReactNode;
  trailing?: ReactNode;
  type?: 'radio' | 'checkbox';
  name?: string;
  square?: boolean;
  style?: CSSProperties;
}

export function RadioOption({
  id,
  checked,
  onChange,
  label,
  nota,
  trailing,
  type = 'radio',
  name,
  square = false,
  style,
}: RadioOptionProps) {
  return (
    <label className="radio" style={{ alignItems: nota ? 'flex-start' : 'center', ...style }}>
      <input type={type} id={id} name={name} checked={checked} onChange={onChange} />
      <span className="dot" style={square ? { borderRadius: 'var(--radius-sm)', marginTop: nota ? 3 : 0 } : { marginTop: nota ? 3 : 0 }} />
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: nota ? 'var(--font-heading)' : undefined, fontSize: nota ? 16 : undefined }}>{label}</span>
        {nota && (
          <span style={{ fontSize: 13, color: 'color-mix(in srgb,var(--color-text) 62%,transparent)' }}>{nota}</span>
        )}
      </span>
      {trailing && <span style={{ marginLeft: 'auto', fontSize: 15 }}>{trailing}</span>}
    </label>
  );
}
