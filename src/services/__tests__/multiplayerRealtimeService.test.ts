import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

class MockBroadcastChannel {
  name: string;
  onmessage: ((ev: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(_data: unknown): void {
    // No-op for unit tests
  }

  close(): void {
    // No-op for unit tests
  }
}

beforeAll(() => {
  const g = globalThis as unknown as {
    window?: typeof globalThis;
    localStorage?: MemoryStorage;
    BroadcastChannel?: typeof MockBroadcastChannel;
  };

  g.window = globalThis;
  g.localStorage = new MemoryStorage();
  g.BroadcastChannel = MockBroadcastChannel;
});

beforeEach(async () => {
  vi.restoreAllMocks();
  vi.resetModules();
  localStorage.clear();
});

afterEach(async () => {
  const module = await import('../multiplayerRealtimeService');
  module.multiplayerRealtimeService.leaveRoom();
});

describe('multiplayerRealtimeService', () => {
  it('creates a room with host in LOBBY phase', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    service.setIdentity('Tester 1');
    const roomCode = service.createRoom('DUEL_1V1', 2);
    const state = service.getState();

    expect(roomCode).toHaveLength(6);
    expect(state).not.toBeNull();
    expect(state?.roomCode).toBe(roomCode);
    expect(state?.phase).toBe('LOBBY');
    expect(state?.players).toHaveLength(1);
    expect(state?.players[0].name).toBe('Tester 1');
    expect(state?.hostId).toBe(service.getPlayerId());
  });

  it('joinRoom creates default room when room does not exist', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    const ok = service.joinRoom('ab12cd');
    const state = service.getState();

    expect(ok).toBe(true);
    expect(state).not.toBeNull();
    expect(state?.roomCode).toBe('AB12CD');
    expect(state?.mode).toBe('DUEL_1V1');
    expect(state?.chapter).toBe(2);
    expect(state?.players).toHaveLength(1);
  });

  it('toggles ready flag for current player', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    service.createRoom('DUEL_1V1', 2);
    const initial = service.getState()?.players[0].ready;

    service.toggleReady();
    const next = service.getState()?.players[0].ready;

    expect(initial).toBe(false);
    expect(next).toBe(true);
  });

