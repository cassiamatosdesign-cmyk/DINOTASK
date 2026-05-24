import { useState, useRef, TouchEvent } from 'react';
import { MobileShell }        from './components/MobileShell';
import { ScreenOnboarding }   from './screens/ScreenOnboarding';
import { ScreenHoje }         from './screens/ScreenHoje';
import { ScreenJornadas }     from './screens/ScreenJornadas';
import { ScreenColecao }      from './screens/ScreenColecao';
import { useAppState }        from './hooks/useAppState';
import type { Screen }        from './types';

const NAV_SCREENS: Screen[] = ['hoje', 'jornadas', 'colecao'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('hoje');
  const touchStartX = useRef<number>(0);

  const { state, weekTasks, doneTasks, userWeekNumber, addTask, toggleTask, editTask, deleteTask, completePending, dismissPending, reviewAllPending, setUserName, deleteJourney, deleteAllJourneys } = useAppState();

  if (!state.onboarded) {
    return (
      <div style={{ width: '100%', height: '100%', maxWidth: 440, margin: '0 auto' }}>
        <ScreenOnboarding onFinish={setUserName} />
      </div>
    );
  }

  const navScreen = (screen === 'pendencias' ? 'hoje' : screen) as 'hoje' | 'jornadas' | 'colecao';

  function navigate(s: Screen) {
    setScreen(s);
    setTimeout(() => { const m = document.querySelector('main'); if (m) m.scrollTop = 0; }, 10);
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 60) return;
    const idx = NAV_SCREENS.indexOf(navScreen);
    if (diff > 0 && idx < NAV_SCREENS.length - 1) navigate(NAV_SCREENS[idx + 1]);
    if (diff < 0 && idx > 0) navigate(NAV_SCREENS[idx - 1]);
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ width: '100%', height: '100%' }}>
      <MobileShell current={navScreen} onNavigate={s => navigate(s as Screen)}>
        {screen === 'hoje' && (
          <ScreenHoje
            userName={state.userName}
            tasks={weekTasks}
            pendingTasks={state.pendingTasks}
            userWeekNumber={userWeekNumber}
            startDate={state.startDate}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
            onComplete={completePending}
            onDismiss={dismissPending}
            onReviewAll={reviewAllPending}
            onNavigate={navigate}
          />
        )}
        {screen === 'jornadas' && (
          <ScreenJornadas
            journeys={state.journeys}
            onNavigate={navigate}
            userWeekNumber={userWeekNumber}
            doneCount={doneTasks.length}
            startDate={state.startDate}
            onDeleteJourney={deleteJourney}
            onDeleteAllJourneys={deleteAllJourneys}
          />
        )}
        {screen === 'colecao' && (
          <ScreenColecao
            journeys={state.journeys}
            onNavigate={navigate}
          />
        )}
      </MobileShell>
    </div>
  );
}
