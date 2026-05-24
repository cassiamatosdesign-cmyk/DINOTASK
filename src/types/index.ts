export type RarityId = 'comum' | 'raro' | 'epico' | 'lendario';
export type Priority = 'alta' | 'media' | 'baixa';
export type JourneyStatus = 'atual' | 'andamento' | 'nasceu';
export type Screen = 'onboarding' | 'hoje' | 'jornadas' | 'colecao' | 'pendencias';

export interface Rarity {
  id: RarityId;
  label: string;
  dinoName: string;
  threshold: number;
  whisper: string;
  meaning: string;
  dinoImage: string;
  cardImage: string;
  coverImage: string;
  color: string;
  glowColor: string;
  bg: string;
  weekNumber: number;
}

export interface Task {
  id: string;
  name: string;
  who: string;
  date: string;
  priority: Priority;
  done: boolean;
  createdAt: number;
  weekId: string;
}

export interface PendingTask {
  id: string;
  name: string;
  who: string;
  fromDate: string;
  priority: Priority;
}

export interface Journey {
  id: string;
  weekLabel: string;
  weekNumber: number;
  dateRange: string;
  rarity: RarityId;
  dinoImagePath: string;
  status: JourneyStatus;
  tasksCompleted: number;
  completedTasks: Task[];
}

export interface AppState {
  tasks: Task[];
  pendingTasks: PendingTask[];
  journeys: Journey[];
  userName: string;
  onboarded: boolean;
  currentWeekId: string;
  startDate: string;
}
