// styles/Theme.css.js
import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Shadows } from './Common.css';

const ThemeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Sizes.xl,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Sizes.lg,
    paddingHorizontal: Sizes.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
  },
  sectionTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray800,
    marginBottom: Sizes.sm,
  },
  sectionDescription: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    marginBottom: Sizes.xl,
    lineHeight: 20,
  },
  themesList: {
    marginBottom: Sizes.xl,
  },
  themeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    ...Shadows.subtle,
  },
  themeCardActive: {
    borderWidth: 2,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.lg,
  },
  themeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.md,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: Fonts.h4,
    fontWeight: 'bold',
    marginBottom: Sizes.xs,
  },
  themeStatus: {
    fontSize: Fonts.small,
    color: Colors.gray500,
  },
  colorPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorBox: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.sm,
  },
  colorLabel: {
    fontSize: Fonts.xsmall,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: Sizes.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: Sizes.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.gray800,
    marginBottom: Sizes.sm,
  },
  infoText: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    lineHeight: 18,
  },
});

export default ThemeStyles;