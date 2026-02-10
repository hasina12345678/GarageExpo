// styles/Navbar.css.js
import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Shadows } from './Common.css';

const NavbarStyles = StyleSheet.create({
  // Container principal - 100% width
  container: {
    width: '100%',
    backgroundColor: Colors.white,
    borderBottomWidth: 0,
    borderBottomColor: Colors.border,
    ...Shadows.subtle,
    marginTop: Sizes.md,
  },
  
  // Header (première ligne avec logo et paramètres)
  header: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
    paddingHorizontal: Sizes.xl,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.white,
    width: '100%',
  },
  
  // Logo/Title à gauche - sans icône
  logoContainer: {
    ...Layout.row,
    ...Layout.alignCenter,
  },
  logoText: {
    fontSize: Fonts.h3,
    fontWeight: '700',
    color: Colors.gray800,
    letterSpacing: -0.3,
    marginTop: 5, 
  },
  
  // Paramètres/User menu à droite
  settingsContainer: {
    ...Layout.row,
    ...Layout.alignCenter,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    ...Layout.center,
  },
  settingsIcon: {
    fontSize: Fonts.h2,
    color: Colors.gray600,
  },
  
  // Navigation principale - 100% width
  navContainer: {
    ...Layout.row,
    ...Layout.spaceBetween,
    paddingHorizontal: 0, // Pas de padding horizontal pour 100% width
    paddingVertical: Sizes.sm,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    width: '100%',
  },
  
  // Items de navigation - distribution égale
  navItem: {
    ...Layout.column,
    ...Layout.center,
    flex: 1, // Chaque item prend 1 part égale
    paddingVertical: Sizes.sm,
    minHeight: 60,
  },
  navItemActive: {
    backgroundColor: Colors.gray50,
  },
  navIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 14,
    backgroundColor: Colors.gray100,
    ...Layout.center,
    marginBottom: Sizes.xs,
    position: 'relative', // Important pour le positionnement du badge
  },
  navIconContainerActive: {
    backgroundColor: Colors.blue,
  },
  navIcon: {
    fontSize: Fonts.h2,
    color: Colors.gray600,
  },
  navIconActive: {
    color: Colors.white,
  },
  navText: {
    fontSize: Fonts.xsmall,
    fontWeight: '500',
    color: Colors.gray600,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  navTextActive: {
    color: Colors.blue,
    fontWeight: '600',
  },
  
  // Menu déroulant des paramètres
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    right: Sizes.lg,
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: 12,
    ...Shadows.medium,
    zIndex: 1000,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  dropdownItem: {
    ...Layout.row,
    ...Layout.alignCenter,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownIcon: {
    marginRight: Sizes.sm,
    fontSize: Fonts.body,
    color: Colors.gray500,
    width: 20,
  },
  dropdownText: {
    fontSize: Fonts.body,
    color: Colors.gray700,
    flex: 1,
  },
  
  // Overlay pour fermer le dropdown
  overlay: {
    ...Layout.absoluteFill,
    zIndex: 999,
    backgroundColor: 'transparent',
  },

  // === NOUVEAUX STYLES POUR LES NOTIFICATIONS ===
  
  // Badge de notification (petit point rouge)
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    ...Shadows.subtle,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  
  // Badge de notification avec compteur
  notificationBadgeWithCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    ...Shadows.subtle,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  
  // Texte du badge
  badgeText: {
    color: Colors.white,
    fontSize: Fonts.xsmall - 2,
    fontWeight: '800',
    lineHeight: Fonts.xsmall - 1,
  },
  
  // Badge minimal (juste un point)
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1,
    borderColor: Colors.white,
  },
});

export default NavbarStyles;