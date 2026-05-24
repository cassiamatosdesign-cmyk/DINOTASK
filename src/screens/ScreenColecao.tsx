import { useState } from 'react';
import { RARITIES, getRarityById } from '../lib/rarities';
import type { Journey, Rarity, Screen } from '../types';

// Card de costas — exibido quando o dino ainda não foi conquistado
function CardBack() {
  return (
    <img
      src="/collection/card-back.png"
      alt="Card bloqueado"
      style={{ width: '100%', display: 'block', objectFit: 'cover', borderRadius: 'var(--r-2xl)' }}
    />
  );
}

interface Props {
  journeys: Journey[];
  onNavigate: (s: Screen) => void;
}

export function ScreenColecao({ journeys, onNavigate }: Props) {
  const [selected, setSelected] = useState<Rarity | null>(null);
  const [sharing, setSharing] = useState<Journey | null>(null);
  const [copied, setCopied]   = useState(false);

  // Jornadas conquistadas por raridade
  const byRarity = (rarityId: string) => journeys.filter(j => j.rarity === rarityId);

  // Compartilhar card
  function shareCard(journey: Journey) {
    const rarity = getRarityById(journey.rarity);
    const msg = `Meu dino ${rarity.dinoName} nasceu! 🦕\n\nEsta semana completei ${journey.tasksCompleted} tarefas.\n\n"${rarity.whisper}"\n\nOrganize sua semana com leveza:\n→ https://dinotask-eta.vercel.app`;
    if (navigator.share) {
      navigator.share({ text: msg }).catch(() => copyText(msg));
    } else {
      copyText(msg);
    }
  }

  function copyText(text: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); }).catch(() => fallback(text));
    } else fallback(text);
  }

  function fallback(text: string) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 3000); } catch {}
    document.body.removeChild(ta);
  }

  // Tela detalhe de uma raridade
  if (selected) {
    const earned = byRarity(selected.id);
    const hasAny = earned.length > 0;
    return (
      <>
        <button onClick={() => setSelected(null)}
          style={{ margin: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg3)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minHeight: 'unset' }}
        >
          ← Voltar
        </button>

        {/* Header da coleção */}
        <div style={{ padding: '16px 20px 20px', textAlign: 'center' }}>
          <img src={selected.coverImage} alt={selected.label}
            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 'var(--r-xl)', marginBottom: 12, filter: hasAny ? `drop-shadow(0 0 16px ${selected.glowColor})` : 'grayscale(0.8) brightness(0.6)' }}
          />
          <h2 className="font-serif" style={{ fontSize: 24, fontWeight: 400, color: 'var(--fg)', marginBottom: 4 }}>{selected.label}</h2>
          <p style={{ fontSize: 13, color: 'var(--fg3)', marginBottom: 4 }}>{selected.meaning}</p>
          <p style={{ fontSize: 12, color: 'var(--fg3)' }}>{earned.length} {earned.length === 1 ? 'dino conquistado' : 'dinos conquistados'}</p>
        </div>

        {/* Card do dino */}
        <div style={{ padding: '0 16px 24px' }}>
          {hasAny ? (
            earned.length === 1 ? (
              /* 1 card → largura total */
              <div className="fade-up">
                <div style={{ borderRadius: 'var(--r-2xl)', overflow: 'hidden', border: `1px solid ${selected.glowColor}`, boxShadow: `0 0 28px ${selected.glowColor}` }}>
                  <img src={selected.cardImage} alt={selected.dinoName} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--fg2)' }}>Semana {earned[0].weekNumber} · {earned[0].tasksCompleted} tarefas</div>
                    <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{earned[0].dateRange}</div>
                  </div>
                  <button onClick={() => { setSharing(earned[0]); setCopied(false); }}
                    style={{ background: selected.bg, border: `1px solid ${selected.glowColor}`, borderRadius: 'var(--r-full)', padding: '8px 16px', color: selected.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minHeight: 'unset' }}
                  >↑ Compartilhar</button>
                </div>
              </div>
            ) : (
              /* 2+ cards → grid 2 colunas; último ímpar fica centralizado */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {earned.map((journey, i) => {
                  const isLastOdd = earned.length % 2 === 1 && i === earned.length - 1;
                  return (
                    <div key={journey.id} className="fade-up"
                      style={{ animationDelay: `${i * 0.07}s`, gridColumn: isLastOdd ? '1 / -1' : 'auto', maxWidth: isLastOdd ? 200 : 'none', margin: isLastOdd ? '0 auto' : 0, width: '100%' }}
                    >
                      <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: `1px solid ${selected.glowColor}`, boxShadow: `0 0 12px ${selected.glowColor}` }}>
                        <img src={selected.cardImage} alt={selected.dinoName} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                      </div>
                      <div style={{ marginTop: 6, padding: '0 2px' }}>
                        <div style={{ fontSize: 11, color: 'var(--fg2)' }}>Sem. {journey.weekNumber} · {journey.tasksCompleted} tarefas</div>
                        <button onClick={() => { setSharing(journey); setCopied(false); }}
                          style={{ marginTop: 6, width: '100%', background: selected.bg, border: `1px solid ${selected.glowColor}`, borderRadius: 'var(--r-lg)', padding: '6px 0', color: selected.color, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minHeight: 'unset' }}
                        >↑ Compartilhar</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Não conquistado → card de costas */
            <div style={{ textAlign: 'center' }}>
              <div style={{ maxWidth: 280, margin: '0 auto 20px' }}>
                <CardBack />
              </div>
              <p className="font-serif" style={{ fontSize: 16, color: 'var(--fg3)', fontStyle: 'italic', lineHeight: 1.7 }}>
                "{selected.whisper}"
              </p>
              <p style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 8 }}>
                Complete 10 tarefas em uma semana {selected.label.toLowerCase()} para desbloquear.
              </p>
            </div>
          )}
        </div>

        {/* Modal compartilhar */}
        {sharing && (
          <div onClick={() => setSharing(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,20,0.88)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          >
            <div onClick={e => e.stopPropagation()} className="slide-up"
              style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r-3xl) var(--r-3xl) 0 0', width: '100%', maxWidth: 440, padding: '20px 20px 40px' }}
            >
              <div style={{ width: 32, height: 4, background: 'var(--border2)', borderRadius: 99, margin: '0 auto 20px' }} />
              <p className="font-serif" style={{ fontSize: 18, color: 'var(--fg)', textAlign: 'center', marginBottom: 16 }}>
                Compartilhar {selected.dinoName}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <button onClick={() => copyText(`Meu dino ${selected.dinoName} nasceu! 🦕\n\n"${selected.whisper}"\n\n→ https://dinotask-eta.vercel.app`)}
                  style={{ padding: 12, borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--bg3)', color: copied ? 'var(--primary)' : 'var(--fg2)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                >{copied ? '✓ Copiado!' : '📋 Copiar texto'}</button>
                <button onClick={() => shareCard(sharing)}
                  style={{ padding: 12, borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--fg2)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
                >↑ Compartilhar</button>
              </div>
              <button onClick={() => setSharing(null)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--fg3)', fontSize: 13, cursor: 'pointer', padding: 8, fontFamily: 'inherit' }}
              >Cancelar</button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Tela principal — grid 2x2
  return (
    <>
      <h1 className="font-serif fade-up" style={{ padding: '28px 20px 4px', fontSize: 30, fontWeight: 400, color: 'var(--fg)' }}>
        Coleção
      </h1>
      <p className="fade-up delay-1" style={{ fontSize: 13, color: 'var(--fg3)', padding: '0 20px 4px' }}>
        Cada jornada guarda seres únicos que nascem da sua constância.
      </p>
      <p className="fade-up delay-2" style={{ fontSize: 11, color: 'var(--fg3)', padding: '0 20px 20px', opacity: 0.7 }}>
        Toque em um card para ver seus dinos
      </p>

      {/* Grid 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px 32px' }}>
        {RARITIES.map((rarity, i) => {
          const earned = byRarity(rarity.id);
          const hasAny = earned.length > 0;
          return (
            <button
              key={rarity.id}
              onClick={() => setSelected(rarity)}
              className="fade-up"
              style={{
                animationDelay: `${0.05 + i * 0.07}s`,
                background: 'none', border: 'none', padding: 0,
                cursor: 'pointer', borderRadius: 'var(--r-xl)',
                overflow: 'hidden', position: 'relative',
                minHeight: 'unset', textAlign: 'left',
              }}
            >
              {/* Imagem da capa */}
              <img
                src={rarity.coverImage}
                alt={rarity.label}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  display: 'block',
                  filter: hasAny ? 'none' : 'grayscale(0.7) brightness(0.5)',
                  transition: 'filter 0.4s ease',
                  borderRadius: 'var(--r-xl)',
                  border: hasAny ? `2px solid ${rarity.glowColor}` : '2px solid var(--border)',
                  boxShadow: hasAny ? `0 0 16px ${rarity.glowColor}` : 'none',
                }}
              />

              {/* Badge de conquistas */}
              {hasAny && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--r-full)', padding: '3px 8px',
                  fontSize: 10, fontWeight: 700, color: rarity.color,
                  border: `1px solid ${rarity.glowColor}`,
                }}>
                  {earned.length}×
                </div>
              )}

              {/* Nome do dino */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(5,10,20,0.85) 0%, transparent 100%)',
                padding: '20px 10px 10px',
                borderRadius: '0 0 var(--r-xl) var(--r-xl)',
              }}>
                {hasAny ? (
                  <>
                    <div style={{ fontSize: 11, color: rarity.color, fontWeight: 600 }}>{rarity.dinoName}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{earned.length} conquistado{earned.length > 1 ? 's' : ''}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 400, letterSpacing: 1 }}>Bloqueado</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
