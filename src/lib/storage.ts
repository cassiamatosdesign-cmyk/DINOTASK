import type { AppState } from '../types';

const KEY = 'dinotask_v4';

export function getWeekId(startDate: string): string {
  const start = new Date(startDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weekNum = Math.floor(diffDays / 7) + 1;
  return `user-week-${weekNum}`;
}

export function getUserWeekNumber(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}

export function getDaysRemainingInWeek(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const dayInWeek = diffDays % 7;
  return 7 - dayInWeek;
}

const DEFAULT: AppState = {
  tasks: [],
  pendingTasks: [],
  journeys: [],
  userName: '',
  onboarded: false,
  currentWeekId: 'user-week-1',
  startDate: new Date().toLocaleDateString('en-CA'),
};

export function loadState(): AppState {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return { ...DEFAULT, ...JSON.parse(r) };
  } catch { /* silent */ }
  return DEFAULT;
}

export function saveState(s: AppState): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* silent */ }
}

export function todayISO(): string { return new Date().toLocaleDateString('en-CA'); }
export function nanoid(): string { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }

export function formatDateDisplay(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function getDateLabel(iso: string): string {
  const today = todayISO();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toLocaleDateString('en-CA');
  if (iso === today) return 'Hoje';
  if (iso === tomorrowISO) return 'Amanhã';
  return formatDateDisplay(iso);
}
