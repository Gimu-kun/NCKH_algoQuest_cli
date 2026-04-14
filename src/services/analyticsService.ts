/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ANALYTICS SERVICE - Tracking User Activity & Difficulty Metrics
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Track challenge completion, difficulty metrics, user engagement
 * 
 * @file src/services/analyticsService.ts
 */

import apiClient from './apiClient';
import { ENV } from '../config/environment';

export interface AnalyticsEvent {
  type: 'challenge_started' | 'challenge_completed' | 'challenge_failed' | 'hint_used' | 'page_visited';
  playerId: string;
  challengeId?: string;
  chapter?: number;
  difficulty?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface DifficultyMetrics {
  easy: {
    totalStarted: number;
    totalCompleted: number;
    averageTime: number;
    successRate: number;
  };
  medium: {
    totalStarted: number;
    totalCompleted: number;
    averageTime: number;
    successRate: number;
  };
  hard: {
    totalStarted: number;
    totalCompleted: number;
    averageTime: number;
    successRate: number;
  };
}

/**
 * Track challenge started event
 */
export const trackChallengeStarted = async (playerId: string, challengeId: string, difficulty: string) => {
  if (!ENV.ENABLE_ANALYTICS) return;

  try {
    const event: AnalyticsEvent = {
      type: 'challenge_started',
      playerId,
      challengeId,
      difficulty,
      timestamp: new Date().toISOString(),
    };
    await sendAnalyticsEvent(event);
  } catch (error) {
    console.debug('[Analytics] Failed to track challenge started:', error);
  }
};

/**
 * Track challenge completed event
 */
export const trackChallengeCompleted = async (playerId: string, challengeId: string, difficulty: string, timeSpent: number) => {
  if (!ENV.ENABLE_ANALYTICS) return;

  try {
    const event: AnalyticsEvent = {
      type: 'challenge_completed',
      playerId,
      challengeId,
      difficulty,
      metadata: { timeSpent },
      timestamp: new Date().toISOString(),
    };
    await sendAnalyticsEvent(event);
  } catch (error) {
    console.debug('[Analytics] Failed to track challenge completed:', error);
  }
};

/**
 * Track challenge failed event
 */
export const trackChallengeFailed = async (playerId: string, challengeId: string, difficulty: string, attempts: number) => {
  if (!ENV.ENABLE_ANALYTICS) return;

  try {
    const event: AnalyticsEvent = {
      type: 'challenge_failed',
      playerId,
      challengeId,
      difficulty,
      metadata: { attempts },
      timestamp: new Date().toISOString(),
    };
    await sendAnalyticsEvent(event);
  } catch (error) {
    console.debug('[Analytics] Failed to track challenge failed:', error);
  }
};

/**
 * Track hint used event
 */
export const trackHintUsed = async (playerId: string, challengeId: string, hintIndex: number) => {
  if (!ENV.ENABLE_ANALYTICS) return;

  try {
    const event: AnalyticsEvent = {
      type: 'hint_used',
      playerId,
      challengeId,
      metadata: { hintIndex },
      timestamp: new Date().toISOString(),
    };
    await sendAnalyticsEvent(event);
  } catch (error) {
    console.debug('[Analytics] Failed to track hint used:', error);
  }
};

/**
 * Send analytics event to backend
 */
const sendAnalyticsEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/analytics/events`;
    await apiClient.post(endpoint, event);
  } catch (error) {
    console.debug('[Analytics] Failed to send event:', error);
    // Silently fail - don't break the app for analytics
  }
};

/**
 * Get difficulty metrics for player
 */
export const getDifficultyMetrics = async (playerId: string): Promise<DifficultyMetrics | null> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/analytics/metrics/${playerId}`;
    const response = await apiClient.get(endpoint);
    return response.data || null;
  } catch (error) {
    console.error('[Analytics] Failed to get difficulty metrics:', error);
    return null;
  }
};

/**
 * Get chapter completion rates
 */
export const getChapterMetrics = async (playerId: string) => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/analytics/chapters/${playerId}`;
    const response = await apiClient.get(endpoint);
    return response.data || {};
  } catch (error) {
    console.error('[Analytics] Failed to get chapter metrics:', error);
    return {};
  }
};

export default {
  trackChallengeStarted,
  trackChallengeCompleted,
  trackChallengeFailed,
  trackHintUsed,
  getDifficultyMetrics,
  getChapterMetrics,
};
