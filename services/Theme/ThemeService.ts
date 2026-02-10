// services/Theme/ThemeService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'professional' | 'blue' | 'orange';

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
  // Thème orange (par défaut)
  orange: {
    primary: '#F7931e',
    secondary: '#F9A742',
    accent: '#4A5568',
    accentLight: '#718096',
    border: '#E0E0E0',
    surface: '#FFFFFF',
    blue: '#F7931e',
    blueDark: '#D47A1A',
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    success: '#38A169',
    warning: '#D69E2E',
    danger: '#E53E3E',
    info: '#4299E1',
    background: '#FFFFFF',
    text: '#212121',
    textSecondary: '#616161',
    card: '#FFFFFF',
  },
  
  // Thème clair
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
  
  // Thème professionnel
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
  
  // Thème bleu garage
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
  private currentTheme: ThemeType = 'orange';
  
  constructor() {
    this.loadTheme();
  }
  
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
  
  getCurrentTheme(): ThemeType {
    return this.currentTheme;
  }
  
  getColors(): ThemeColors {
    return themes[this.currentTheme];
  }
  
  getTheme(theme: ThemeType): ThemeColors {
    return themes[theme];
  }
  
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
  
  getAvailableThemes(): Array<{ id: ThemeType; name: string; colors: ThemeColors }> {
    return [
      { id: 'orange', name: 'Orange Garage', colors: themes.orange },
      { id: 'light', name: 'Clair', colors: themes.light },
      { id: 'professional', name: 'Professionnel', colors: themes.professional },
      { id: 'blue', name: 'Bleu Garage', colors: themes.blue },
    ];
  }
  
  async resetTheme(): Promise<boolean> {
    return await this.setTheme('orange');
  }
}

export const themeService = new ThemeService();
export default themeService;