// formulário PT — nome, telefone, email, morada, andar/porta, código postal 0000-000, distrito, notas
import { Field } from '../ui/Field';
import { DISTRITOS } from '../../lib/distritos';
import type { Endereco } from '../../models/encomenda';

export interface MoradaFormProps {
  valor: Partial<Endereco>;
  onChange: (dados: Partial<Endereco>) => void;
  erros?: Partial<Record<keyof Endereco, string>>;
}

export function MoradaForm({ valor, onChange, erros }: MoradaFormProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', maxWidth: 620 }}>
      <Field
        label="Nome completo"
        id="nome"
        placeholder="Maria Arrais"
        value={valor.nome ?? ''}
        error={erros?.nome}
        onChange={(e) => onChange({ nome: e.target.value })}
      />
      <Field
        label="Telefone"
        id="telefone"
        placeholder="+351 912 345 678"
        value={valor.telefone ?? ''}
        error={erros?.telefone}
        onChange={(e) => onChange({ telefone: e.target.value })}
      />
      <Field
        label="E-mail"
        id="email"
        type="email"
        placeholder="maria@exemplo.pt"
        value={valor.email ?? ''}
        error={erros?.email}
        style={{ gridColumn: 'span 2' }}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <Field
        label="Morada"
        id="morada"
        placeholder="Rua das Flores, 24"
        value={valor.morada ?? ''}
        error={erros?.morada}
        style={{ gridColumn: 'span 2' }}
        onChange={(e) => onChange({ morada: e.target.value })}
      />
      <Field
        label="Andar / porta"
        id="andarPorta"
        placeholder="2.º Dto."
        value={valor.andarPorta ?? ''}
        onChange={(e) => onChange({ andarPorta: e.target.value })}
      />
      <Field
        label="Código postal"
        id="codigoPostal"
        placeholder="2510-000"
        value={valor.codigoPostal ?? ''}
        error={erros?.codigoPostal}
        onChange={(e) => onChange({ codigoPostal: e.target.value })}
      />
      <Field
        label="Localidade"
        id="localidade"
        placeholder="Óbidos"
        value={valor.localidade ?? ''}
        error={erros?.localidade}
        onChange={(e) => onChange({ localidade: e.target.value })}
      />
      <Field
        label="Distrito"
        id="distrito"
        as="select"
        value={valor.distrito ?? ''}
        error={erros?.distrito}
        onChange={(e) => onChange({ distrito: e.target.value })}
      >
        <option value="" disabled>
          Escolha o distrito
        </option>
        {DISTRITOS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Field>
      <Field
        label="Notas para o ateliê (opcional)"
        id="notas"
        as="textarea"
        placeholder="É um presente — pode juntar um cartão escrito à mão?"
        value={valor.notas ?? ''}
        style={{ gridColumn: 'span 2' }}
        onChange={(e) => onChange({ notas: e.target.value })}
      />
    </div>
  );
}
