// src/i18n/useTranslation.ts
// Hook to access translations throughout the app

import { useCallback } from 'react';
import { viTranslations } from './vi';

type TranslationKey = string;

interface UseTranslationReturn {
  t: (key: string, defaultValue?: string) => string;
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

// Get nested value from object by key path
// Example: "mainMenu.title" -> viTranslations.mainMenu.title
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, prop) => {
    return current?.[prop] ?? path;
  }, obj);
}

// Store language preference in localStorage
const LANGUAGE_KEY = 'app_language';

export function useTranslation(): UseTranslationReturn {
  // Get language from localStorage, default to Vietnamese
  const getCurrentLanguage = (): 'vi' | 'en' => {
    if (typeof window === 'undefined') return 'vi';
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return (stored as 'vi' | 'en') || 'vi';
  };

  // For now, we only support Vietnamese
  const language: 'vi' | 'en' = 'vi';

  const t = useCallback((key: string, defaultValue: string = key): string => {
    if (language === 'vi') {
      const value = getNestedValue(viTranslations, key);
      return typeof value === 'string' ? value : defaultValue;
    }
    return defaultValue;
  }, [language]);

  const setLanguage = useCallback((lang: 'vi' | 'en') => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    window.location.reload(); // Reload to apply language change
  }, []);

  return { t, language, setLanguage };
}

// Alternative: Simple export for direct usage
export const t = (key: string, defaultValue: string = key): string => {
  const value = getNestedValue(viTranslations, key);
  return typeof value === 'string' ? value : defaultValue;
};
