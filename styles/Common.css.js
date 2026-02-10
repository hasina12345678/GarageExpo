// styles/Common.css.js
import { Dimensions } from 'react-native';
import { Platform } from 'react-native';
import themeService from '../services/Theme/ThemeService';

const { width, height } = Dimensions.get('window');

// Récupérer les couleurs dynamiques du thème actuel
export const getColors = () => themeService.getColors();

// Les couleurs par défaut (thème light) pour compatibilité
export const defaultColors = {
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
};

// Fonction pour obtenir dynamiquement les couleurs
export const Colors = getColors();

export const Fonts = {
  h1: Math.min(width * 0.09, 32),
  h2: Math.min(width * 0.07, 24),
  h3: Math.min(width * 0.055, 20),
  h4: Math.min(width * 0.045, 16),
  body: Math.min(width * 0.04, 14),
  small: Math.min(width * 0.035, 12),
  xsmall: Math.min(width * 0.03, 10),
};

export const Sizes = {
  screenWidth: width,
  screenHeight: height,
  xs: Math.max(width * 0.01, 4),
  sm: Math.max(width * 0.02, 8),
  md: Math.max(width * 0.03, 12),
  lg: Math.max(width * 0.04, 16),
  xl: Math.max(width * 0.05, 20),
  xxl: Math.max(width * 0.06, 24),
  xxxl: Math.max(width * 0.08, 32),
  full: '100%',
  half: '50%',
  third: '33.33%',
  quarter: '25%',
  fifth: '20%',
  tenth: '10%',
};

export const Layout = {
  flex: { flex: 1 },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  center: { alignItems: 'center', justifyContent: 'center' },
  centerVertical: { justifyContent: 'center' },
  centerHorizontal: { alignItems: 'center' },
  spaceBetween: { justifyContent: 'space-between' },
  spaceAround: { justifyContent: 'space-around' },
  wrap: { flexWrap: 'wrap' },
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
};

// Fonction pour obtenir les shadows dynamiquement
export const getShadows = () => {
  const colors = getColors();
  return {
    subtle: {
      shadowColor: colors.gray700,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: colors.gray700,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    strong: {
      shadowColor: colors.gray700,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  };
};

export const Shadows = getShadows();

// Fonction pour obtenir les components dynamiquement
export const getComponents = () => {
  const colors = getColors();
  const currentShadows = getShadows();
  
  return {
    button: {
      backgroundColor: colors.blue,
      paddingVertical: Sizes.md,
      paddingHorizontal: Sizes.lg,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: colors.white,
      fontSize: Fonts.body,
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.gray300,
      backgroundColor: colors.white,
      borderRadius: 6,
      paddingVertical: Sizes.sm,
      paddingHorizontal: Sizes.md,
      fontSize: Fonts.body,
      color: colors.gray700,
    },
    card: {
      backgroundColor: colors.card || colors.white,
      borderRadius: 8,
      padding: Sizes.lg,
      ...currentShadows.subtle,
    },
  };
};

export const Components = getComponents();

export { Platform };