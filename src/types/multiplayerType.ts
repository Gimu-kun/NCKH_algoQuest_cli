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
export type PlayerPresence = 'ACTIVE' | 'DISCONNECTED' | 'LEFT' | 'SPECTATOR';
export type TelemetryEventType =
  | 'join'
  | 'leave'
  | 'submit'
  | 'finish'
  | 'reconnect'
  | 'desync'
  | 'spam_block'
  | 'queue_timeout'
  | 'queue_match_found'
  | 'penalty';

export interface MultiplayerPlayer {
  id: string;
  name: string;
  ready: boolean;
  score: number;
  role: CoopRole;
  team: 'A' | 'B';
  presence: PlayerPresence;
  rankMMR: number;
  ping: number;
  lastActionAt: number;
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
  matchStartedAt: number | null;
  submittedPlayerIds: string[];
  lastActionSeq: number;
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

export interface PlayerRankProfile {
  playerId: string;
  playerName: string;
  mmr: number;
  elo: number;
  placementsPlayed: number;
  placementsTotal: number;
  seasonId: string;
  xp: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  abandonCount: number;
  rewards: string[];
  history: MatchHistoryEntry[];
}

export interface MatchHistoryEntry {
  at: number;
  roomCode: string;
  mode: MultiplayerMode;
  win: boolean;
  deltaMMR: number;
  deltaElo: number;
  durationMs: number;
  abandoned: boolean;
}

export interface QueueTicket {
  ticketId: string;
  playerId: string;
  playerName: string;
  targetMode: MultiplayerMode;
  maxPing: number;
  rankBucket: number;
  partyId: string | null;
  queuedAt: number;
  timeoutAt: number;
}

export interface PartyInfo {
  partyId: string;
  leaderId: string;
  members: Array<{ id: string; name: string }>;
  invites: string[];
  createdAt: number;
}

export interface TelemetryEvent {
  eventType: TelemetryEventType;
  at: number;
  roomCode: string | null;
  playerId: string;
  payload: Record<string, unknown>;
}

export interface RealtimeMetrics {
  abandonRate: number;
  averageMatchDurationMs: number;
  desyncCount: number;
  reconnectCount: number;
}

export interface MatchSummary {
  roomCode: string;
  mode: MultiplayerMode;
  resultText: string;
  xpGained: number;
  deltaMMR: number;
  deltaElo: number;
  reward: string | null;
}
