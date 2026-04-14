/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AUDIO SETTINGS SERVICE - Persistent Audio Configuration
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Quản lý cài đặt âm thanh với persistence qua localStorage
 * 
 * @file src/services/audioSettingsService.ts
 */

export interface AudioSettings {
  masterVolume: number;    // 0-100
  musicVolume: number;     // 0-100
  sfxVolume: number;       // 0-100
  voiceVolume: number;     // 0-100
  isMuted: boolean;
  enableMusic: boolean;
  enableSFX: boolean;
  enableVoice: boolean;
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 80,
  voiceVolume: 90,
  isMuted: false,
  enableMusic: true,
  enableSFX: true,
  enableVoice: true,
};

const AUDIO_STORAGE_KEY = 'algoquestcli_audio_settings';

/**
 * Lấy cài đặt âm thanh từ localStorage
 */
export const getAudioSettings = (): AudioSettings => {
  try {
    const stored = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse audio settings:', error);
  }
  return { ...DEFAULT_SETTINGS };
};

/**
 * Lưu cài đặt âm thanh vào localStorage
 */
export const saveAudioSettings = (settings: Partial<AudioSettings>): AudioSettings => {
  const current = getAudioSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Cập nhật volume chính
 */
export const setMasterVolume = (volume: number): AudioSettings => {
  const clamped = Math.max(0, Math.min(100, volume));
  return saveAudioSettings({ masterVolume: clamped });
};

/**
 * Cập nhật volume nhạc
 */
export const setMusicVolume = (volume: number): AudioSettings => {
  const clamped = Math.max(0, Math.min(100, volume));
  return saveAudioSettings({ musicVolume: clamped });
};

/**
 * Cập nhật volume SFX
 */
export const setSFXVolume = (volume: number): AudioSettings => {
  const clamped = Math.max(0, Math.min(100, volume));
  return saveAudioSettings({ sfxVolume: clamped });
};

/**
 * Toggle mute toàn bộ audio
 */
export const toggleMute = (): AudioSettings => {
  const current = getAudioSettings();
  return saveAudioSettings({ isMuted: !current.isMuted });
};

/**
 * Toggle âm thanh nhạc
 */
export const toggleMusic = (): AudioSettings => {
  const current = getAudioSettings();
  return saveAudioSettings({ enableMusic: !current.enableMusic });
};

/**
 * Reset về cài đặt mặc định
 */
export const resetAudioSettings = (): AudioSettings => {
  localStorage.removeItem(AUDIO_STORAGE_KEY);
  return { ...DEFAULT_SETTINGS };
};

export default {
  getAudioSettings,
  saveAudioSettings,
  setMasterVolume,
  setMusicVolume,
  setSFXVolume,
  toggleMute,
  toggleMusic,
  resetAudioSettings,
};
