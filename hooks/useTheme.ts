// hooks/useTheme.ts
import { useState, useEffect } from 'react';
import themeService from '../services/Theme/ThemeService';

export function useTheme() {
  const [theme, setTheme] = useState(themeService.getCurrentTheme());
  const [colors, setColors] = useState(themeService.getColors());

  useEffect(() => {
    const handleThemeChange = (newTheme: any) => {
      setTheme(newTheme.detail);
      setColors(themeService.getColors());
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  return { theme, colors };
}