import type {
  CoopRole,
  MatchSummary,
  MultiplayerMode,
  MultiplayerPlayer,
  PartyInfo,
  PlayerRankProfile,
  QueueTicket,
  RealtimeMetrics,
  RoomState,
  TelemetryEvent,
} from '../types/multiplayerType';

type Listener = (state: RoomState | null) => void;
type ConnectionListener = (payload: { connected: boolean; ping: number }) => void;

const STORAGE_PREFIX = 'algoquest:mp:room:';
const PROFILE_PREFIX = 'algoquest:mp:profile:';
const TELEMETRY_KEY = 'algoquest:mp:telemetry';
const QUEUE_KEY = 'algoquest:mp:queue';
const PARTY_PREFIX = 'algoquest:mp:party:';
const DEFAULT_MODE: MultiplayerMode = 'DUEL_1V1';
const SUBMIT_RATE_LIMIT_MS = 400;
const DEFAULT_PLACEMENTS = 5;

interface QueueState {
  active: boolean;
  ticket: QueueTicket | null;
  timeoutAt: number | null;
}

interface QueueOptions {
  targetMode: MultiplayerMode;
  maxPing: number;
}

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
  private queueState: QueueState = { active: false, ticket: null, timeoutAt: null };
  private party: PartyInfo | null = null;
  private matchSummary: MatchSummary | null = null;

  private listeners = new Set<Listener>();
  private connectionListeners = new Set<ConnectionListener>();

  private channel: BroadcastChannel | null = null;
  private ws: WebSocket | null = null;

  private ping = 32;
  private pingTimer: number | null = null;
  private queueTimer: number | null = null;
  private lastSubmitAt = 0;
  private desyncCount = 0;
  private reconnectCount = 0;
  private hasSubmittedThisRound = false;

  setIdentity(name: string): void {
    this.playerName = name || 'Người Chơi';
    const profile = this.getRankProfile();
    this.persistProfile({ ...profile, playerName: this.playerName });
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

  getQueueState(): QueueState {
    return this.queueState;
  }

  getParty(): PartyInfo | null {
    return this.party;
  }

  getMatchSummary(): MatchSummary | null {
    return this.matchSummary;
  }

  getRecentTelemetry(limit = 20): TelemetryEvent[] {
    return this.loadTelemetry().slice(-limit).reverse();
  }

  getRealtimeMetrics(): RealtimeMetrics {
    const telemetry = this.loadTelemetry();
    const leaveEvents = telemetry.filter((e) => e.eventType === 'leave').length;
    const penaltyEvents = telemetry.filter((e) => e.eventType === 'penalty').length;
    const finishEvents = telemetry.filter((e) => e.eventType === 'finish');
    const durations = finishEvents
      .map((e) => Number(e.payload.durationMs || 0))
      .filter((v) => Number.isFinite(v) && v > 0);
    const averageMatchDurationMs =
      durations.length > 0 ? Math.round(durations.reduce((sum, v) => sum + v, 0) / durations.length) : 0;

    return {
      abandonRate: leaveEvents === 0 ? 0 : Number((penaltyEvents / leaveEvents).toFixed(2)),
      averageMatchDurationMs,
      desyncCount: this.desyncCount,
      reconnectCount: this.reconnectCount,
    };
  }

  getContractSnapshot(): Record<string, unknown> {
    return {
      roomState: this.roomState,
      queueState: this.queueState,
      party: this.party,
      profile: this.getRankProfile(),
    };
  }

  private emitState(): void {
    for (const l of this.listeners) l(this.roomState);
  }

  private emitConnection(connected: boolean): void {
    for (const l of this.connectionListeners) {
      l({ connected, ping: this.ping });
    }
  }

  private loadJson<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private saveJson(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private getProfileKey(): string {
    return `${PROFILE_PREFIX}${this.playerId}`;
  }

  getRankProfile(): PlayerRankProfile {
    const fallback: PlayerRankProfile = {
      playerId: this.playerId,
      playerName: this.playerName,
      mmr: 1200,
      elo: 1200,
      placementsPlayed: 0,
      placementsTotal: DEFAULT_PLACEMENTS,
      seasonId: 'S1',
      xp: 0,
      tier: 'Bronze',
      abandonCount: 0,
      rewards: [],
      history: [],
    };
    return this.loadJson(this.getProfileKey(), fallback);
  }

  private resolveTier(mmr: number): PlayerRankProfile['tier'] {
    if (mmr >= 1700) return 'Diamond';
    if (mmr >= 1500) return 'Platinum';
    if (mmr >= 1300) return 'Gold';
    if (mmr >= 1100) return 'Silver';
    return 'Bronze';
  }

  private persistProfile(profile: PlayerRankProfile): void {
    this.saveJson(this.getProfileKey(), {
      ...profile,
      tier: this.resolveTier(profile.mmr),
    });
  }

  private loadTelemetry(): TelemetryEvent[] {
    return this.loadJson<TelemetryEvent[]>(TELEMETRY_KEY, []);
  }

  private pushTelemetry(event: TelemetryEvent): void {
    const telemetry = this.loadTelemetry();
    const next = [...telemetry, event].slice(-200);
    this.saveJson(TELEMETRY_KEY, next);
  }

  private track(eventType: TelemetryEvent['eventType'], payload: Record<string, unknown> = {}): void {
    this.pushTelemetry({
      eventType,
      at: now(),
      roomCode: this.roomState?.roomCode ?? null,
      playerId: this.playerId,
      payload,
    });
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
      } else {
        this.desyncCount += 1;
        this.track('desync', { localUpdatedAt: this.roomState.updatedAt, incomingUpdatedAt: incoming.updatedAt });
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
            } else {
              this.desyncCount += 1;
              this.track('desync', { localUpdatedAt: this.roomState.updatedAt, incomingUpdatedAt: incoming.updatedAt });
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
    if (this.queueTimer) {
      window.clearTimeout(this.queueTimer);
      this.queueTimer = null;
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
    const profile = this.getRankProfile();
    const team = players.length % 2 === 0 ? 'A' : 'B';
    return [
      ...players,
      {
        id: this.playerId,
        name: this.playerName,
        ready: false,
        score: 0,
        role: 'GIAI_DO',
        team,
        presence: 'ACTIVE',
        rankMMR: profile.mmr,
        ping: this.ping,
        lastActionAt: now(),
      },
    ];
  }

  private getQueueTickets(): QueueTicket[] {
    return this.loadJson<QueueTicket[]>(QUEUE_KEY, []);
  }

  private persistQueueTickets(tickets: QueueTicket[]): void {
    this.saveJson(QUEUE_KEY, tickets);
  }

  joinQuickMatch(options: QueueOptions): QueueTicket {
    const profile = this.getRankProfile();
    const ticket: QueueTicket = {
      ticketId: randomId('q'),
      playerId: this.playerId,
      playerName: this.playerName,
      targetMode: options.targetMode,
      maxPing: options.maxPing,
      rankBucket: Math.floor(profile.mmr / 100),
      partyId: this.party?.partyId ?? null,
      queuedAt: now(),
      timeoutAt: now() + 15000,
    };

    const others = this.getQueueTickets().filter((t) => t.playerId !== this.playerId);
    const match = others.find(
      (t) => t.targetMode === options.targetMode && Math.abs(t.rankBucket - ticket.rankBucket) <= 2
    );

    if (match) {
      this.persistQueueTickets(others.filter((t) => t.ticketId !== match.ticketId));
      this.queueState = { active: false, ticket: null, timeoutAt: null };
      const room = this.createRoom(options.targetMode, 2);
      this.track('queue_match_found', { room, withTicket: match.ticketId, queueMs: now() - ticket.queuedAt });
      return ticket;
    }

    this.persistQueueTickets([...others, ticket]);
    this.queueState = { active: true, ticket, timeoutAt: ticket.timeoutAt };
    this.queueTimer = window.setTimeout(() => {
      if (!this.queueState.active || !this.queueState.ticket) return;
      this.track('queue_timeout', { ticketId: this.queueState.ticket.ticketId });
      this.cancelQuickMatch();
    }, 15000);

    return ticket;
  }

  cancelQuickMatch(): void {
    const tickets = this.getQueueTickets().filter((t) => t.playerId !== this.playerId);
    this.persistQueueTickets(tickets);
    this.queueState = { active: false, ticket: null, timeoutAt: null };
    if (this.queueTimer) {
      window.clearTimeout(this.queueTimer);
      this.queueTimer = null;
    }
  }

  createParty(): PartyInfo {
    const party: PartyInfo = {
      partyId: randomId('party'),
      leaderId: this.playerId,
      members: [{ id: this.playerId, name: this.playerName }],
      invites: [],
      createdAt: now(),
    };
    this.party = party;
    this.saveJson(`${PARTY_PREFIX}${party.partyId}`, party);
    return party;
  }

  inviteToParty(inviteeName: string): string {
    if (!this.party) this.createParty();
    if (!this.party) return '';
    if (this.party.members.length >= 3) return '';
    const inviteCode = `${this.party.partyId}:${inviteeName.toUpperCase()}`;
    const nextParty: PartyInfo = {
      ...this.party,
      invites: [...this.party.invites, inviteCode],
    };
    this.party = nextParty;
    this.saveJson(`${PARTY_PREFIX}${nextParty.partyId}`, nextParty);
    return inviteCode;
  }

  acceptPartyInvite(inviteCode: string): boolean {
    const [partyId] = inviteCode.split(':');
    if (!partyId) return false;
    const party = this.loadJson<PartyInfo | null>(`${PARTY_PREFIX}${partyId}`, null);
    if (!party || party.members.length >= 3 || !party.invites.includes(inviteCode)) return false;

    const nextParty: PartyInfo = {
      ...party,
      members: [...party.members, { id: this.playerId, name: this.playerName }],
      invites: party.invites.filter((i) => i !== inviteCode),
    };
    this.party = nextParty;
    this.saveJson(`${PARTY_PREFIX}${partyId}`, nextParty);
    return true;
  }

  createRoom(mode: MultiplayerMode, chapter: number): string {
    const roomCode = generateRoomCode();
    this.connectTransports(roomCode);
    const profile = this.getRankProfile();

    const state: RoomState = {
      roomCode,
      mode,
      chapter,
      phase: 'LOBBY',
      hostId: this.playerId,
      timerEndsAt: null,
      questionIndex: 0,
      resultText: '',
      matchStartedAt: null,
      submittedPlayerIds: [],
      lastActionSeq: 0,
      players: [
        {
          id: this.playerId,
          name: this.playerName,
          ready: false,
          score: 0,
          role: 'GIAI_DO',
          team: 'A',
          presence: 'ACTIVE',
          rankMMR: profile.mmr,
          ping: this.ping,
          lastActionAt: now(),
        },
      ],
      updatedAt: now(),
    };

    this.publish(state);
    this.track('join', { roomCode, mode, chapter });
    return roomCode;
  }

  joinRoom(roomCode: string): boolean {
    const normalized = roomCode.trim().toUpperCase();
    if (!normalized) return false;

    this.connectTransports(normalized);

    const existing = this.loadRoom(normalized);
    if (!existing) {
      const profile = this.getRankProfile();
      const state: RoomState = {
        roomCode: normalized,
        mode: DEFAULT_MODE,
        chapter: 2,
        phase: 'LOBBY',
        hostId: this.playerId,
        timerEndsAt: null,
        questionIndex: 0,
        resultText: '',
        matchStartedAt: null,
        submittedPlayerIds: [],
        lastActionSeq: 0,
        players: [
          {
            id: this.playerId,
            name: this.playerName,
            ready: false,
            score: 0,
            role: 'GIAI_DO',
            team: 'A',
            presence: 'ACTIVE',
            rankMMR: profile.mmr,
            ping: this.ping,
            lastActionAt: now(),
          },
        ],
        updatedAt: now(),
      };
      this.publish(state);
      this.track('join', { roomCode: normalized, created: true });
      return true;
    }

    const joinAsSpectator = existing.phase === 'MATCH';
    const players = this.ensurePlayer(existing.players).map((p) =>
      p.id === this.playerId
        ? {
            ...p,
            presence: joinAsSpectator ? ('SPECTATOR' as const) : ('ACTIVE' as const),
            ready: joinAsSpectator ? false : p.ready,
            lastActionAt: now(),
          }
        : p
    );

    this.publish({ ...existing, players });
    this.track('join', { roomCode: normalized, spectator: joinAsSpectator });
    return true;
  }

  leaveRoom(): void {
    if (this.roomState?.phase === 'MATCH') {
      const profile = this.getRankProfile();
      const penaltyProfile: PlayerRankProfile = {
        ...profile,
        mmr: Math.max(900, profile.mmr - 25),
        elo: Math.max(900, profile.elo - 20),
        abandonCount: profile.abandonCount + 1,
      };
      this.persistProfile(penaltyProfile);
      this.track('penalty', { reason: 'leave_in_match', mmrPenalty: 25, eloPenalty: 20 });
    }

    this.track('leave', { roomCode: this.roomCode || null, phase: this.roomState?.phase || null });
    this.disconnectTransports();
    this.roomState = null;
    this.roomCode = '';
    this.hasSubmittedThisRound = false;
    this.emitState();
  }

  reconnect(): void {
    if (!this.roomCode) return;
    this.emitConnection(false);
    this.reconnectCount += 1;
    this.track('reconnect', { roomCode: this.roomCode });
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
    const players = this.roomState.players.map((p) =>
      p.id === this.playerId ? { ...p, role, lastActionAt: now() } : p
    );
    this.publish({ ...this.roomState, players });
  }

  toggleReady(): void {
    if (!this.roomState) return;
    const players = this.roomState.players.map((p) =>
      p.id === this.playerId && p.presence !== 'SPECTATOR'
        ? { ...p, ready: !p.ready, lastActionAt: now() }
        : p
    );
    this.publish({ ...this.roomState, players });
  }

  canStart(): boolean {
    if (!this.roomState) return false;
    const activePlayers = this.roomState.players.filter((p) => p.presence === 'ACTIVE');
    return activePlayers.length >= 2 && activePlayers.every((p) => p.ready);
  }

  startMatch(): void {
    if (!this.roomState || !this.canStart()) return;
    this.hasSubmittedThisRound = false;
    this.publish({
      ...this.roomState,
      phase: 'MATCH',
      timerEndsAt: now() + 30000,
      resultText: '',
      matchStartedAt: now(),
      submittedPlayerIds: [],
    });
  }

  submitAnswer(isCorrect: boolean, timeLeft: number): boolean {
    if (!this.roomState || this.roomState.phase !== 'MATCH') return false;
    if (typeof isCorrect !== 'boolean' || !Number.isFinite(timeLeft) || timeLeft < 0 || timeLeft > 120) return false;

    const current = now();
    if (current - this.lastSubmitAt < SUBMIT_RATE_LIMIT_MS) {
      this.track('spam_block', { reason: 'rate_limit' });
      return false;
    }

    if (this.hasSubmittedThisRound || this.roomState.submittedPlayerIds.includes(this.playerId)) {
      this.track('spam_block', { reason: 'double_submit', questionIndex: this.roomState.questionIndex });
      return false;
    }

    this.lastSubmitAt = current;
    this.hasSubmittedThisRound = true;

    const delta = isCorrect
      ? this.roomState.mode === 'DUEL_1V1'
        ? 120 + timeLeft
        : this.roomState.mode === 'COOP_DUNGEON'
        ? 100
        : 100
      : 20;

    const players = this.roomState.players.map((p) =>
      p.id === this.playerId ? { ...p, score: p.score + delta, lastActionAt: now() } : p
    );

    this.publish({
      ...this.roomState,
      players,
      submittedPlayerIds: [...this.roomState.submittedPlayerIds, this.playerId],
      lastActionSeq: this.roomState.lastActionSeq + 1,
    });
    this.track('submit', { isCorrect, timeLeft, delta });
    return true;
  }

  finishRound(resultText: string): void {
    if (!this.roomState) return;
    const durationMs = this.roomState.matchStartedAt ? now() - this.roomState.matchStartedAt : 0;
    const me = this.roomState.players.find((p) => p.id === this.playerId);
    const myScore = me?.score ?? 0;
    const opponentScore = this.roomState.players
      .filter((p) => p.id !== this.playerId && p.presence !== 'SPECTATOR')
      .reduce((sum, p) => sum + p.score, 0);
    const win = myScore >= opponentScore;

    const profile = this.getRankProfile();
    const deltaMMR = win ? 24 : -18;
    const deltaElo = win ? 20 : -15;
    const placementsPlayed = Math.min(profile.placementsTotal, profile.placementsPlayed + 1);
    const nextProfile: PlayerRankProfile = {
      ...profile,
      placementsPlayed,
      mmr: Math.max(900, profile.mmr + deltaMMR),
      elo: Math.max(900, profile.elo + deltaElo),
      xp: profile.xp + (win ? 120 : 55),
      history: [
        ...profile.history,
        {
          at: now(),
          roomCode: this.roomState.roomCode,
          mode: this.roomState.mode,
          win,
          deltaMMR,
          deltaElo,
          durationMs,
          abandoned: false,
        },
      ].slice(-50),
      rewards: [...profile.rewards],
    };

    let reward: string | null = null;
    if (nextProfile.xp >= 500 && !nextProfile.rewards.includes('Milestone XP 500')) {
      reward = 'Milestone XP 500';
      nextProfile.rewards.push(reward);
    }

    this.persistProfile(nextProfile);
    this.matchSummary = {
      roomCode: this.roomState.roomCode,
      mode: this.roomState.mode,
      resultText,
      xpGained: win ? 120 : 55,
      deltaMMR,
      deltaElo,
      reward,
    };

    this.track('finish', { durationMs, win, deltaMMR, deltaElo, reward });
    this.publish({
      ...this.roomState,
      phase: 'RESULT',
      resultText,
      timerEndsAt: null,
      submittedPlayerIds: [],
      matchStartedAt: null,
    });
  }

  rematch(): void {
    if (!this.roomState) return;
    this.hasSubmittedThisRound = false;
    const players = this.roomState.players.map((p) => ({ ...p, ready: false }));
    this.publish({
      ...this.roomState,
      phase: 'MATCH',
      timerEndsAt: now() + 30000,
      questionIndex: this.roomState.questionIndex + 1,
      resultText: '',
      matchStartedAt: now(),
      submittedPlayerIds: [],
      players,
    });
  }
}

export const multiplayerRealtimeService = new MultiplayerRealtimeService();
