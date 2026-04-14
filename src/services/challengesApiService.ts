/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CHALLENGES API SERVICE - CMS and Data Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Quản lý challenges với CRUD operations để hỗ trợ CMS
 * 
 * @file src/services/challengesApiService.ts
 */

import apiClient from './apiClient';
import { ENV } from '../config/environment';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  chapter: number;
  difficulty: 'easy' | 'medium' | 'hard';
  algorithm: string;
  testCases: TestCase[];
  hints: string[];
  reward: {
    experience: number;
    gold: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

/**
 * Fetch tất cả challenges
 */
export const fetchAllChallenges = async (): Promise<Challenge[]> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges`;
    const response = await apiClient.get(endpoint);
    return response.data || [];
  } catch (error) {
    console.error('[ChallengeAPI] Failed to fetch challenges:', error);
    return [];
  }
};

/**
 * Fetch challenge theo ID
 */
export const fetchChallenge = async (id: string): Promise<Challenge | null> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges/${id}`;
    const response = await apiClient.get(endpoint);
    return response.data || null;
  } catch (error) {
    console.error('[ChallengeAPI] Failed to fetch challenge:', error);
    return null;
  }
};

/**
 * Fetch challenges theo chapter
 */
export const fetchChallengesByChapter = async (chapter: number): Promise<Challenge[]> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges/chapter/${chapter}`;
    const response = await apiClient.get(endpoint);
    return response.data || [];
  } catch (error) {
    console.error('[ChallengeAPI] Failed to fetch challenges for chapter:', error);
    return [];
  }
};

/**
 * Fetch challenges theo difficulty
 */
export const fetchChallengesByDifficulty = async (difficulty: string): Promise<Challenge[]> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges/difficulty/${difficulty}`;
    const response = await apiClient.get(endpoint);
    return response.data || [];
  } catch (error) {
    console.error('[ChallengeAPI] Failed to fetch challenges by difficulty:', error);
    return [];
  }
};

/**
 * Tạo challenge mới (Admin/CMS only)
 */
export const createChallenge = async (challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge | null> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges`;
    const response = await apiClient.post(endpoint, challenge);
    return response.data || null;
  } catch (error) {
    console.error('[ChallengeAPI] Failed to create challenge:', error);
    throw error;
  }
};

/**
 * Cập nhật challenge (Admin/CMS only)
 */
export const updateChallenge = async (id: string, updates: Partial<Challenge>): Promise<Challenge | null> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges/${id}`;
    const response = await apiClient.put(endpoint, updates);
    return response.data || null;
  } catch (error) {
    console.error('[ChallengeAPI] Failed to update challenge:', error);
    throw error;
  }
};

/**
 * Xóa challenge (Admin/CMS only)
 */
export const deleteChallenge = async (id: string): Promise<boolean> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges/${id}`;
    await apiClient.delete(endpoint);
    return true;
  } catch (error) {
    console.error('[ChallengeAPI] Failed to delete challenge:', error);
    return false;
  }
};

/**
 * Validate challenge code against test cases
 */
export const validateChallenge = async (challengeId: string, code: string): Promise<{ passed: number; total: number; passed_tests: boolean[] } | null> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges/${challengeId}/validate`;
    const response = await apiClient.post(endpoint, { code });
    return response.data || null;
  } catch (error) {
    console.error('[ChallengeAPI] Failed to validate challenge:', error);
    return null;
  }
};

/**
 * Submit challenge solution
 */
export const submitChallengeSolution = async (challengeId: string, code: string, playerId: string): Promise<{ success: boolean; reward: any } | null> => {
  try {
    const endpoint = `${ENV.API_BASE_URL}/challenges/${challengeId}/submit`;
    const response = await apiClient.post(endpoint, { code, playerId });
    return response.data || null;
  } catch (error) {
    console.error('[ChallengeAPI] Failed to submit solution:', error);
    return null;
  }
};

export default {
  fetchAllChallenges,
  fetchChallenge,
  fetchChallengesByChapter,
  fetchChallengesByDifficulty,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  validateChallenge,
  submitChallengeSolution,
};
