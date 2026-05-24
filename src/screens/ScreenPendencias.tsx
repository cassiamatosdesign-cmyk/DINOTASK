import type { PendingTask } from '../types';

interface Props {
  pendingTasks: PendingTask[];
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onReviewAll: () => void;
}

export function ScreenPendencias({
  pendingTasks,
  onComplete,
  onDismiss,
  onReviewAll,
}: Props) {
  return (
    <>
      <h1 className="font-serif fade-up" style={{ padding: '28px 20px 4px', fontSize: 32, fontWeight: 400, color: 'var(--fg)' }}>
        Pendências
      </h1>

      <div className="fade-up delay-1" style={{ padding: '4px 20px 20px' }}>
        <div className="font-serif" style={{ fontSize: 22, fontWeight: 400, color: 'var(--fg)', marginBottom: 4 }}>
          Pendências anteriores
        </div>
        <p style={{ fontSize: 13, color: 'var(--fg3)', lineHeight: 1.65 }}>
          Tarefas que você deixou para trás.<br />
          Sem pressão, apenas para lembrar.
        </p>
      </div>

      {/* Revisar todas */}
      {pendingTasks.length > 0 && (
        <button
          onClick={onReviewAll}
          className="fade-up delay-2"
          style={{
            margin: '0 20px 14px',
            width: 'calc(100% - 40px)',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: 15,
            textAlign: 'center',
            fontSize: 14,
            color: 'var(--fg2)',
            transition: 'background 0.2s',
          }}
        >
          Revisar todas
        </button>
      )}

      {/* List */}
      {pendingTasks.length === 0 ? (
        <div
          className="fade-up"
          style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--fg3)', fontSize: 14, lineHeight: 1.8 }}
        >
          Nenhuma pendência. Você está em dia! 🌿
        </div>
      ) : (
        pendingTasks.map((task, i) => (
          <div
            key={task.id}
            className="fade-up"
            style={{ animationDelay: `${0.08 + i * 0.05}s` }}
          >
            <div
              style={{
                margin: '0 20px 8px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Move to today */}
              <button
                onClick={() => onComplete(task.id)}
                title="Mover para hoje"
                style={{
                  width: 22, height: 22,
                  borderRadius: 'var(--r-full)',
                  border: '1.5px solid var(--border2)',
                  background: 'transparent',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: 'var(--fg)' }}>{task.name}</div>
                {task.who && (
                  <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{task.who}</div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: 'var(--fg3)' }}>De {task.fromDate}</span>
                <button
                  onClick={() => onDismiss(task.id)}
                  title="Dispensar"
                  style={{
                    fontSize: 18, color: 'var(--fg4)',
                    lineHeight: 1, cursor: 'pointer',
                    padding: '0 2px',
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Philosophical note */}
      <div
        className="fade-up"
        style={{
          margin: '8px 20px 24px',
          background: 'rgba(93,232,160,0.04)',
          border: '1px solid rgba(93,232,160,0.12)',
          borderRadius: 'var(--r-lg)',
          padding: 16,
          display: 'flex',
          gap: 12,
        }}
      >
        <svg style={{ flexShrink: 0, marginTop: 2 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.52-4.48 10-10 10z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
        <p style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.65 }}>
          Essas tarefas impactam o peso do seu ciclo.<br />
          Quanto mais leve, mais bonito seu dino nascerá.
        </p>
      </div>
    </>
  );
}
