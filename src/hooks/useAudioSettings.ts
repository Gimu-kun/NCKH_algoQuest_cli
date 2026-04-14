/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useAudioSettings Hook - Audio Configuration Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Manage audio settings with persistent localStorage
 * 
 * @file src/hooks/useAudioSettings.ts
 */

import { useState, useCallback, useEffect } from 'react';
import {
  AudioSettings,
  getAudioSettings,
  saveAudioSettings,
  setMasterVolume as setMasterVolumeService,
  setMusicVolume as setMusicVolumeService,
  setSFXVolume as setSFXVolumeService,
  toggleMute as toggleMuteService,
  toggleMusic as toggleMusicService,
  resetAudioSettings as resetAudioSettingsService,
} from '../services/audioSettingsService';

export const useAudioSettings = () => {
  const [settings, setSettings] = useState<AudioSettings>(() => getAudioSettings());

  // Refresh settings when component mounts
  useEffect(() => {
    setSettings(getAudioSettings());
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    const updated = saveAudioSettings(newSettings);
    setSettings(updated);
    return updated;
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    const updated = setMasterVolumeService(volume);
    setSettings(updated);
    return updated;
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    const updated = setMusicVolumeService(volume);
    setSettings(updated);
    return updated;
  }, []);

  const setSFXVolume = useCallback((volume: number) => {
    const updated = setSFXVolumeService(volume);
    setSettings(updated);
    return updated;
  }, []);

  const toggleMute = useCallback(() => {
    const updated = toggleMuteService();
    setSettings(updated);
    return updated;
  }, []);

  const toggleMusic = useCallback(() => {
    const updated = toggleMusicService();
    setSettings(updated);
    return updated;
  }, []);

  const resetSettings = useCallback(() => {
    const updated = resetAudioSettingsService();
    setSettings(updated);
    return updated;
  }, []);

  return {
    settings,
    updateSettings,
    setMasterVolume,
    setMusicVolume,
    setSFXVolume,
    toggleMute,
    toggleMusic,
    resetSettings,
  };
};

export default useAudioSettings;
