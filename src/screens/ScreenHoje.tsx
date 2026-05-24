import { useState } from 'react';
import { CheckCircle, AlertCircle, Sun, Pencil, Trash2 } from 'lucide-react';
import type { Task, PendingTask, Priority, Screen } from '../types';
import { EggHero } from '../components/EggHero';
import { TaskForm } from '../components/TaskForm';
import { getDateLabel } from '../lib/storage';

interface Props {
  userName: string;
  tasks: Task[];
  pendingTasks: PendingTask[];
  userWeekNumber: number;
  startDate: string;
  onAddTask: (f: { name: string; who: string; date: string; priority: Priority }) => void;
  onToggleTask: (id: string) => void;
  onEditTask: (id: string, f: Partial<Pick<Task, 'name' | 'who' | 'date' | 'priority'>>) => void;
  onDeleteTask: (id: string) => void;
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onReviewAll: () => void;
  onNavigate: (s: Screen) => void;
}

const PRIORITY_COLOR: Record<string, string> = { alta: '#ef4444', media: '#f59e0b', baixa: '#22c55e' };
const PRIORITY_LABEL: Record<string, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function ScreenHoje({ userName, tasks, pendingTasks, userWeekNumber, startDate, onAddTask, onToggleTask, onEditTask, onDeleteTask, onComplete, onDismiss, onReviewAll, onNavigate }: Props) {
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const todayStr = new Date().toLocaleDateString('en-CA');
  const doneTasks = tasks.filter(t => t.done);
  const openTasks = tasks.filter(t => !t.done);
  const todayTasks = tasks.filter(t => !t.done && t.date === todayStr);
  const isEmpty   = tasks.length === 0;
  const pendingCount = pendingTasks.length;

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const order = { alta: 0, media: 1, baixa: 2 };
    return order[a.priority] - order[b.priority];
  });

  function handleAdd(f: { name: string; who: string; date: string; priority: Priority }) {
    onAddTask(f);
    setShowForm(false);
  }

  function handleToggle(id: string) {
    setCompleting(id);
    setTimeout(() => { onToggleTask(id); setCompleting(null); }, 400);
  }

  function handleDelete(id: string) {
    setDeleteId(null);
    onDeleteTask(id);
  }

  return (
    <>
      {/* Saudação */}
      <div className="fade-up" style={{ padding: '20px 20px 10px' }}>
        <h1 className="font-serif" style={{ fontSize: 22, fontWeight: 400, color: 'var(--fg)', lineHeight: 1.2 }}>
          {getGreeting()}{userName ? `, ${userName}` : ''} 🌿
        </h1>
        <p style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 3 }}>Clareza hoje, leveza sempre.</p>
      </div>

      {/* Hero */}
      <div style={{ paddingBottom: 16 }}>
        <EggHero doneCount={doneTasks.length} userWeekNumber={userWeekNumber} startDate={startDate} onNavigate={onNavigate} />
      </div>

      {/* Botão Nova tarefa — destaque visual */}
      <div style={{ padding: '0 20px 10px' }}>
        {showForm ? (
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--r-xl)', padding: 16 }}>
            <TaskForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} style={{
            width: '100%', background: 'rgba(93,232,160,0.1)',
            border: '1px solid rgba(93,232,160,0.3)',
            borderRadius: 'var(--r-xl)', padding: '14px 18px',
            color: 'var(--primary)', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'inherit', transition: 'all .2s',
          }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
            Nova tarefa
          </button>
        )}
      </div>

      {/* Stats — menores e mais discretos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, padding: '6px 20px 16px' }}>
        {[
          { value: doneTasks.length, label: 'Concluídas', icon: <CheckCircle size={13} color="var(--primary)" strokeWidth={2.5} /> },
          { value: pendingCount,     label: 'Pendências', icon: <AlertCircle size={13} color="#f59e0b" strokeWidth={2} /> },
          { value: todayTasks.length, label: 'Para hoje',  icon: <Sun size={13} color="#60a5fa" strokeWidth={2} /> },
        ].map(({ value, label, icon }) => (
          <div key={label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '10px 10px' }}>
            <div className="font-serif" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 22, fontWeight: 400, color: 'var(--fg)', lineHeight: 1 }}>
              {value}{icon}
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg2)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {isEmpty && !showForm && (
        <div style={{ padding: '20px 20px 0', textAlign: 'center' }}>
          <p className="font-serif" style={{ fontSize: 17, fontWeight: 400, color: 'var(--fg2)', lineHeight: 1.65 }}>
            Sua semana começa aqui.
          </p>
          <p style={{ fontSize: 13, color: 'var(--fg3)', marginTop: 4 }}>Qual é a primeira tarefa?</p>
        </div>
      )}

      {/* Lista de tarefas */}
      {!isEmpty && (
        <div style={{ padding: '0 20px 24px' }}>
          <div className="section-label">Tarefas da semana</div>
          {sorted.map(task => (
            <div key={task.id}>
              {editingId === task.id ? (
                <div style={{ marginBottom: 8, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--r-lg)', padding: 14 }}>
                  <TaskForm initial={task}
                    onSave={f => { onEditTask(task.id, f); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                    submitLabel="Salvar"
                  />
                </div>
              ) : (
                <div style={{
                  marginBottom: 8,
                  background: task.done ? 'rgba(255,255,255,0.02)' : 'var(--bg3)',
                  border: `1px solid ${task.done ? 'rgba(255,255,255,0.04)' : 'var(--border)'}`,
                  borderRadius: 'var(--r-lg)', padding: '13px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all .3s',
                  opacity: completing === task.id ? 0.5 : 1,
                  transform: completing === task.id ? 'scale(0.98)' : 'scale(1)',
                }}>
                  {/* Barra lateral prioridade */}
                  <div style={{ width: 3, height: 36, borderRadius: 99, background: PRIORITY_COLOR[task.priority], flexShrink: 0 }} />

                  {/* Check */}
                  <button onClick={() => handleToggle(task.id)}
                    style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      border: task.done ? 'none' : '1.5px solid var(--border2)',
                      background: task.done ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all .3s',
                    }}>
                      {task.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                    </div>
                  </button>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, color: task.done ? 'var(--fg3)' : 'var(--fg)', textDecoration: task.done ? 'line-through' : 'none', transition: 'all .3s' }}>
                      {task.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      {task.who && <span>{task.who}</span>}
                      {task.who && task.date && <span style={{ color: 'var(--fg3)' }}>·</span>}
                      {task.date && <span>{getDateLabel(task.date)}</span>}
                      <span style={{ color: PRIORITY_COLOR[task.priority], fontSize: 11 }}>
                        {PRIORITY_LABEL[task.priority]}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  {!task.done && (
                    <button onClick={() => setEditingId(task.id)}
                      style={{ color: 'var(--fg3)', padding: 6, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  <button onClick={() => setDeleteId(task.id)}
                    style={{ color: 'var(--fg3)', padding: 6, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Seção de pendências inline */}
      {pendingCount > 0 && (
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="section-label" style={{ margin: 0 }}>
              <AlertCircle size={12} color="#f59e0b" style={{ display: 'inline', marginRight: 5 }} />
              Pendências anteriores
            </div>
            <button onClick={onReviewAll}
              style={{ fontSize: 11, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 0' }}
            >
              Trazer todas
            </button>
          </div>
          {pendingTasks.map(task => (
            <div key={task.id} style={{
              marginBottom: 8, background: 'rgba(251,191,36,0.03)',
              border: '1px solid rgba(251,191,36,0.15)',
              borderRadius: 'var(--r-lg)', padding: '11px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <button onClick={() => onComplete(task.id)}
                style={{ width: 24, height: 24, minHeight: 'unset', borderRadius: '50%', border: '1.5px solid rgba(251,191,36,0.4)', background: 'transparent', flexShrink: 0, cursor: 'pointer', padding: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: 'var(--fg2)' }}>{task.name}</div>
                {task.who && <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>{task.who}</div>}
              </div>
              <span style={{ fontSize: 11, color: 'var(--fg3)', flexShrink: 0 }}>De {task.fromDate}</span>
              <button onClick={() => onDismiss(task.id)}
                style={{ fontSize: 18, color: 'var(--fg3)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '0 2px' }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Modal confirmação delete */}
      {deleteId && (
        <div onClick={() => setDeleteId(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 'var(--r-3xl) var(--r-3xl) 0 0', width: '100%', maxWidth: 440, padding: '24px 24px 40px' }}
          >
            <div style={{ width: 32, height: 4, background: 'var(--border2)', borderRadius: 99, margin: '0 auto 20px' }} />
            <p className="font-serif" style={{ fontSize: 20, fontWeight: 400, color: 'var(--fg)', marginBottom: 8, textAlign: 'center' }}>Remover tarefa?</p>
            <p style={{ fontSize: 14, color: 'var(--fg3)', textAlign: 'center', marginBottom: 24 }}>Essa ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 14, color: 'var(--fg2)', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteId)}
                style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-lg)', padding: 14, color: '#ef4444', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
