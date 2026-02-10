import { Dimensions } from 'react-native';
import { Platform } from 'react-native';
import themeService from '../services/Theme/ThemeService';

const { width, height } = Dimensions.get('window');

export const getColors = () => themeService.getColors();

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

export const getComponents = () => {
  const colors = getColors();
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
      ...getShadows().subtle,
    },
  };
};

export const Components = getComponents();

export { Platform };