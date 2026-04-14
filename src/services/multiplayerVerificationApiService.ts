import apiClient from './apiClient';
import type {
  MatchResultVerifyPayload,
  MatchResultVerifyResponse,
  SubmitVerifyPayload,
  SubmitVerifyResponse,
} from '../types/multiplayerType';
import type { ApiResponse } from '../types/apiType';
import {
  getMultiplayerVerifyMode,
  isValidResultPayload,
  isValidSubmitPayload,
  mockResultVerify,
  mockSubmitVerify,
  MP_VERIFY_ENDPOINTS,
  normalizeResultResponse,
  normalizeSubmitResponse,
} from './multiplayerVerificationContract';

export async function verifyMultiplayerSubmit(
  payload: SubmitVerifyPayload,
): Promise<SubmitVerifyResponse | null> {
  const mode = getMultiplayerVerifyMode();
  if (mode === 'off') return null;
  if (!isValidSubmitPayload(payload)) {
    return { accepted: false, code: 'SUSPECTED_TAMPER', reason: 'invalid_payload' };
  }
  if (mode === 'mock') return mockSubmitVerify(payload);

  try {
    const response = await apiClient.post<ApiResponse<SubmitVerifyResponse>>(
      MP_VERIFY_ENDPOINTS.submit,
      payload,
    );
    return normalizeSubmitResponse(response.data?.data);
  } catch {
    return { accepted: false, code: 'SERVER_ERROR', reason: 'network_or_server_error' };
  }
}

export async function verifyMultiplayerMatchResult(
  payload: MatchResultVerifyPayload,
): Promise<MatchResultVerifyResponse | null> {
  const mode = getMultiplayerVerifyMode();
  if (mode === 'off') return null;
  if (!isValidResultPayload(payload)) {
    return { accepted: false, code: 'SUSPECTED_TAMPER', reason: 'invalid_payload' };
  }
  if (mode === 'mock') return mockResultVerify(payload);

  try {
    const response = await apiClient.post<ApiResponse<MatchResultVerifyResponse>>(
      MP_VERIFY_ENDPOINTS.result,
      payload,
    );
    return normalizeResultResponse(response.data?.data);
  } catch {
    return { accepted: false, code: 'SERVER_ERROR', reason: 'network_or_server_error' };
  }
}
