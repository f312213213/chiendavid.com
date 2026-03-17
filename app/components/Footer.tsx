'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

export default function Footer() {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const initialTheme = savedTheme || 'system';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    document.documentElement.classList.remove('light', 'dark');

    if (mode === 'light') {
      document.documentElement.classList.add('light');
    } else if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    }
  };

  const cycleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
    }
  };

  return (
    <footer className="text-sm flex justify-between items-center gap-4 pt-8 border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
      <p>&copy; {new Date().getFullYear()} David Chien</p>
      <button
        onClick={cycleTheme}
        className="text-xs font-medium tracking-wide uppercase cursor-pointer transition-colors duration-200 hover:opacity-70"
        style={{ color: 'var(--muted)' }}
        aria-label={`Current theme: ${theme}. Click to cycle themes.`}
        title={`Current: ${theme}`}
      >
        {mounted ? getThemeLabel() : 'System'}
      </button>
    </footer>
  );
}
