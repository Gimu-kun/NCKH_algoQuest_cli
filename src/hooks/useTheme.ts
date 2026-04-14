/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * useTheme Hook - Theme Management for React Components
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Easy way to manage theme in React components with auto-sync to localStorage
 * 
 * @file src/hooks/useTheme.ts
 */

import { useState, useEffect, useCallback } from 'react';
import { getThemeMode, setThemeMode, toggleTheme as toggleThemeService } from '../services/themeService';

export type ThemeMode = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => getThemeMode());

  // Sync theme changes to localStorage
  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = toggleThemeService();
    setTheme(newTheme);
  }, []);

  const setThemeMode_Hook = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme: setThemeMode_Hook,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

export default useTheme;
