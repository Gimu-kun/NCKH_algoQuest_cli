import apiClient from './apiClient';
import type {
  MatchResultVerifyPayload,
  MatchResultVerifyResponse,
  SubmitVerifyPayload,
  SubmitVerifyResponse,
} from '../types/multiplayerType';
import type { ApiResponse } from '../types/apiType';

function isServerVerifyEnabled(): boolean {
  return Boolean(import.meta.env.VITE_ENABLE_MP_SERVER_VERIFY);
}

export async function verifyMultiplayerSubmit(
  payload: SubmitVerifyPayload,
): Promise<SubmitVerifyResponse | null> {
  if (!isServerVerifyEnabled()) return null;

  try {
    const response = await apiClient.post<ApiResponse<SubmitVerifyResponse>>(
      '/multiplayer/verify/submit',
      payload,
    );
    return response.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function verifyMultiplayerMatchResult(
  payload: MatchResultVerifyPayload,
): Promise<MatchResultVerifyResponse | null> {
  if (!isServerVerifyEnabled()) return null;

  try {
    const response = await apiClient.post<ApiResponse<MatchResultVerifyResponse>>(
      '/multiplayer/verify/result',
      payload,
    );
    return response.data?.data ?? null;
  } catch {
    return null;
  }
}
