import { useState } from 'react';

interface Props {
  onLogin: (name: string) => void;
}

export function ScreenLogin({ onLogin }: Props) {
  const [name, setName] = useState('');

  function handleEnter() {
    if (name.trim()) onLogin(name.trim());
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100%', padding: '40px 28px',
    }}>
      {/* Ovo decorativo */}
      <img
        src="/eggs/estagio1.png"
        alt="ovo"
        style={{ width: 140, marginBottom: 32, animation: 'breath 6s ease-in-out infinite' }}
      />

      <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 400, color: 'var(--fg)', textAlign: 'center', marginBottom: 8 }}>
        Bem-vindo ao DinoTask
      </h1>
      <p style={{ fontSize: 14, color: 'var(--fg3)', textAlign: 'center', lineHeight: 1.6, marginBottom: 40 }}>
        Clareza hoje, leveza sempre.
      </p>

      <div style={{ width: '100%', maxWidth: 320 }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '1px', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 8 }}>
          Como posso te chamar?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
          placeholder="Seu nome"
          autoFocus
          style={{
            width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 'var(--r-lg)', padding: '14px 16px', color: 'var(--fg)',
            fontSize: 16, marginBottom: 16,
          }}
        />
        <button
          onClick={handleEnter}
          style={{
            width: '100%', background: 'var(--primary)', border: 'none',
            borderRadius: 'var(--r-lg)', padding: 16, color: 'var(--bg)',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            opacity: name.trim() ? 1 : 0.45, transition: 'opacity 0.2s',
          }}
        >
          Entrar
        </button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--fg4)', marginTop: 32, textAlign: 'center', lineHeight: 1.6 }}>
        Seus dados ficam salvos neste dispositivo.
      </p>
    </div>
  );
}
