import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

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
  onmessage: ((ev: MessageEvent) => void) | null = null;
  constructor(_name: string) {}
  postMessage(_data: unknown): void {}
  close(): void {}
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

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  localStorage.clear();
});

afterEach(async () => {
  const module = await import('../multiplayerRealtimeService');
  module.multiplayerRealtimeService.leaveRoom();
});

describe('multiplayerRealtimeService integration + safety', () => {
  it('runs lifecycle for multiplayer room and rematch chain', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;
    const mutable = service as unknown as { getState: () => any; publish: (state: any) => void; getPlayerId: () => string };

    service.setIdentity('Host');
    service.createRoom('DUEL_1V1', 2);

    const state = mutable.getState();
    mutable.publish({
      ...state,
      players: [
        ...state.players,
        {
          id: 'p2',
          name: 'Guest',
          ready: true,
          score: 0,
          role: 'GIAI_DO',
          team: 'B',
          presence: 'ACTIVE',
          rankMMR: 1200,
          ping: 55,
          lastActionAt: Date.now(),
        },
      ].map((p: any) => (p.id === mutable.getPlayerId() ? { ...p, ready: true } : p)),
    });

    expect(service.canStart()).toBe(true);
    service.startMatch();
    expect(service.getState()?.phase).toBe('MATCH');

    expect(service.submitAnswer(true, 20)).toBe(true);
    service.finishRound('Done');
    expect(service.getState()?.phase).toBe('RESULT');

    const q1 = service.getState()?.questionIndex ?? 0;
    service.rematch();
    const q2 = service.getState()?.questionIndex ?? 0;
    service.rematch();
    const q3 = service.getState()?.questionIndex ?? 0;

    expect(q2).toBe(q1 + 1);
    expect(q3).toBe(q2 + 1);
  });

  it('prevents double-submit and spam submit in same round', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;
    const mutable = service as unknown as { getState: () => any; publish: (state: any) => void; getPlayerId: () => string };

    service.createRoom('DUEL_1V1', 2);
    const state = mutable.getState();
    mutable.publish({
      ...state,
      phase: 'MATCH',
      timerEndsAt: Date.now() + 30000,
      matchStartedAt: Date.now(),
      players: [
        ...state.players,
        {
          id: 'p2',
          name: 'Guest',
          ready: true,
          score: 0,
          role: 'GIAI_DO',
          team: 'B',
          presence: 'ACTIVE',
          rankMMR: 1200,
          ping: 50,
          lastActionAt: Date.now(),
        },
      ].map((p: any) => (p.id === mutable.getPlayerId() ? { ...p, ready: true } : p)),
    });

    const first = service.submitAnswer(true, 12);
    const second = service.submitAnswer(true, 11);

    expect(first).toBe(true);
    expect(second).toBe(false);
  });

  it('supports reconnect resume state and tracks reconnect metric', async () => {
    vi.useFakeTimers();
    try {
      const module = await import('../multiplayerRealtimeService');
      const service = module.multiplayerRealtimeService;

      service.createRoom('DUEL_1V1', 2);
      const code = service.getState()?.roomCode;
      service.reconnect();
      await vi.advanceTimersByTimeAsync(1000);

      expect(service.getState()?.roomCode).toBe(code);
      expect(service.getRealtimeMetrics().reconnectCount).toBeGreaterThanOrEqual(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('applies penalty when host leaves during MATCH', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;
    const mutable = service as unknown as { getState: () => any; publish: (state: any) => void };

    service.createRoom('DUEL_1V1', 2);
    const before = service.getRankProfile();
    const state = mutable.getState();
    mutable.publish({ ...state, phase: 'MATCH', timerEndsAt: Date.now() + 10000, matchStartedAt: Date.now() });

    service.leaveRoom();
    const after = service.getRankProfile();

    expect(after.abandonCount).toBe(before.abandonCount + 1);
    expect(after.mmr).toBeLessThan(before.mmr);
  });

  it('supports quick match timeout and party invite accept flow', async () => {
    vi.useFakeTimers();
    try {
      const module = await import('../multiplayerRealtimeService');
      const service = module.multiplayerRealtimeService;

      service.createParty();
      const invite = service.inviteToParty('Teammate');
      expect(invite.length).toBeGreaterThan(0);
      expect(service.acceptPartyInvite(invite)).toBe(true);

      service.joinQuickMatch({ targetMode: 'DUEL_1V1', maxPing: 80 });
      expect(service.getQueueState().active).toBe(true);
      await vi.advanceTimersByTimeAsync(16000);
      expect(service.getQueueState().active).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('returns contract snapshot with required schema blocks', async () => {
    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;

    service.createRoom('DUEL_1V1', 2);
    const snapshot = service.getContractSnapshot() as Record<string, unknown>;

    expect(snapshot).toHaveProperty('roomState');
    expect(snapshot).toHaveProperty('queueState');
    expect(snapshot).toHaveProperty('party');
    expect(snapshot).toHaveProperty('profile');

    const room = snapshot.roomState as Record<string, unknown>;
    expect(room).toHaveProperty('submittedPlayerIds');
    expect(room).toHaveProperty('matchStartedAt');
    expect(room).toHaveProperty('lastActionSeq');
  });

  it('records server reject metadata from submit verification', async () => {
    vi.doMock('../multiplayerVerificationApiService', () => ({
      verifyMultiplayerSubmit: vi.fn().mockResolvedValue({
        accepted: false,
        code: 'RATE_LIMITED',
        reason: 'too_many_actions',
      }),
      verifyMultiplayerMatchResult: vi.fn().mockResolvedValue(null),
    }));

    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;
    const mutable = service as unknown as { getState: () => any; publish: (state: any) => void; getPlayerId: () => string };

    service.createRoom('DUEL_1V1', 2);
    const state = mutable.getState();
    mutable.publish({
      ...state,
      phase: 'MATCH',
      timerEndsAt: Date.now() + 30000,
      matchStartedAt: Date.now(),
      players: [
        ...state.players,
        {
          id: 'p2',
          name: 'Guest',
          ready: true,
          score: 0,
          role: 'GIAI_DO',
          team: 'B',
          presence: 'ACTIVE',
          rankMMR: 1200,
          ping: 50,
          lastActionAt: Date.now(),
        },
      ].map((p: any) => (p.id === mutable.getPlayerId() ? { ...p, ready: true } : p)),
    });

    expect(service.submitAnswer(true, 10)).toBe(true);
    await Promise.resolve();

    const telemetry = service.getRecentTelemetry(10);
    const submitServer = telemetry.find((item) => item.eventType === 'submit' && 'serverVerified' in item.payload);
    expect(submitServer?.payload.serverVerified).toBe(false);
    expect(submitServer?.payload.serverCode).toBe('RATE_LIMITED');
  });

  it('applies server override deltas to profile and summary', async () => {
    vi.doMock('../multiplayerVerificationApiService', () => ({
      verifyMultiplayerSubmit: vi.fn().mockResolvedValue(null),
      verifyMultiplayerMatchResult: vi.fn().mockResolvedValue({
        accepted: true,
        code: 'OK',
        overrideDeltaMmr: 3,
        overrideDeltaElo: 2,
      }),
    }));

    const module = await import('../multiplayerRealtimeService');
    const service = module.multiplayerRealtimeService;
    const mutable = service as unknown as { getState: () => any; publish: (state: any) => void; getPlayerId: () => string };

    service.createRoom('DUEL_1V1', 2);
    const state = mutable.getState();
    mutable.publish({
      ...state,
      phase: 'MATCH',
      timerEndsAt: Date.now() + 30000,
      matchStartedAt: Date.now() - 5000,
      submittedPlayerIds: [mutable.getPlayerId()],
      players: [
        ...state.players.map((p: any) => (p.id === mutable.getPlayerId() ? { ...p, score: 200, ready: true } : p)),
        {
          id: 'p2',
          name: 'Guest',
          ready: true,
          score: 150,
          role: 'GIAI_DO',
          team: 'B',
          presence: 'ACTIVE',
          rankMMR: 1200,
          ping: 52,
          lastActionAt: Date.now(),
        },
      ],
    });

    service.finishRound('Done');
    await Promise.resolve();

    const profile = service.getRankProfile();
    const summary = service.getMatchSummary();

    expect(summary?.deltaMMR).toBe(3);
    expect(summary?.deltaElo).toBe(2);
    expect(profile.history.at(-1)?.deltaMMR).toBe(3);
    expect(profile.history.at(-1)?.deltaElo).toBe(2);
  });
});
