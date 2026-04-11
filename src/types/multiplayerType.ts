export type MultiplayerMode =
  | 'DUEL_1V1'
  | 'COOP_DUNGEON'
  | 'TEAM_2V2'
  | 'CODE_DUEL_DRAFT'
  | 'RACE_TO_PATH'
  | 'BUG_HUNT_2V2'
  | 'TOWER_DEFENSE_COOP'
  | 'MEMORY_RELAY'
  | 'TOURNAMENT_8';
export type MatchPhase = 'LOBBY' | 'MATCH' | 'RESULT';
export type CoopRole = 'GIAI_DO' | 'CHIEN_DAU';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  ready: boolean;
  score: number;
  role: CoopRole;
  team: 'A' | 'B';
}

export interface RoomState {
  roomCode: string;
  mode: MultiplayerMode;
  chapter: number;
  phase: MatchPhase;
  hostId: string;
  timerEndsAt: number | null;
  questionIndex: number;
  resultText: string;
  players: MultiplayerPlayer[];
  updatedAt: number;
}

export interface QuizQuestion {
  id: string;
  chapter: number;
  prompt: string;
  options: string[];
  answerIndex: number;
}
