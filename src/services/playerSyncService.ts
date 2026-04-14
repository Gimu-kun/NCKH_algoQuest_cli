/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PLAYER SYNC SERVICE - Backend Synchronization
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Sync player data với backend mỗi 5 phút, xử lý errors gracefully
 * 
 * @file src/services/playerSyncService.ts
 */

import apiClient from './apiClient';
import { ENV } from '../config/environment';

// 5 minutes in milliseconds
const SYNC_INTERVAL = 5 * 60 * 1000;

interface PlayerSyncData {
  playerId: string;
  currentLevel: number;
  totalExperience: number;
  achievements: string[];
  questsCompleted: number;
  lastSyncTime: number;
}

let syncIntervalId: NodeJS.Timeout | null = null;
let lastSyncTime = 0;

/**
 * Sync player data với backend
 */
export const syncPlayerData = async (data: PlayerSyncData): Promise<void> => {
  try {
    if (!ENV.API_BASE_URL) {
      console.warn('API_BASE_URL not configured, skipping sync');
      return;
    }

    const endpoint = `${ENV.API_BASE_URL}/players/${data.playerId}/sync`;
    
    await apiClient.post(endpoint, {
      currentLevel: data.currentLevel,
      totalExperience: data.totalExperience,
      achievements: data.achievements,
      questsCompleted: data.questsCompleted,
      syncedAt: new Date().toISOString(),
    });

    lastSyncTime = Date.now();
    console.debug('[PlayerSync] Player data synced successfully');
  } catch (error) {
    console.error('[PlayerSync] Failed to sync player data:', error);
    // Do not throw - allow app to continue even if sync fails
  }
};

/**
 * Khởi tạo auto-sync service
 */
export const initializeAutoSync = (playerDataGetter: () => PlayerSyncData): () => void => {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
  }

  syncIntervalId = setInterval(async () => {
    try {
      const playerData = playerDataGetter();
      if (playerData.playerId) {
        await syncPlayerData(playerData);
      }
    } catch (error) {
      console.error('[PlayerSync] Auto-sync failed:', error);
    }
  }, SYNC_INTERVAL);

  console.debug(`[PlayerSync] Auto-sync initialized (interval: ${SYNC_INTERVAL / 1000}s)`);

  // Return cleanup function
  return () => {
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
      syncIntervalId = null;
      console.debug('[PlayerSync] Auto-sync stopped');
    }
  };
};

/**
 * Stop auto-sync
 */
export const stopAutoSync = (): void => {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
};

/**
 * Force immediate sync
 */
export const forceSync = async (playerData: PlayerSyncData): Promise<void> => {
  await syncPlayerData(playerData);
};

/**
 * Get last sync time
 */
export const getLastSyncTime = (): number => lastSyncTime;

export default {
  syncPlayerData,
  initializeAutoSync,
  stopAutoSync,
  forceSync,
  getLastSyncTime,
};
