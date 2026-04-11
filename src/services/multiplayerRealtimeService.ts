import type { CoopRole, MultiplayerMode, MultiplayerPlayer, RoomState } from '../types/multiplayerType';

type Listener = (state: RoomState | null) => void;
type ConnectionListener = (payload: { connected: boolean; ping: number }) => void;

const STORAGE_PREFIX = 'algoquest:mp:room:';
const DEFAULT_MODE: MultiplayerMode = 'DUEL_1V1';

function now(): number {
  return Date.now();
}

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

class MultiplayerRealtimeService {
  private playerId = randomId('p');
  private playerName = 'Người Chơi';
  private roomState: RoomState | null = null;
  private roomCode = '';

  private listeners = new Set<Listener>();
  private connectionListeners = new Set<ConnectionListener>();

  private channel: BroadcastChannel | null = null;
  private ws: WebSocket | null = null;

  private ping = 32;
  private pingTimer: number | null = null;

  setIdentity(name: string): void {
    this.playerName = name || 'Người Chơi';
  }

  getPlayerId(): string {
    return this.playerId;
  }

  getState(): RoomState | null {
    return this.roomState;
  }

  getPing(): number {
    return this.ping;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.roomState);
    return () => this.listeners.delete(listener);
  }

  subscribeConnection(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    listener({ connected: true, ping: this.ping });
    return () => this.connectionListeners.delete(listener);
  }

  private emitState(): void {
    for (const l of this.listeners) l(this.roomState);
  }

  private emitConnection(connected: boolean): void {
    for (const l of this.connectionListeners) {
      l({ connected, ping: this.ping });
    }
  }

  private persistRoom(state: RoomState): void {
    localStorage.setItem(`${STORAGE_PREFIX}${state.roomCode}`, JSON.stringify(state));
  }

  private loadRoom(roomCode: string): RoomState | null {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${roomCode}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as RoomState;
    } catch {
      return null;
    }
  }

  private connectTransports(roomCode: string): void {
    this.disconnectTransports();
    this.roomCode = roomCode;

    this.channel = new BroadcastChannel(`algoquest-room-${roomCode}`);
    this.channel.onmessage = (ev: MessageEvent<RoomState>) => {
      const incoming = ev.data;
      if (!incoming || !incoming.roomCode) return;
      if (!this.roomState || incoming.updatedAt >= this.roomState.updatedAt) {
        this.roomState = incoming;
        this.persistRoom(incoming);
        this.emitState();
      }
    };

    const wsUrl = import.meta.env.VITE_MULTIPLAYER_WS_URL as string | undefined;
    if (wsUrl) {
      try {
        this.ws = new WebSocket(`${wsUrl}?room=${roomCode}&playerId=${this.playerId}`);
        this.ws.onopen = () => this.emitConnection(true);
        this.ws.onclose = () => this.emitConnection(false);
        this.ws.onerror = () => this.emitConnection(false);
        this.ws.onmessage = (ev) => {
          try {
            const incoming = JSON.parse(ev.data) as RoomState;
            if (!this.roomState || incoming.updatedAt >= this.roomState.updatedAt) {
              this.roomState = incoming;
              this.persistRoom(incoming);
              this.emitState();
            }
          } catch {
            // Ignore malformed message
          }
        };
      } catch {
        this.ws = null;
      }
    }

    this.startPingSimulation();
  }

  private disconnectTransports(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.pingTimer) {
      window.clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private startPingSimulation(): void {
    if (this.pingTimer) window.clearInterval(this.pingTimer);
    this.pingTimer = window.setInterval(() => {
      this.ping = Math.max(18, Math.min(130, this.ping + (Math.random() > 0.5 ? 5 : -4)));
      this.emitConnection(true);
    }, 1500);
  }

  private publish(state: RoomState): void {
    this.roomState = { ...state, updatedAt: now() };
    this.persistRoom(this.roomState);
    this.emitState();

    if (this.channel) this.channel.postMessage(this.roomState);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(this.roomState));
    }
  }

  private ensurePlayer(players: MultiplayerPlayer[]): MultiplayerPlayer[] {
    if (players.some((p) => p.id === this.playerId)) return players;
    const team = players.length % 2 === 0 ? 'A' : 'B';
    return [...players, { id: this.playerId, name: this.playerName, ready: false, score: 0, role: 'GIAI_DO', team }];
  }

  createRoom(mode: MultiplayerMode, chapter: number): string {
    const roomCode = generateRoomCode();
    this.connectTransports(roomCode);

    const state: RoomState = {
      roomCode,
      mode,
      chapter,
      phase: 'LOBBY',
      hostId: this.playerId,
      timerEndsAt: null,
      questionIndex: 0,
      resultText: '',
      players: [
        {
          id: this.playerId,
          name: this.playerName,
          ready: false,
          score: 0,
          role: 'GIAI_DO',
          team: 'A',
        },
      ],
      updatedAt: now(),
    };

    this.publish(state);
    return roomCode;
  }

  joinRoom(roomCode: string): boolean {
    const normalized = roomCode.trim().toUpperCase();
    if (!normalized) return false;

    this.connectTransports(normalized);

    const existing = this.loadRoom(normalized);
    if (!existing) {
      const state: RoomState = {
        roomCode: normalized,
        mode: DEFAULT_MODE,
        chapter: 2,
        phase: 'LOBBY',
        hostId: this.playerId,
        timerEndsAt: null,
        questionIndex: 0,
        resultText: '',
        players: [
          { id: this.playerId, name: this.playerName, ready: false, score: 0, role: 'GIAI_DO', team: 'A' },
        ],
        updatedAt: now(),
      };
      this.publish(state);
      return true;
    }

    this.publish({ ...existing, players: this.ensurePlayer(existing.players) });
    return true;
  }

  leaveRoom(): void {
    this.disconnectTransports();
    this.roomState = null;
    this.roomCode = '';
    this.emitState();
  }

  reconnect(): void {
    if (!this.roomCode) return;
    this.emitConnection(false);
    setTimeout(() => {
      this.connectTransports(this.roomCode);
      this.emitConnection(true);
      if (this.roomState) this.emitState();
    }, 1000);
  }

  setMode(mode: MultiplayerMode): void {
    if (!this.roomState || this.roomState.phase !== 'LOBBY') return;
    this.publish({ ...this.roomState, mode });
  }

  setChapter(chapter: number): void {
    if (!this.roomState || this.roomState.phase !== 'LOBBY') return;
    this.publish({ ...this.roomState, chapter });
  }

  setRole(role: CoopRole): void {
    if (!this.roomState) return;
    const players = this.roomState.players.map((p) => (p.id === this.playerId ? { ...p, role } : p));
    this.publish({ ...this.roomState, players });
  }

  toggleReady(): void {
    if (!this.roomState) return;
    const players = this.roomState.players.map((p) =>
      p.id === this.playerId ? { ...p, ready: !p.ready } : p
    );
    this.publish({ ...this.roomState, players });
  }

  canStart(): boolean {
    if (!this.roomState) return false;
    return this.roomState.players.length >= 2 && this.roomState.players.every((p) => p.ready);
  }

  startMatch(): void {
    if (!this.roomState || !this.canStart()) return;
    this.publish({
      ...this.roomState,
      phase: 'MATCH',
      timerEndsAt: now() + 30000,
      resultText: '',
    });
  }

  submitAnswer(isCorrect: boolean, timeLeft: number): void {
    if (!this.roomState || this.roomState.phase !== 'MATCH') return;

    const delta = isCorrect
      ? this.roomState.mode === 'DUEL_1V1'
        ? 120 + timeLeft
        : this.roomState.mode === 'COOP_DUNGEON'
        ? 100
        : 100
      : 20;

    const players = this.roomState.players.map((p) =>
      p.id === this.playerId ? { ...p, score: p.score + delta } : p
    );

    this.publish({ ...this.roomState, players });
  }

  finishRound(resultText: string): void {
    if (!this.roomState) return;
    this.publish({ ...this.roomState, phase: 'RESULT', resultText, timerEndsAt: null });
  }

  rematch(): void {
    if (!this.roomState) return;
    const players = this.roomState.players.map((p) => ({ ...p, ready: false }));
    this.publish({
      ...this.roomState,
      phase: 'MATCH',
      timerEndsAt: now() + 30000,
      questionIndex: this.roomState.questionIndex + 1,
      resultText: '',
      players,
    });
  }
}

export const multiplayerRealtimeService = new MultiplayerRealtimeService();
