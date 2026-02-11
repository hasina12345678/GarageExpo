import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Components, Shadows } from './Common.css';

const VoitureStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Sizes.xl,
  },
  
  // Header
  headerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Sizes.lg,
    paddingHorizontal: Sizes.lg,
    ...Shadows.subtle,
  },
  headerTitle: {
    fontSize: Fonts.h2,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.xs,
  },
  headerSubtitle: {
    fontSize: Fonts.body,
    color: Colors.gray600,
  },
  
  // Bouton ajouter
  addButtonContainer: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
  },
  addButton: {
    ...Layout.row,
    ...Layout.center,
    backgroundColor: Colors.blue,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.lg,
    borderRadius: 10,
    ...Shadows.medium,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: Fonts.body,
    fontWeight: '600',
    marginLeft: Sizes.sm,
  },
  
  // Liste des voitures
  voitureList: {
    paddingHorizontal: Sizes.lg,
  },
  emptyState: {
    ...Layout.center,
    paddingVertical: Sizes.xl * 2,
	marginTop: 100,
  },
  emptyStateIcon: {
    fontSize: Fonts.h1 * 2,
    color: Colors.gray400,
    marginBottom: Sizes.md,
  },
  emptyStateText: {
    fontSize: Fonts.h4,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: Sizes.xs,
  },
  emptyStateSubtext: {
    fontSize: Fonts.small,
    color: Colors.gray400,
    textAlign: 'center',
  },
  
  // Carte voiture
  voitureCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    ...Shadows.subtle,
  },
  voitureHeader: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
    marginBottom: Sizes.md,
  },
  matriculeContainer: {
    backgroundColor: Colors.blue,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.xs,
    borderRadius: 8,
  },
  matriculeText: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 1,
  },
  deleteButton: {
    padding: Sizes.xs,
  },
  deleteIcon: {
    fontSize: Fonts.h3,
    color: Colors.gray400,
  },
  
  // Info voiture
  infoContainer: {
    marginBottom: Sizes.md,
  },
  infoRow: {
    ...Layout.row,
    marginBottom: Sizes.sm,
  },
  infoIcon: {
    marginRight: Sizes.sm,
    color: Colors.gray500,
    width: 20,
  },
  infoLabel: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    width: 100,
    
  },
  infoValue: {
    fontSize: Fonts.body,
    color: Colors.gray800,
    fontWeight: '500',
    flex: 1,
    marginLeft:145
  },
  
  // Statut pannes
  panneStatusContainer: {
    ...Layout.row,
    ...Layout.alignCenter,
    backgroundColor: Colors.gray100,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: 8,
  },
  panneStatusIcon: {
    marginRight: Sizes.sm,
  },
  panneStatusText: {
    fontSize: Fonts.small,
    fontWeight: '500',
  },
  panneStatusSuccess: {
    color: Colors.success,
  },
  panneStatusWarning: {
    color: Colors.warning,
  },
  panneStatusDanger: {
    color: Colors.danger,
  },
  
  // Modal ajout/modification
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
  formContainer: {
    marginTop: Sizes.sm,
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
  },
  formRow: {
    ...Layout.row,
    marginBottom: Sizes.md,
  },
  formHalf: {
    flex: 1,
    marginRight: Sizes.sm,
  },
  formHalfLast: {
    marginRight: 0,
  },
  errorText: {
    color: Colors.danger,
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
  
  // Modal confirmation suppression
  confirmationModal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Sizes.xl,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: Fonts.h1 * 1.5,
    color: Colors.warning,
    marginBottom: Sizes.lg,
  },
  confirmationTitle: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  confirmationMessage: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Sizes.lg,
    lineHeight: 20,
  },
  buttonRow: {
    ...Layout.row,
    width: '100%',
  },
  confirmButton: {
    ...Components.button,
    backgroundColor: Colors.danger,
    flex: 1,
    marginRight: Sizes.sm,
  },
  cancelConfirmButton: {
    backgroundColor: Colors.gray200,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.lg,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  confirmButtonText: {
    ...Components.buttonText,
  },
  cancelConfirmButtonText: {
    color: Colors.gray700,
    fontSize: Fonts.body,
    fontWeight: '600',
  },
  
  // Loading
  loadingContainer: {
    ...Layout.center,
    flex: 1,
  },
});

export default VoitureStyles;