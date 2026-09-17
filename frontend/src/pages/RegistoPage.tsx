// formulário de registo, POST /api/auth/registo
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { registo } from '../api/auth';
import type { ErroApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { comoPapel } from '../lib/papel';
import { Field } from '../components/ui/Field';
import { RadioOption } from '../components/ui/RadioOption';
import { Button } from '../components/ui/Button';
import { DISTRITOS } from '../lib/distritos';

interface ErrosRegisto {
  nome?: string;
  sobrenome?: string;
  email?: string;
  palavraPasse?: string;
  repetir?: string;
}

export function RegistoPage() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [repetir, setRepetir] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [distrito, setDistrito] = useState('');
  const [querCarta, setQuerCarta] = useState(false);
  const [erros, setErros] = useState<ErrosRegisto>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { entrar } = useAuth();
  const destino = (location.state as { from?: string } | null)?.from ?? '/';

  async function submeter(e: FormEvent) {
    e.preventDefault();
    const proximosErros: ErrosRegisto = {};
    if (!nome.trim()) proximosErros.nome = 'Indique o nome.';
    if (!sobrenome.trim()) proximosErros.sobrenome = 'Indique o sobrenome.';
    if (!email.trim()) proximosErros.email = 'Indique o e-mail.';
    if (palavraPasse.length < 8) proximosErros.palavraPasse = 'Mínimo 8 caracteres.';
    if (repetir !== palavraPasse) proximosErros.repetir = 'As palavras-passe não coincidem.';
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    setAEnviar(true);
    setErroEnvio(null);
    try {
      // auto-registo nunca escolhe papel: o servidor devolve sempre "cliente"
      // aqui; comoPapel() só normaliza o formato, não decide a permissão.
      const resposta = await registo({ nome, sobrenome, email, palavraPasse, codigoPostal, distrito, querCarta });
      entrar({ ...resposta, role: comoPapel(resposta.role) }, true);
      navigate(destino, { replace: true });
    } catch (erro) {
      const erroApi = erro as ErroApi;
      setErroEnvio(erroApi.error ?? 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, marginTop: 'var(--space-6)' }}>
      <h1 style={{ fontSize: 44, margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Criar conta</h1>
      <p style={{ color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>
        Guardamos morada e histórico. Nada de publicidade a mais.
      </p>
      <form onSubmit={submeter} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Field label="Nome" id="nome" placeholder="Maria" value={nome} error={erros.nome} onChange={(e) => setNome(e.target.value)} />
          <Field
            label="Sobrenome"
            id="sobrenome"
            placeholder="Arrais"
            value={sobrenome}
            error={erros.sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
          <Field
            label="E-mail"
            id="email"
            type="email"
            placeholder="maria@exemplo.pt"
            value={email}
            error={erros.email}
            style={{ gridColumn: 'span 2' }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Palavra-passe"
            id="palavra-passe"
            type="password"
            placeholder="mínimo 8 caracteres"
            value={palavraPasse}
            error={erros.palavraPasse}
            onChange={(e) => setPalavraPasse(e.target.value)}
          />
          <Field
            label="Repetir"
            id="repetir"
            type="password"
            value={repetir}
            error={erros.repetir}
            onChange={(e) => setRepetir(e.target.value)}
          />
          <Field
            label="Código postal"
            id="codigo-postal"
            placeholder="2510-000"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
          />
          <Field label="Distrito" id="distrito" as="select" value={distrito} onChange={(e) => setDistrito(e.target.value)}>
            <option value="" disabled>
              Escolha o distrito
            </option>
            {DISTRITOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Field>
        </div>
        <RadioOption
          type="checkbox"
          square
          id="quer-carta"
          checked={querCarta}
          onChange={() => setQuerCarta(!querCarta)}
          label={<span style={{ fontSize: 13 }}>Quero a carta do ateliê — uma vez por mês, com as peças novas.</span>}
          style={{ marginTop: 'var(--space-4)' }}
        />
        {erroEnvio && (
          <p role="alert" style={{ color: 'var(--color-accent-800)', fontSize: 14, marginTop: 'var(--space-3)' }}>
            {erroEnvio}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          block
          style={{ fontSize: 15, padding: 13, marginTop: 'var(--space-4)' }}
          disabled={aEnviar}
        >
          Criar conta
        </Button>
      </form>
      <p style={{ fontSize: 14, marginTop: 'var(--space-4)' }}>
        Já tem conta? <Link to="/entrar" state={location.state}>Entrar</Link>
      </p>
    </div>
  );
}
