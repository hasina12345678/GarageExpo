// services/Theme/ThemeService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'professional' | 'blue';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  accentLight: string;
  border: string;
  surface: string;
  blue: string;
  blueDark: string;
  white: string;
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  text: string;
  textSecondary: string;
  card: string;
}

const themes: Record<ThemeType, ThemeColors> = {
  // Thème actuel (light)
  light: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    accent: '#4A5568',
    accentLight: '#718096',
    border: '#E2E8F0',
    surface: '#FFFFFF',
    blue: '#4299E1',
    blueDark: '#3182CE',
    white: '#FFFFFF',
    gray50: '#F7FAFC',
    gray100: '#EDF2F7',
    gray200: '#E2E8F0',
    gray300: '#CBD5E0',
    gray400: '#A0AEC0',
    gray500: '#718096',
    gray600: '#4A5568',
    gray700: '#2D3748',
    gray800: '#1A202C',
    success: '#38A169',
    warning: '#D69E2E',
    danger: '#E53E3E',
    info: '#4299E1',
    background: '#FFFFFF',
    text: '#1A202C',
    textSecondary: '#4A5568',
    card: '#FFFFFF',
  },
  
  // Thème sombre
  dark: {
    primary: '#1A202C',
    secondary: '#2D3748',
    accent: '#CBD5E0',
    accentLight: '#718096',
    border: '#4A5568',
    surface: '#2D3748',
    blue: '#63B3ED',
    blueDark: '#4299E1',
    white: '#FFFFFF',
    gray50: '#171923',
    gray100: '#2D3748',
    gray200: '#4A5568',
    gray300: '#718096',
    gray400: '#A0AEC0',
    gray500: '#CBD5E0',
    gray600: '#E2E8F0',
    gray700: '#EDF2F7',
    gray800: '#F7FAFC',
    success: '#68D391',
    warning: '#F6AD55',
    danger: '#FC8181',
    info: '#76E4F7',
    background: '#1A202C',
    text: '#F7FAFC',
    textSecondary: '#CBD5E0',
    card: '#2D3748',
  },
  
  // Thème professionnel (bleu)
  professional: {
    primary: '#FFFFFF',
    secondary: '#EBF8FF',
    accent: '#2C5282',
    accentLight: '#4299E1',
    border: '#BEE3F8',
    surface: '#FFFFFF',
    blue: '#2B6CB0',
    blueDark: '#2C5282',
    white: '#FFFFFF',
    gray50: '#F7FAFC',
    gray100: '#EBF8FF',
    gray200: '#BEE3F8',
    gray300: '#90CDF4',
    gray400: '#63B3ED',
    gray500: '#4299E1',
    gray600: '#3182CE',
    gray700: '#2B6CB0',
    gray800: '#2C5282',
    success: '#38A169',
    warning: '#D69E2E',
    danger: '#E53E3E',
    info: '#4299E1',
    background: '#FFFFFF',
    text: '#2D3748',
    textSecondary: '#4A5568',
    card: '#FFFFFF',
  },
  
  // Thème garage (orange/bleu)
  blue: {
    primary: '#FFFFFF',
    secondary: '#F0F9FF',
    accent: '#1E40AF',
    accentLight: '#3B82F6',
    border: '#BFDBFE',
    surface: '#FFFFFF',
    blue: '#1D4ED8',
    blueDark: '#1E40AF',
    white: '#FFFFFF',
    gray50: '#F8FAFC',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    background: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#475569',
    card: '#FFFFFF',
  },
};

class ThemeService {
  private currentTheme: ThemeType = 'light';
  
  constructor() {
    this.loadTheme();
  }
  
  // Charger le thème sauvegardé
  async loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme && themes[savedTheme as ThemeType]) {
        this.currentTheme = savedTheme as ThemeType;
      }
    } catch (error) {
      console.error('Erreur chargement thème:', error);
    }
  }
  
  // Obtenir le thème actuel
  getCurrentTheme(): ThemeType {
    return this.currentTheme;
  }
  
  // Obtenir les couleurs du thème actuel
  getColors(): ThemeColors {
    return themes[this.currentTheme];
  }
  
  // Obtenir un thème spécifique
  getTheme(theme: ThemeType): ThemeColors {
    return themes[theme];
  }
  
  // Changer de thème
  async setTheme(theme: ThemeType): Promise<boolean> {
    try {
      if (!themes[theme]) {
        throw new Error(`Thème ${theme} non trouvé`);
      }
      
      this.currentTheme = theme;
      await AsyncStorage.setItem('app_theme', theme);
      return true;
    } catch (error) {
      console.error('Erreur changement thème:', error);
      return false;
    }
  }
  
  // Liste des thèmes disponibles
  getAvailableThemes(): Array<{ id: ThemeType; name: string; colors: ThemeColors }> {
    return [
      { id: 'light', name: 'Clair', colors: themes.light },
      { id: 'dark', name: 'Sombre', colors: themes.dark },
      { id: 'professional', name: 'Professionnel', colors: themes.professional },
      { id: 'blue', name: 'Bleu Garage', colors: themes.blue },
    ];
  }
  
  // Réinitialiser au thème par défaut
  async resetTheme(): Promise<boolean> {
    return await this.setTheme('light');
  }
}

// Instance singleton
export const themeService = new ThemeService();
export default themeService;