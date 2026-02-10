
import themeService, { ThemeType } from '../services/Theme/ThemeService';

export function getCurrentTheme() {
  return {
    theme: themeService.getCurrentTheme(),
    colors: themeService.getColors()
  };
}

export function useTheme() {
  const theme = themeService.getCurrentTheme();
  const colors = themeService.getColors();
  
  return { theme, colors };
}