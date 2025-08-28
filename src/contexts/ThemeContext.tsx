import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'minimal-pastel' | 'dark-academia' | 'y2k';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Array<{
    id: Theme;
    name: string;
    description: string;
    colors: string[];
  }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  {
    id: 'minimal-pastel' as const,
    name: 'Minimal Pastel',
    description: 'Soft, dreamy vibes',
    colors: ['#F5B2D6', '#C8A8E9', '#A8DDD8']
  },
  {
    id: 'dark-academia' as const,
    name: 'Dark Academia',
    description: 'Cozy, studious aesthetic',
    colors: ['#D4AF8C', '#7B9971', '#6B5B4F']
  },
  {
    id: 'y2k' as const,
    name: 'Y2K Cyber',
    description: 'Futuristic neon dreams',
    colors: ['#FF66CC', '#00FFCC', '#FFFF66']
  }
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark-academia');

  useEffect(() => {
    const stored = localStorage.getItem('kanban-theme') as Theme;
    if (stored && themes.find(t => t.id === stored)) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban-theme', theme);
    
    // Remove existing theme classes
    document.documentElement.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme !== 'minimal-pastel') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}