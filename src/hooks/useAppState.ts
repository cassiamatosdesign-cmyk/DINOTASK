import { useState, useCallback, useEffect } from 'react';
import type { AppState, Task, Priority, Journey, PendingTask } from '../types';
import { loadState, saveState, todayISO, nanoid, getWeekId, getUserWeekNumber } from '../lib/storage';
import { getRarityForUserWeek, pickDinoImage } from '../lib/rarities';

function weekDateRange(startDate: string, weekNumber: number): string {
  const start = new Date(startDate);
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + (weekNumber - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `${fmt(weekStart)} – ${fmt(weekEnd)}`;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);
  useEffect(() => { saveState(state); }, [state]);

  const weekId = getWeekId(state.startDate);
  const userWeekNumber = getUserWeekNumber(state.startDate);
  const weekTasks = state.tasks.filter(t => t.weekId === weekId);
  const doneTasks = weekTasks.filter(t => t.done);

  const addTask = useCallback((f: { name: string; who: string; date: string; priority: Priority }) => {
    setState(p => ({ ...p, tasks: [...p.tasks, { ...f, id: nanoid(), done: false, createdAt: Date.now(), weekId: getWeekId(p.startDate) }] }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState(p => ({ ...p, tasks: p.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }));
  }, []);

  const editTask = useCallback((id: string, f: Partial<Pick<Task, 'name' | 'who' | 'date' | 'priority'>>) => {
    setState(p => ({ ...p, tasks: p.tasks.map(t => t.id === id ? { ...t, ...f } : t) }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(p => ({ ...p, tasks: p.tasks.filter(t => t.id !== id) }));
  }, []);

  const completePending = useCallback((id: string) => {
    setState(p => {
      const pending = p.pendingTasks.find(t => t.id === id);
      if (!pending) return p;
      return { ...p, pendingTasks: p.pendingTasks.filter(t => t.id !== id), tasks: [...p.tasks, { id: nanoid(), name: pending.name, who: pending.who, date: todayISO(), priority: pending.priority, done: false, createdAt: Date.now(), weekId: getWeekId(p.startDate) }] };
    });
  }, []);

  const dismissPending = useCallback((id: string) => {
    setState(p => ({ ...p, pendingTasks: p.pendingTasks.filter(t => t.id !== id) }));
  }, []);

  const reviewAllPending = useCallback(() => {
    setState(p => ({ ...p, pendingTasks: [], tasks: [...p.tasks, ...p.pendingTasks.map(pt => ({ id: nanoid(), name: pt.name, who: pt.who, date: todayISO(), priority: pt.priority, done: false, createdAt: Date.now(), weekId: getWeekId(p.startDate) }))] }));
  }, []);

  const setUserName = useCallback((name: string) => {
    const today = todayISO();
    setState(p => ({ ...p, userName: name, onboarded: true, startDate: today, currentWeekId: getWeekId(today) }));
  }, []);

  const deleteJourney = useCallback((id: string) => {
    setState(p => ({ ...p, journeys: p.journeys.filter(j => j.id !== id) }));
  }, []);

  const deleteAllJourneys = useCallback(() => {
    setState(p => ({ ...p, journeys: [] }));
  }, []);

  // Move tarefas com data anterior a hoje para pendências automaticamente
  // Roda sempre que tasks mudam — o guard "overdue.length === 0" evita loop infinito
  useEffect(() => {
    const today = todayISO();
    setState(p => {
      const overdue = p.tasks.filter(t => !t.done && t.date && t.date < today);
      if (overdue.length === 0) return p;
      const overdueIds = new Set(overdue.map(t => t.id));
      const existingPendingIds = new Set(p.pendingTasks.map(pt => pt.id));
      const newPending: PendingTask[] = overdue
        .filter(t => !existingPendingIds.has(t.id))
        .map(t => ({ id: t.id, name: t.name, who: t.who, fromDate: t.date, priority: t.priority }));
      return {
        ...p,
        tasks: p.tasks.filter(t => !overdueIds.has(t.id)),
        pendingTasks: [...p.pendingTasks, ...newPending],
      };
    });
  }, [state.tasks]); // reavalia sempre que a lista de tarefas muda

  useEffect(() => {
    if (doneTasks.length < 10) return;
    setState(p => {
      const alreadyRegistered = p.journeys.some(j => j.weekNumber === userWeekNumber);
      if (alreadyRegistered) return p;
      const rarity = getRarityForUserWeek(userWeekNumber);
      const weekDone = p.tasks.filter(t => t.weekId === getWeekId(p.startDate) && t.done);
      const newJourney: Journey = {
        id: nanoid(),
        weekLabel: `Semana ${userWeekNumber}`,
        weekNumber: userWeekNumber,
        dateRange: weekDateRange(p.startDate, userWeekNumber),
        rarity: rarity.id,
        dinoImagePath: pickDinoImage(rarity.id),
        status: 'nasceu',
        tasksCompleted: weekDone.length,
        completedTasks: weekDone,
      };
      return { ...p, journeys: [...p.journeys, newJourney] };
    });
  }, [doneTasks.length, userWeekNumber]);

  return { state, weekTasks, doneTasks, userWeekNumber, addTask, toggleTask, editTask, deleteTask, completePending, dismissPending, reviewAllPending, setUserName, deleteJourney, deleteAllJourneys };
}
