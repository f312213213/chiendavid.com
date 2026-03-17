'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
}

interface FooterProps {
  education?: Education[];
}

export default function Footer({ education }: FooterProps) {
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
    <footer className="scroll-reveal text-sm pt-16 mt-8 border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
      {education && education.length > 0 && (
        <div className="mb-8">
          {education.map((edu, index) => (
            <p key={index}>
              {edu.degree}, {edu.institution} &middot; {edu.period}
            </p>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} David Chien</p>
        <button
          onClick={cycleTheme}
          className="text-xs font-medium tracking-wide uppercase cursor-pointer transition-all duration-200 px-3 py-1.5 border hover:opacity-70"
          style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
          aria-label={`Current theme: ${theme}. Click to cycle themes.`}
          title={`Current: ${theme}`}
        >
          {mounted ? getThemeLabel() : 'System'}
        </button>
      </div>
    </footer>
  );
}
