/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ENVIRONMENT CONFIGURATION SERVICE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Quản lý tất cả environment variables - dễ truy cập từ toàn ứng dụng
 * 
 * @file src/config/environment.ts
 */

export const ENV = {
  // === API CONFIGURATION ===
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
  
  // === APPLICATION INFO ===
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AlgoQuest CLI',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // === FEATURE FLAGS ===
  ENABLE_MULTIPLAYER: import.meta.env.VITE_ENABLE_MULTIPLAYER !== 'false',
  ENABLE_LEADERBOARDS: import.meta.env.VITE_ENABLE_LEADERBOARDS !== 'false',
  ENABLE_ACHIEVEMENTS: import.meta.env.VITE_ENABLE_ACHIEVEMENTS !== 'false',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  
  // === COMPUTED PROPERTIES ===
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  
  /**
   * Lấy full URL cho endpoint
   * Ví dụ: getApiUrl('/auth/login') => 'http://localhost:3000/api/auth/login'
   */
  getApiUrl: (endpoint: string): string => {
    const base = ENV.API_BASE_URL.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  },
} as const;

export default ENV;
