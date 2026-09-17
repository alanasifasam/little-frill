// label + input/select/textarea + erro ligado via aria-describedby
import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export interface FieldProps {
  label: string;
  id: string;
  as?: 'input' | 'textarea' | 'select';
  type?: string;
  value?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  rows?: number;
  error?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function Field({
  label,
  id,
  as = 'input',
  type = 'text',
  value,
  placeholder,
  name,
  required,
  autoComplete,
  rows,
  error,
  className,
  style,
  children,
  onChange,
}: FieldProps) {
  const erroId = error ? `${id}-erro` : undefined;

  return (
    <div className={['field', className].filter(Boolean).join(' ')} style={style}>
      <label htmlFor={id}>{label}</label>
      {as === 'textarea' && (
        <textarea
          id={id}
          name={name ?? id}
          className="input"
          placeholder={placeholder}
          value={value}
          rows={rows ?? 3}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={erroId}
          onChange={onChange}
        />
      )}
      {as === 'select' && (
        <select
          id={id}
          name={name ?? id}
          className="input"
          value={value}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={erroId}
          onChange={onChange}
        >
          {children}
        </select>
      )}
      {as === 'input' && (
        <input
          id={id}
          name={name ?? id}
          type={type}
          className="input"
          placeholder={placeholder}
          value={value}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={erroId}
          onChange={onChange}
        />
      )}
      {error && (
        <span id={erroId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
