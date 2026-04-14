/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * LEADERBOARDS API SERVICE - Backend Integration
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Fetch và manage leaderboard data từ backend
 * 
 * @file src/services/leaderboardsApiService.ts
 */

import apiClient from './apiClient';
import { ENV } from '../config/environment';

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  level: number;
  experience: number;
  region?: string;
  avatar?: string;
}

export interface LeaderboardResponse {
  global: LeaderboardEntry[];
  friends: LeaderboardEntry[];
  regional: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
}

/**
 * Fetch global leaderboard từ backend
 */
export const fetchGlobalLeaderboard = async (limit: number = 100): Promise<LeaderboardEntry[]> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/leaderboards/global`;
    const response = await apiClient.get(endpoint, { params: { limit } });
    return response.data || [];
  } catch (error) {
    console.error('[LeaderboardAPI] Failed to fetch global leaderboard:', error);
    return [];
  }
};

/**
 * Fetch weekly leaderboard từ backend
 */
export const fetchWeeklyLeaderboard = async (limit: number = 100): Promise<LeaderboardEntry[]> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/leaderboards/weekly`;
    const response = await apiClient.get(endpoint, { params: { limit } });
    return response.data || [];
  } catch (error) {
    console.error('[LeaderboardAPI] Failed to fetch weekly leaderboard:', error);
    return [];
  }
};

/**
 * Fetch regional leaderboard từ backend
 */
export const fetchRegionalLeaderboard = async (region: string, limit: number = 100): Promise<LeaderboardEntry[]> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/leaderboards/regional/${region}`;
    const response = await apiClient.get(endpoint, { params: { limit } });
    return response.data || [];
  } catch (error) {
    console.error(`[LeaderboardAPI] Failed to fetch ${region} leaderboard:`, error);
    return [];
  }
};

/**
 * Fetch friends leaderboard từ backend
 */
export const fetchFriendsLeaderboard = async (playerId: string): Promise<LeaderboardEntry[]> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/leaderboards/friends/${playerId}`;
    const response = await apiClient.get(endpoint);
    return response.data || [];
  } catch (error) {
    console.error('[LeaderboardAPI] Failed to fetch friends leaderboard:', error);
    return [];
  }
};

/**
 * Get player rank từ backend
 */
export const fetchPlayerRank = async (playerId: string): Promise<number | null> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/leaderboards/rank/${playerId}`;
    const response = await apiClient.get(endpoint);
    return response.data?.rank || null;
  } catch (error) {
    console.error('[LeaderboardAPI] Failed to fetch player rank:', error);
    return null;
  }
};

/**
 * Fetch all leaderboards data (global, weekly, friends, regional)
 */
export const fetchAllLeaderboards = async (playerId: string, region: string): Promise<LeaderboardResponse> => {
  try {
    const [global, weekly, friends, regional] = await Promise.all([
      fetchGlobalLeaderboard(50),
      fetchWeeklyLeaderboard(50),
      fetchFriendsLeaderboard(playerId),
      fetchRegionalLeaderboard(region, 50),
    ]);

    return { global, weekly, friends, regional };
  } catch (error) {
    console.error('[LeaderboardAPI] Failed to fetch all leaderboards:', error);
    return { global: [], weekly: [], friends: [], regional: [] };
  }
};

export default {
  fetchGlobalLeaderboard,
  fetchWeeklyLeaderboard,
  fetchRegionalLeaderboard,
  fetchFriendsLeaderboard,
  fetchPlayerRank,
  fetchAllLeaderboards,
};
