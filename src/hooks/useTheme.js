import { useState, useCallback } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('peach_theme') || 'light'; }
    catch { return 'light'; }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('peach_theme', next); } catch {}
      if (next === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
