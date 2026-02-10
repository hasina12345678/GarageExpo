// styles/Probleme.css.js
import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Components, Shadows } from './Common.css';

const ProblemeStyles = StyleSheet.create({
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
  
  // Section sélection voiture
  sectionContainer: {
    backgroundColor: Colors.white,
    marginTop: Sizes.lg,
    marginHorizontal: Sizes.lg,
    borderRadius: 12,
    padding: Sizes.lg,
    ...Shadows.subtle,
  },
  sectionTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
  },
  
  // Sélecteur voiture
  voitureSelector: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.white,
  },
  voitureSelectorPlaceholder: {
    fontSize: Fonts.body,
    color: Colors.gray400,
  },
  voitureSelectorValue: {
    fontSize: Fonts.body,
    color: Colors.gray800,
    fontWeight: '500',
  },
  voitureInfo: {
    marginTop: Sizes.sm,
  },
  voitureText: {
    fontSize: Fonts.small,
    color: Colors.gray600,
  },
  
  // Liste des types de panne
  panneTypesContainer: {
    marginTop: Sizes.md,
  },
  panneTypeItem: {
    ...Layout.row,
    ...Layout.alignCenter,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 8,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
  },
  panneTypeItemSelected: {
    backgroundColor: Colors.blue + '10',
    borderColor: Colors.blue,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.gray400,
    marginRight: Sizes.md,
    ...Layout.center,
  },
  checkboxSelected: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  checkIcon: {
    color: Colors.white,
    fontSize: Fonts.body,
  },
  panneTypeInfo: {
    flex: 1,
  },
  panneTypeName: {
    fontSize: Fonts.body,
    fontWeight: '500',
    color: Colors.gray800,
    marginBottom: Sizes.xs,
  },
  panneTypeDescription: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    marginBottom: Sizes.xs,
  },
  panneTypeDetails: {
    ...Layout.row,
    ...Layout.spaceBetween,
  },
  panneTypeDetail: {
    fontSize: Fonts.small,
    color: Colors.gray500,
  },
  panneTypePrice: {
    fontSize: Fonts.small,
    fontWeight: '600',
    color: Colors.success,
  },
  
  // Estimation résumé
  estimationContainer: {
    backgroundColor: Colors.white,
    marginTop: Sizes.lg,
    marginHorizontal: Sizes.lg,
    borderRadius: 12,
    padding: Sizes.lg,
    ...Shadows.subtle,
  },
  estimationTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
  },
  estimationRow: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginBottom: Sizes.sm,
  },
  estimationLabel: {
    fontSize: Fonts.body,
    color: Colors.gray600,
  },
  estimationValue: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.gray800,
  },
  estimationTotal: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginTop: Sizes.md,
    paddingTop: Sizes.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  estimationTotalLabel: {
    fontSize: Fonts.h4,
    fontWeight: 'bold',
    color: Colors.gray800,
  },
  estimationTotalValue: {
    fontSize: Fonts.h4,
    fontWeight: 'bold',
    color: Colors.blue,
  },
  estimationDetails: {
    marginTop: Sizes.md,
  },
  estimationDetailItem: {
    ...Layout.row,
    ...Layout.spaceBetween,
    paddingVertical: Sizes.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  estimationDetailName: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    flex: 2,
  },
  estimationDetailDuree: {
    fontSize: Fonts.small,
    color: Colors.gray500,
    flex: 1,
    textAlign: 'right',
  },
  estimationDetailPrix: {
    fontSize: Fonts.small,
    color: Colors.success,
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  
  // Bouton déclarer
  buttonContainer: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.xl,
  },
  declarerButton: {
    ...Components.button,
    width: '100%',
  },
  declarerButtonText: {
    ...Components.buttonText,
  },
  declarerButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  
  // Modal confirmation
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
  confirmationMessage: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Sizes.lg,
    lineHeight: 22,
  },
  confirmationDetails: {
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    padding: Sizes.md,
    marginBottom: Sizes.lg,
  },
  confirmationDetailRow: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginBottom: Sizes.xs,
  },
  confirmationDetailLabel: {
    fontSize: Fonts.small,
    color: Colors.gray600,
  },
  confirmationDetailValue: {
    fontSize: Fonts.small,
    fontWeight: '500',
    color: Colors.gray800,
  },
  buttonRow: {
    ...Layout.row,
    width: '100%',
  },
  confirmButton: {
    ...Components.button,
    flex: 1,
    marginRight: Sizes.sm,
  },
  cancelButton: {
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
  cancelButtonText: {
    color: Colors.gray700,
    fontSize: Fonts.body,
    fontWeight: '600',
  },
  
  // État vide (pas de voitures)
  emptyState: {
    ...Layout.center,
    paddingVertical: Sizes.xl * 2,
    paddingHorizontal: Sizes.lg,
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
    marginBottom: Sizes.sm,
  },
  emptyStateSubtext: {
    fontSize: Fonts.small,
    color: Colors.gray400,
    textAlign: 'center',
    marginBottom: Sizes.lg,
  },
  emptyStateButton: {
    ...Components.button,
    marginTop: Sizes.md,
  },
  emptyStateButtonText: {
    ...Components.buttonText,
  },
  
  // Loading
  loadingContainer: {
    ...Layout.center,
    flex: 1,
  },
  
  // Error
  errorContainer: {
    backgroundColor: Colors.danger + '10',
    borderRadius: 8,
    padding: Sizes.md,
    marginHorizontal: Sizes.lg,
    marginTop: Sizes.lg,
  },
  errorText: {
    color: Colors.danger,
    fontSize: Fonts.small,
    textAlign: 'center',
  },
  
  // Success
  successContainer: {
    backgroundColor: Colors.success + '10',
    borderRadius: 8,
    padding: Sizes.md,
    marginHorizontal: Sizes.lg,
    marginTop: Sizes.lg,
  },
  successText: {
    color: Colors.success,
    fontSize: Fonts.small,
    textAlign: 'center',
  },
});

export default ProblemeStyles;