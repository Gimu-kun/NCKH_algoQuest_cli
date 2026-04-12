import type {
  MatchResultVerifyPayload,
  MatchResultVerifyResponse,
  MultiplayerVerifyMode,
  SubmitVerifyPayload,
  SubmitVerifyResponse,
  VerifyRejectCode,
} from '../types/multiplayerType';

export const MP_VERIFY_ENDPOINTS = {
  submit: '/multiplayer/verify/submit',
  result: '/multiplayer/verify/result',
} as const;

export function getMultiplayerVerifyMode(): MultiplayerVerifyMode {
  const mode = import.meta.env.VITE_MP_VERIFY_MODE;
  if (mode === 'off' || mode === 'mock' || mode === 'live') return mode;
  if (Boolean(import.meta.env.VITE_ENABLE_MP_SERVER_VERIFY)) return 'live';
  return 'off';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isValidSubmitPayload(payload: SubmitVerifyPayload): boolean {
  return (
    typeof payload.roomCode === 'string' &&
    payload.roomCode.length > 0 &&
    typeof payload.playerId === 'string' &&
    payload.playerId.length > 0 &&
    Number.isInteger(payload.questionIndex) &&
    payload.questionIndex >= 0 &&
    typeof payload.isCorrect === 'boolean' &&
    isFiniteNumber(payload.timeLeft) &&
    payload.timeLeft >= 0 &&
    payload.timeLeft <= 120 &&
    isFiniteNumber(payload.clientAt)
  );
}

export function isValidResultPayload(payload: MatchResultVerifyPayload): boolean {
  return (
    typeof payload.roomCode === 'string' &&
    payload.roomCode.length > 0 &&
    typeof payload.playerId === 'string' &&
    payload.playerId.length > 0 &&
    Number.isInteger(payload.chapter) &&
    payload.chapter > 0 &&
    isFiniteNumber(payload.score) &&
    isFiniteNumber(payload.opponentScore) &&
    Array.isArray(payload.submittedPlayerIds) &&
    payload.submittedPlayerIds.every((id) => typeof id === 'string') &&
    isFiniteNumber(payload.durationMs) &&
    payload.durationMs >= 0 &&
    isFiniteNumber(payload.clientAt)
  );
}

function toCode(code: VerifyRejectCode | undefined): VerifyRejectCode {
  return code ?? 'SERVER_ERROR';
}

export function normalizeSubmitResponse(
  input: Partial<SubmitVerifyResponse> | null | undefined,
): SubmitVerifyResponse {
  if (!input) {
    return { accepted: false, code: 'SERVER_ERROR', reason: 'empty_response' };
  }

  return {
    accepted: Boolean(input.accepted),
    code: toCode(input.code),
    reason: input.reason,
    serverDelta: isFiniteNumber(input.serverDelta) ? input.serverDelta : undefined,
  };
}

export function normalizeResultResponse(
  input: Partial<MatchResultVerifyResponse> | null | undefined,
): MatchResultVerifyResponse {
  if (!input) {
    return { accepted: false, code: 'SERVER_ERROR', reason: 'empty_response' };
  }

  return {
    accepted: Boolean(input.accepted),
    code: toCode(input.code),
    reason: input.reason,
    overrideDeltaElo: isFiniteNumber(input.overrideDeltaElo) ? input.overrideDeltaElo : undefined,
    overrideDeltaMmr: isFiniteNumber(input.overrideDeltaMmr) ? input.overrideDeltaMmr : undefined,
  };
}

export function mockSubmitVerify(payload: SubmitVerifyPayload): SubmitVerifyResponse {
  if (!isValidSubmitPayload(payload)) {
    return { accepted: false, code: 'SUSPECTED_TAMPER', reason: 'invalid_payload' };
  }

  return {
    accepted: true,
    code: 'OK',
    serverDelta: payload.isCorrect ? 100 + Math.round(payload.timeLeft) : 20,
  };
}

export function mockResultVerify(payload: MatchResultVerifyPayload): MatchResultVerifyResponse {
  if (!isValidResultPayload(payload)) {
    return { accepted: false, code: 'SUSPECTED_TAMPER', reason: 'invalid_payload' };
  }

  return {
    accepted: true,
    code: 'OK',
  };
}
