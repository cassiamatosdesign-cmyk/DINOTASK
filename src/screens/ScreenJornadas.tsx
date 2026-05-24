import { useState } from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import type { Journey, Screen } from '../types';
import { getRarityById, getRarityForUserWeek } from '../lib/rarities';
import { RarityBadge } from '../components/RarityBadge';

interface Props {
  journeys: Journey[];
  onNavigate: (s: Screen) => void;
  userWeekNumber: number;
  doneCount: number;
  startDate: string;
  onDeleteJourney: (id: string) => void;
  onDeleteAllJourneys: () => void;
}

const PRIORITY_COLOR: Record<string, string> = { alta: '#ef4444', media: '#f59e0b', baixa: '#22c55e' };

export function ScreenJornadas({ journeys, onNavigate, userWeekNumber, doneCount, startDate, onDeleteJourney, onDeleteAllJourneys }: Props) {
  const [selected, setSelected] = useState<Journey | null>(null);
  const [deleteJourneyId, setDeleteJourneyId] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const currentRarity = getRarityForUserWeek(userWeekNumber);
  const currentAlreadySaved = journeys.some(j => j.weekNumber === userWeekNumber);
  const sorted = [...journeys].sort((a, b) => a.weekNumber - b.weekNumber);

  // Detalhe de jornada selecionada
  if (selected) {
    const rarity = getRarityById(selected.rarity);
    const dinoSrc = (selected as any).dinoImagePath ?? rarity.dinoImage;
    return (
      <>
        <button onClick={() => setSelected(null)}
          style={{ margin: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg3)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minHeight: 'unset' }}
        >
          ← Voltar
        </button>
        <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={dinoSrc} alt={rarity.label}
            style={{ width: 80, height: 80, objectFit: 'contain', filter: `drop-shadow(0 0 12px ${rarity.glowColor})` }} />
          <div>
            <h2 className="font-serif" style={{ fontSize: 22, fontWeight: 400, color: 'var(--fg)', marginBottom: 4 }}>{selected.weekLabel}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RarityBadge rarityId={rarity.id} label={rarity.label} size="sm" />
              <span style={{ fontSize: 11, color: 'var(--fg3)' }}>{selected.dateRange}</span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--fg3)', padding: '0 20px 16px' }}>{selected.tasksCompleted} tarefas concluídas neste ciclo.</p>
        <div className="section-label">Tarefas do ciclo</div>
        {selected.completedTasks.length === 0 ? (
          <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--fg3)', fontSize: 14 }}>Nenhuma tarefa registrada.</div>
        ) : selected.completedTasks.map(t => (
          <div key={t.id} style={{ margin: '0 20px 8px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLOR[t.priority], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: 'var(--fg)', textDecoration: 'line-through', opacity: .65 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{t.who}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
        ))}

        {/* Botão excluir semana */}
        <div style={{ padding: '24px 20px' }}>
          <button onClick={() => setDeleteJourneyId(selected.id)}
            style={{ width: '100%', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r-lg)', padding: 14, color: '#ef4444', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Trash2 size={14} /> Excluir esta jornada
          </button>
        </div>

        {/* Modal confirmar excluir semana */}
        {deleteJourneyId && (
          <div onClick={() => setDeleteJourneyId(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,20,0.88)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          >
            <div onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r-3xl) var(--r-3xl) 0 0', width: '100%', maxWidth: 440, padding: '24px 24px 40px' }}
            >
              <div style={{ width: 32, height: 4, background: 'var(--border2)', borderRadius: 99, margin: '0 auto 20px' }} />
              <p className="font-serif" style={{ fontSize: 20, fontWeight: 400, color: 'var(--fg)', marginBottom: 8, textAlign: 'center' }}>Excluir esta jornada?</p>
              <p style={{ fontSize: 14, color: 'var(--fg3)', textAlign: 'center', marginBottom: 24 }}>Essa ação não pode ser desfeita.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDeleteJourneyId(null)}
                  style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 14, color: 'var(--fg2)', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
                >Cancelar</button>
                <button onClick={() => { onDeleteJourney(deleteJourneyId); setDeleteJourneyId(null); setSelected(null); }}
                  style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-lg)', padding: 14, color: '#ef4444', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >Excluir</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div style={{ padding: '28px 20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="font-serif fade-up" style={{ fontSize: 30, fontWeight: 400, color: 'var(--fg)' }}>Jornadas</h1>
        {journeys.length > 0 && (
          <button onClick={() => setConfirmDeleteAll(true)}
            style={{ color: 'var(--fg3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', minHeight: 'unset', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Trash2 size={13} /> Limpar histórico
          </button>
        )}
      </div>
      <p className="fade-up delay-1" style={{ fontSize: 13, color: 'var(--fg3)', padding: '0 20px 20px' }}>
        Aqui ficam registradas todas as suas semanas concluídas e as tarefas realizadas em cada uma.
      </p>

      {/* Semana atual em andamento */}
      {!currentAlreadySaved && (
        <div className="fade-up" style={{ margin: '0 20px 10px', background: 'rgba(93,232,160,0.04)', border: '1px solid rgba(93,232,160,0.22)', borderRadius: 'var(--r-xl)', padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={currentRarity.dinoImage} alt={currentRarity.label}
            style={{ width: 56, height: 56, objectFit: 'contain', flexShrink: 0, filter: `drop-shadow(0 0 8px ${currentRarity.glowColor})`, opacity: 0.6 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-serif" style={{ fontSize: 16, fontWeight: 400, color: 'var(--fg)', marginBottom: 4 }}>Semana {userWeekNumber}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
              <RarityBadge rarityId={currentRarity.id} label={currentRarity.label} size="sm" />
              <span style={{ fontSize: 11, color: 'var(--primary)' }}>Em andamento 🌱</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{doneCount} de 10 tarefas</div>
          </div>
        </div>
      )}

      {sorted.map((j, i) => {
        const rarity = getRarityById(j.rarity);
        const dinoSrc = (j as any).dinoImagePath ?? rarity.dinoImage;
        return (
          <div key={j.id} className="fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s`, margin: '0 20px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
            onClick={() => setSelected(j)}>
            <img src={dinoSrc} alt={rarity.label}
              style={{ width: 56, height: 56, objectFit: 'contain', flexShrink: 0, filter: `drop-shadow(0 0 8px ${rarity.glowColor})` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-serif" style={{ fontSize: 16, fontWeight: 400, color: 'var(--fg)', marginBottom: 4 }}>{j.weekLabel}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                <RarityBadge rarityId={rarity.id} label={rarity.label} size="sm" />
                <span style={{ fontSize: 11, color: 'var(--fg3)' }}>Nasceu ✦</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{j.tasksCompleted} tarefas · {j.dateRange}</div>
            </div>
            <ChevronRight size={14} color="var(--fg3)" style={{ flexShrink: 0 }} />
          </div>
        );
      })}

      {sorted.length === 0 && (
        <div style={{ padding: '16px 20px 32px', textAlign: 'center' }}>
          <p className="font-serif" style={{ fontSize: 15, color: 'var(--fg3)', fontStyle: 'italic', lineHeight: 1.7 }}>
            "Sua primeira jornada está em andamento."
          </p>
          <p style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 6 }}>Complete 10 tarefas para o dino nascer.</p>
        </div>
      )}

      <div style={{ padding: '8px 20px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--fg3)', lineHeight: 1.8 }}>
          Feito com 🌿 por Cássia Renk ·{' '}
          <a href="https://instagram.com/uxcassia" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--fg3)', textDecoration: 'none' }}>@uxcassia</a>
        </p>
      </div>

      {/* Modal confirmar excluir tudo */}
      {confirmDeleteAll && (
        <div onClick={() => setConfirmDeleteAll(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,20,0.88)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r-3xl) var(--r-3xl) 0 0', width: '100%', maxWidth: 440, padding: '24px 24px 40px' }}
          >
            <div style={{ width: 32, height: 4, background: 'var(--border2)', borderRadius: 99, margin: '0 auto 20px' }} />
            <p className="font-serif" style={{ fontSize: 20, fontWeight: 400, color: 'var(--fg)', marginBottom: 8, textAlign: 'center' }}>Limpar todo o histórico?</p>
            <p style={{ fontSize: 14, color: 'var(--fg3)', textAlign: 'center', marginBottom: 24 }}>Todas as jornadas serão removidas permanentemente.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDeleteAll(false)}
                style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 14, color: 'var(--fg2)', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
              >Cancelar</button>
              <button onClick={() => { onDeleteAllJourneys(); setConfirmDeleteAll(false); }}
                style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-lg)', padding: 14, color: '#ef4444', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >Limpar tudo</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
