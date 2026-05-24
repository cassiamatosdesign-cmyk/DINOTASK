import { useState } from 'react';
import type { Priority, Task } from '../types';
import { todayISO } from '../lib/storage';

interface Props {
  initial?: Partial<Task>;
  onSave: (fields: { name: string; who: string; date: string; priority: Priority }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'alta',  label: 'Alta',  color: '#ef4444' },
  { id: 'media', label: 'Média', color: '#f59e0b' },
  { id: 'baixa', label: 'Baixa', color: '#22c55e' },
];

const DATE_OPTIONS = [
  { label: 'Hoje',        getValue: () => { return new Date().toLocaleDateString('en-CA'); } },
  { label: 'Amanhã',      getValue: () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toLocaleDateString('en-CA'); } },
  { label: 'Esta semana', getValue: () => { const d = new Date(); d.setDate(d.getDate()+3); return d.toLocaleDateString('en-CA'); } },
  { label: 'Escolher',    getValue: () => '' },
];

export function TaskForm({ initial, onSave, onCancel, submitLabel = 'Adicionar' }: Props) {
  const [name,      setName]      = useState(initial?.name     ?? '');
  const [who,       setWho]       = useState(initial?.who      ?? '');
  const [date,      setDate]      = useState(initial?.date     ?? todayISO());
  const [priority,  setPriority]  = useState<Priority>(initial?.priority ?? 'media');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [selectedDateLabel, setSelectedDateLabel] = useState('Hoje');

  function handleDateOption(opt: typeof DATE_OPTIONS[0]) {
    setSelectedDateLabel(opt.label);
    if (opt.label === 'Escolher') {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
      setDate(opt.getValue());
    }
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), who: who.trim(), date, priority });
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10, padding: '11px 13px',
    color: 'var(--fg)', fontSize: 15, width: '100%',
    fontFamily: 'inherit',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: 'var(--fg3)', width: 58,
    flexShrink: 0, fontWeight: 600, letterSpacing: '0.3px',
  };

  return (
    <div>
      {/* O quê */}
      <div style={rowStyle}>
        <span style={labelStyle}>O quê?</span>
        <input autoFocus type="text" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Qual é a tarefa?"
          style={inputStyle}
        />
      </div>

      {/* Quem */}
      <div style={rowStyle}>
        <span style={labelStyle}>Quem?</span>
        <input type="text" value={who}
          onChange={e => setWho(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Quem vai fazer isso? (opcional)"
          style={inputStyle}
        />
      </div>

      {/* Quando — seletor simplificado */}
      <div style={{ ...rowStyle, flexWrap: 'wrap', gap: 8, borderBottom: 'none' }}>
        <span style={labelStyle}>Quando?</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {DATE_OPTIONS.map(opt => (
            <button key={opt.label} onClick={() => handleDateOption(opt)}
              style={{
                padding: '7px 12px', borderRadius: 99,
                border: '1px solid',
                borderColor: selectedDateLabel === opt.label ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
                background: selectedDateLabel === opt.label ? 'rgba(93,232,160,0.12)' : 'transparent',
                color: selectedDateLabel === opt.label ? 'var(--primary)' : 'var(--fg3)',
                fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all .15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data custom */}
      {showCustomDate && (
        <div style={{ padding: '8px 0' }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          />
        </div>
      )}

      {/* Prioridade */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 0', alignItems: 'center' }}>
        <span style={labelStyle}>Prioridade</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {PRIORITIES.map(p => (
            <button key={p.id} onClick={() => setPriority(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 12px', borderRadius: 99,
                border: `1px solid ${priority === p.id ? p.color : 'rgba(255,255,255,0.12)'}`,
                background: priority === p.id ? `${p.color}22` : 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                color: priority === p.id ? p.color : 'var(--fg3)',
                transition: 'all .15s',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {onCancel && (
          <button onClick={onCancel}
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 13, color: 'var(--fg3)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Cancelar
          </button>
        )}
        <button onClick={handleSave}
          style={{ flex: 2, background: 'var(--primary)', border: 'none', borderRadius: 12, padding: 13, color: 'var(--bg)', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: name.trim() ? 1 : 0.45, transition: 'opacity .2s', fontFamily: 'inherit' }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
