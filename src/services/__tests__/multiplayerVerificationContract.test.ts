import { describe, expect, it } from 'vitest';
import {
  isValidResultPayload,
  isValidSubmitPayload,
  mockResultVerify,
  mockSubmitVerify,
  normalizeResultResponse,
  normalizeSubmitResponse,
} from '../multiplayerVerificationContract';

describe('multiplayer verification contract', () => {
  it('validates submit payload shape and bounds', () => {
    const valid = isValidSubmitPayload({
      roomCode: 'ABC123',
      playerId: 'p1',
      questionIndex: 1,
      isCorrect: true,
      timeLeft: 20,
      clientAt: Date.now(),
    });

    const invalid = isValidSubmitPayload({
      roomCode: '',
      playerId: 'p1',
      questionIndex: -1,
      isCorrect: true,
      timeLeft: 999,
      clientAt: Date.now(),
    });

    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });

  it('validates result payload shape', () => {
    const valid = isValidResultPayload({
      roomCode: 'ABC123',
      playerId: 'p1',
      mode: 'DUEL_1V1',
      chapter: 2,
      score: 120,
      opponentScore: 80,
      submittedPlayerIds: ['p1', 'p2'],
      durationMs: 30000,
      clientAt: Date.now(),
    });

    const invalid = isValidResultPayload({
      roomCode: 'ABC123',
      playerId: 'p1',
      mode: 'DUEL_1V1',
      chapter: 0,
      score: 120,
      opponentScore: 80,
      submittedPlayerIds: ['p1', 2 as unknown as string],
      durationMs: -1,
      clientAt: Date.now(),
    });

    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });

  it('normalizes empty responses to server error', () => {
    const submit = normalizeSubmitResponse(null);
    const result = normalizeResultResponse(undefined);

    expect(submit.accepted).toBe(false);
    expect(submit.code).toBe('SERVER_ERROR');
    expect(result.accepted).toBe(false);
    expect(result.code).toBe('SERVER_ERROR');
  });

  it('returns deterministic mock verification responses', () => {
    const submit = mockSubmitVerify({
      roomCode: 'ABC123',
      playerId: 'p1',
      questionIndex: 1,
      isCorrect: true,
      timeLeft: 10,
      clientAt: Date.now(),
    });

    const result = mockResultVerify({
      roomCode: 'ABC123',
      playerId: 'p1',
      mode: 'DUEL_1V1',
      chapter: 2,
      score: 120,
      opponentScore: 100,
      submittedPlayerIds: ['p1'],
      durationMs: 10000,
      clientAt: Date.now(),
    });

    expect(submit.accepted).toBe(true);
    expect(submit.code).toBe('OK');
    expect(typeof submit.serverDelta).toBe('number');
    expect(result.accepted).toBe(true);
    expect(result.code).toBe('OK');
  });
});
