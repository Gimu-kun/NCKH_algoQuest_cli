/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * THEME SERVICE - Dark/Light Mode Management
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Quản lý chế độ sáng/tối cho ứng dụng
 * 
 * @file src/services/themeService.ts
 */

export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'algoquestcli_theme';
const DEFAULT_THEME: ThemeMode = 'dark';

/**
 * Lấy chế độ theme hiện tại từ localStorage
 */
export const getThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return (stored as ThemeMode) || DEFAULT_THEME;
};

/**
 * Lưu chế độ theme vào localStorage
 */
export const setThemeMode = (theme: ThemeMode): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
};

/**
 * Áp dụng theme vào HTML element
 */
export const applyTheme = (theme: ThemeMode): void => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark-mode');
    root.classList.remove('light-mode');
  } else {
    root.classList.add('light-mode');
    root.classList.remove('dark-mode');
  }
};

/**
 * Toggle giữa dark và light mode
 */
export const toggleTheme = (): ThemeMode => {
  const current = getThemeMode();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setThemeMode(newTheme);
  return newTheme;
};

/**
 * Khởi tạo theme khi app load
 */
export const initializeTheme = (): void => {
  const theme = getThemeMode();
  applyTheme(theme);
};

export default { getThemeMode, setThemeMode, applyTheme, toggleTheme, initializeTheme };
