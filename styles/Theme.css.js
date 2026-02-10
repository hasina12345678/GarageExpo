// styles/Theme.css.js
import { StyleSheet } from 'react-native';
import { defaultColors as Colors, Fonts, Sizes, Layout, Shadows } from './Common.css';

const ThemeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Sizes.xl,
  },
  headerContainer: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
    backgroundColor: Colors.white,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    ...Shadows.subtle,
  },
  backButton: {
    padding: Sizes.sm,
  },
  headerTitle: {
    fontSize: Fonts.h2,
    fontWeight: 'bold',
    color: Colors.gray800,
  },
  contentContainer: {
    padding: Sizes.lg,
  },
  sectionTitle: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.sm,
  },
  sectionDescription: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    marginBottom: Sizes.xl,
    lineHeight: 22,
  },
  themesList: {
    marginBottom: Sizes.xl,
  },
  themeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    borderWidth: 2,
    borderColor: Colors.gray200,
    ...Shadows.subtle,
  },
  themeCardActive: {
    borderColor: Colors.blue,
    borderWidth: 2,
  },
  themeHeader: {
    ...Layout.row,
    ...Layout.alignCenter,
    marginBottom: Sizes.lg,
  },
  themeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    ...Layout.center,
    marginRight: Sizes.md,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: Fonts.h4,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.xs,
  },
  themeStatus: {
    fontSize: Fonts.small,
    color: Colors.gray500,
  },
  colorPreview: {
    ...Layout.row,
    ...Layout.wrap,
    marginTop: Sizes.sm,
  },
  colorBox: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
    ...Layout.center,
    ...Shadows.subtle,
  },
  colorLabel: {
    fontSize: Fonts.xsmall,
    color: Colors.white,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoCard: {
    ...Layout.row,
    backgroundColor: Colors.blue + '10',
    borderRadius: 12,
    padding: Sizes.lg,
    borderWidth: 1,
    borderColor: Colors.blue + '30',
  },
  infoIcon: {
    marginRight: Sizes.md,
    marginTop: Sizes.xs,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.blue,
    marginBottom: Sizes.sm,
  },
  infoText: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    lineHeight: 18,
  },
});

export default ThemeStyles;