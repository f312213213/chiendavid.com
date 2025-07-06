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

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '⚙️';
    }
  };

  return (
    <footer className="text-sm text-muted flex justify-between items-center gap-2 max-w-screen-sm mx-auto px-6 py-12">
      <p>© {new Date().getFullYear()} David Chien. All rights reserved.</p>
      <button 
        onClick={cycleTheme}
        className="text-lg hover:scale-110 cursor-pointer"
        aria-label={`Current theme: ${theme}. Click to cycle themes.`}
        title={`Current: ${theme}`}
      >
        {mounted ? getThemeIcon() : '⚙️'}
      </button>
    </footer>
  );
}