  it('starts match only when canStart is true', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    service.createRoom('DUEL_1V1', 2);
    service.startMatch();
    expect(service.getState()?.phase).toBe('LOBBY');

    const mutable = service as unknown as {
      getState: () => {
        roomCode: string;
        mode: string;
        chapter: number;
        phase: string;
        hostId: string;
        timerEndsAt: number | null;
        questionIndex: number;
        resultText: string;
        players: Array<{ id: string; name: string; ready: boolean; score: number; role: 'GIAI_DO' | 'CHIEN_DAU'; team: 'A' | 'B' }>;
        updatedAt: number;
      } | null;
      publish: (state: unknown) => void;
      getPlayerId: () => string;
    };

    const state = mutable.getState();
    if (!state) throw new Error('State should exist');

    mutable.publish({
      ...state,
      players: [
        ...state.players,
        {
          id: 'p_other',
          name: 'Other',
          ready: true,
          score: 0,
          role: 'GIAI_DO',
          team: 'B',
        },
      ].map((p) => (p.id === mutable.getPlayerId() ? { ...p, ready: true } : p)),
    });

    expect(service.canStart()).toBe(true);
    service.startMatch();
    expect(service.getState()?.phase).toBe('MATCH');
    expect(service.getState()?.timerEndsAt).not.toBeNull();
  });

  it('submitAnswer updates only in MATCH phase and rematch resets ready/question index', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    service.createRoom('DUEL_1V1', 2);
    const scoreBeforeMatch = service.getState()?.players[0].score ?? 0;

    service.submitAnswer(true, 20);
    expect(service.getState()?.players[0].score).toBe(scoreBeforeMatch);

    const mutable = service as unknown as {
      getState: () => {
        players: Array<{ id: string; ready: boolean; score: number; name: string; role: 'GIAI_DO' | 'CHIEN_DAU'; team: 'A' | 'B' }>;
        phase: 'LOBBY' | 'MATCH' | 'RESULT';
        questionIndex: number;
        timerEndsAt: number | null;
        resultText: string;
        roomCode: string;
        mode: 'DUEL_1V1' | 'COOP_DUNGEON' | 'TEAM_2V2' | 'CODE_DUEL_DRAFT' | 'RACE_TO_PATH' | 'BUG_HUNT_2V2' | 'TOWER_DEFENSE_COOP' | 'MEMORY_RELAY' | 'TOURNAMENT_8';
        chapter: number;
        hostId: string;
        updatedAt: number;
      } | null;
      publish: (state: unknown) => void;
      getPlayerId: () => string;
    };

    const state = mutable.getState();
    if (!state) throw new Error('State should exist');

    mutable.publish({
      ...state,
      phase: 'MATCH',
      players: state.players.map((p) => ({ ...p, ready: true })),
      timerEndsAt: Date.now() + 30000,
    });

    const before = service.getState()?.players[0].score ?? 0;
    service.submitAnswer(true, 10);
    const after = service.getState()?.players[0].score ?? 0;

    expect(after).toBeGreaterThan(before);

    const beforeQuestion = service.getState()?.questionIndex ?? 0;
    service.rematch();

    expect(service.getState()?.phase).toBe('MATCH');
    expect(service.getState()?.questionIndex).toBe(beforeQuestion + 1);
    expect(service.getState()?.players.every((p) => !p.ready)).toBe(true);
  });

  it('setMode and setChapter only apply in LOBBY', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    service.createRoom('DUEL_1V1', 2);
    service.setMode('MEMORY_RELAY');
    service.setChapter(4);

    expect(service.getState()?.mode).toBe('MEMORY_RELAY');
    expect(service.getState()?.chapter).toBe(4);

    const mutable = service as unknown as {
      getState: () => {
        mode: 'DUEL_1V1' | 'COOP_DUNGEON' | 'TEAM_2V2' | 'CODE_DUEL_DRAFT' | 'RACE_TO_PATH' | 'BUG_HUNT_2V2' | 'TOWER_DEFENSE_COOP' | 'MEMORY_RELAY' | 'TOURNAMENT_8';
        chapter: number;
        phase: 'LOBBY' | 'MATCH' | 'RESULT';
      } | null;
      publish: (state: unknown) => void;
    };

    const state = mutable.getState();
    if (!state) throw new Error('State should exist');

    mutable.publish({ ...state, phase: 'MATCH' });

    service.setMode('DUEL_1V1');
    service.setChapter(1);

    expect(service.getState()?.mode).toBe('MEMORY_RELAY');
    expect(service.getState()?.chapter).toBe(4);
  });

  it('reconnect keeps the current room state after transport restart', async () => {
    vi.useFakeTimers();

    try {
      const module = await import('../multiplayerRealtimeService');
      const service = module.multiplayerRealtimeService;

      service.createRoom('DUEL_1V1', 2);
      const roomCodeBefore = service.getState()?.roomCode;

      service.reconnect();
      await vi.advanceTimersByTimeAsync(1000);

      expect(service.getState()?.roomCode).toBe(roomCodeBefore);
      expect(service.getState()?.phase).toBe('LOBBY');
      expect(service.getState()?.players).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('finishRound moves match into RESULT and clears timer', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    service.createRoom('DUEL_1V1', 2);

    const mutable = service as unknown as {
      getState: () => {
        roomCode: string;
        mode: 'DUEL_1V1' | 'COOP_DUNGEON' | 'TEAM_2V2' | 'CODE_DUEL_DRAFT' | 'RACE_TO_PATH' | 'BUG_HUNT_2V2' | 'TOWER_DEFENSE_COOP' | 'MEMORY_RELAY' | 'TOURNAMENT_8';
        chapter: number;
        phase: 'LOBBY' | 'MATCH' | 'RESULT';
        hostId: string;
        timerEndsAt: number | null;
        questionIndex: number;
        resultText: string;
        players: Array<{ id: string; name: string; ready: boolean; score: number; role: 'GIAI_DO' | 'CHIEN_DAU'; team: 'A' | 'B' }>;
        updatedAt: number;
      } | null;
      publish: (state: unknown) => void;
    };

    const state = mutable.getState();
    if (!state) throw new Error('State should exist');

    mutable.publish({
      ...state,
      phase: 'MATCH',
      timerEndsAt: Date.now() + 30000,
    });

    service.finishRound('Match ended cleanly');

    expect(service.getState()?.phase).toBe('RESULT');
    expect(service.getState()?.timerEndsAt).toBeNull();
    expect(service.getState()?.resultText).toBe('Match ended cleanly');
  });
});
