// formulário de login, POST /api/auth/login
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import type { ErroApi } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { comoPapel } from '../lib/papel';
import { Field } from '../components/ui/Field';
import { RadioOption } from '../components/ui/RadioOption';
import { Button } from '../components/ui/Button';

interface ErrosLogin {
  email?: string;
  palavraPasse?: string;
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [manterSessao, setManterSessao] = useState(false);
  const [erros, setErros] = useState<ErrosLogin>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { entrar } = useAuth();
  const destino = (location.state as { from?: string } | null)?.from ?? '/';

  async function submeter(e: FormEvent) {
    e.preventDefault();
    const proximosErros: ErrosLogin = {};
    if (!email.trim()) proximosErros.email = 'Indique o e-mail.';
    if (!palavraPasse) proximosErros.palavraPasse = 'Indique a palavra-passe.';
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    setAEnviar(true);
    setErroEnvio(null);
    try {
      const resposta = await login({ email, palavraPasse });
      entrar({ ...resposta, role: comoPapel(resposta.role) }, manterSessao);
      navigate(destino, { replace: true });
    } catch (erro) {
      const erroApi = erro as ErroApi;
      setErroEnvio(erroApi.error ?? 'Não foi possível entrar. Tente novamente.');
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, marginTop: 'var(--space-6)' }}>
      <h1 style={{ fontSize: 44, margin: '0 0 var(--space-2)', letterSpacing: '-0.02em' }}>Entrar</h1>
      <p style={{ color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>
        Para ver encomendas antigas e guardar moradas.
      </p>
      <form
        onSubmit={submeter}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}
      >
        <Field
          label="E-mail"
          id="email"
          type="email"
          placeholder="maria@exemplo.pt"
          value={email}
          error={erros.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Palavra-passe"
          id="palavra-passe"
          type="password"
          placeholder="••••••••"
          value={palavraPasse}
          error={erros.palavraPasse}
          onChange={(e) => setPalavraPasse(e.target.value)}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <RadioOption
            type="checkbox"
            square
            id="manter-sessao"
            checked={manterSessao}
            onChange={() => setManterSessao(!manterSessao)}
            label={<span style={{ fontSize: 13 }}>Manter sessão</span>}
          />
          <Link to="/entrar" style={{ fontSize: 13, marginLeft: 'auto' }}>
            Esqueci-me
          </Link>
        </div>
        {erroEnvio && (
          <p role="alert" style={{ color: 'var(--color-accent-800)', fontSize: 14 }}>
            {erroEnvio}
          </p>
        )}
        <Button type="submit" variant="primary" block style={{ fontSize: 15, padding: 13 }} disabled={aEnviar}>
          Entrar
        </Button>
      </form>
      <p style={{ fontSize: 14, marginTop: 'var(--space-4)' }}>
        Ainda não tem conta? <Link to="/registo" state={location.state}>Criar conta</Link>
      </p>
    </div>
  );
}
