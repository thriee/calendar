// composables/useTheme.ts
import { ref } from 'vue';
import type { Theme } from '@/types';

const STORAGE_KEY = 'rili:theme';
const theme = ref<Theme>('system');

function getSystemPref(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  const effective = t === 'system' ? getSystemPref() : t;
  document.documentElement.setAttribute('data-theme', effective);
}

export function useTheme() {
  function initTheme() {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
    theme.value = stored;
    applyTheme(stored);

    // 监听系统主题变化
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (theme.value === 'system') applyTheme('system');
      });
    }
  }

  function setTheme(t: Theme) {
    theme.value = t;
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* localStorage 不可用时静默 */
    }
    applyTheme(t);
  }

  function cycleTheme() {
    const order: Theme[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(theme.value) + 1) % order.length];
    setTheme(next);
  }

  return { theme, initTheme, setTheme, cycleTheme };
}
