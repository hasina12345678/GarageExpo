import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Components, Shadows } from './Common.css';

const ProfilStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
	marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Sizes.xl,
  },
  
  // Header avec avatar
  headerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Sizes.xl,
    ...Layout.center,
    ...Shadows.subtle,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.blue,
    ...Layout.center,
    marginBottom: Sizes.md,
  },
  avatarText: {
    fontSize: Fonts.h1,
    fontWeight: 'bold',
    color: Colors.white,
  },
  userName: {
    fontSize: Fonts.h2,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.xs,
  },
  userEmail: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    marginBottom: Sizes.sm,
  },
  userRole: {
    fontSize: Fonts.small,
    color: Colors.gray500,
    backgroundColor: Colors.gray100,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.xs,
    borderRadius: 12,
  },
  
  // Section des informations
  sectionContainer: {
    marginTop: Sizes.lg,
    marginHorizontal: Sizes.lg,
  },
  sectionTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
    paddingHorizontal: Sizes.sm,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    ...Shadows.subtle,
  },
  infoRow: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
    paddingVertical: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    flex: 1,
  },
  infoValue: {
    fontSize: Fonts.body,
    color: Colors.gray800,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  infoIcon: {
    marginRight: Sizes.sm,
    color: Colors.gray500,
  },
  
  // Formulaire changement de mot de passe
  passwordForm: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Sizes.lg,
    marginTop: Sizes.md,
    ...Shadows.subtle,
  },
  formTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.lg,
  },
  formLabel: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    marginBottom: Sizes.xs,
    fontWeight: '500',
  },
  formInput: {
    ...Components.input,
    marginBottom: Sizes.md,
    width: '100%',
  },
  errorText: {
    color: Colors.danger,
    fontSize: Fonts.small,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  successText: {
    color: Colors.success,
    fontSize: Fonts.small,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  submitButton: {
    ...Components.button,
    width: '100%',
    marginTop: Sizes.md,
  },
  submitButtonText: {
    ...Components.buttonText,
  },
  cancelButton: {
    backgroundColor: Colors.gray200,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.lg,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: Sizes.sm,
  },
  cancelButtonText: {
    color: Colors.gray700,
    fontSize: Fonts.body,
    fontWeight: '600',
  },
  
  // Actions supplémentaires
  actionsContainer: {
    marginTop: Sizes.xl,
    paddingHorizontal: Sizes.lg,
  },
  actionButton: {
    ...Layout.row,
    ...Layout.alignCenter,
    backgroundColor: Colors.white,
    padding: Sizes.lg,
    borderRadius: 12,
    marginBottom: Sizes.sm,
    ...Shadows.subtle,
  },
  actionIcon: {
    marginRight: Sizes.md,
    color: Colors.gray600,
  },
  actionText: {
    fontSize: Fonts.body,
    color: Colors.gray700,
    fontWeight: '500',
    flex: 1,
  },
  actionArrow: {
    color: Colors.gray400,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: Sizes.lg,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Sizes.xl,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.lg,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Sizes.md,
    right: Sizes.md,
    padding: Sizes.sm,
  },
  userIdText: {
    fontSize: Fonts.xsmall,
    color: Colors.gray600,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: 12,
    marginTop: Sizes.xs,
  },
  verifiedText: {
    fontSize: Fonts.xsmall,
    color: Colors.success,
    marginLeft: Sizes.xs,
    fontWeight: '500',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfilStyles;