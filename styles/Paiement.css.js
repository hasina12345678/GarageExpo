// styles/Paiement.css.js
import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Components, Shadows } from './Common.css';

const PaiementStyles = StyleSheet.create({
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
  
  // Section sélection panne
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
  
  // Sélecteur panne
  panneSelector: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.white,
  },
  panneSelectorPlaceholder: {
    fontSize: Fonts.body,
    color: Colors.gray400,
  },
  panneSelectorValue: {
    fontSize: Fonts.body,
    color: Colors.gray800,
    fontWeight: '500',
  },
  
  // Détails de la panne sélectionnée
  panneDetailsContainer: {
    marginTop: Sizes.md,
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    padding: Sizes.md,
  },
  panneDetailRow: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginBottom: Sizes.xs,
  },
  panneDetailLabel: {
    fontSize: Fonts.small,
    color: Colors.gray600,
  },
  panneDetailValue: {
    fontSize: Fonts.small,
    fontWeight: '500',
    color: Colors.gray800,
  },
  panneDetailTotal: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginTop: Sizes.sm,
    paddingTop: Sizes.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray300,
  },
  panneDetailTotalLabel: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.gray700,
  },
  panneDetailTotalValue: {
    fontSize: Fonts.body,
    fontWeight: 'bold',
    color: Colors.blue,
  },
  panneDetailRestant: {
    fontSize: Fonts.body,
    fontWeight: 'bold',
    color: Colors.success,
  },
  
  // Liste des détails de pannes
  detailsList: {
    marginTop: Sizes.sm,
  },
  detailItem: {
    ...Layout.row,
    ...Layout.spaceBetween,
    paddingVertical: Sizes.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailName: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    flex: 2,
  },
  detailPrix: {
    fontSize: Fonts.small,
    color: Colors.success,
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  
  // Section montant
  montantContainer: {
    backgroundColor: Colors.white,
    marginTop: Sizes.lg,
    marginHorizontal: Sizes.lg,
    borderRadius: 12,
    padding: Sizes.lg,
    ...Shadows.subtle,
  },
  montantTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
  },
  montantInput: {
    ...Components.input,
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Sizes.md,
  },
  suggestionsContainer: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginTop: Sizes.md,
  },
  suggestionButton: {
    backgroundColor: Colors.gray100,
    paddingVertical: Sizes.sm,
    paddingHorizontal: Sizes.md,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: Sizes.xs,
    ...Layout.center,
  },
  suggestionButtonText: {
    fontSize: Fonts.small,
    color: Colors.gray700,
    fontWeight: '500',
  },
  suggestionButtonActive: {
    backgroundColor: Colors.blue,
  },
  suggestionButtonTextActive: {
    color: Colors.white,
  },
  
  // Résumé du paiement
  resumeContainer: {
    backgroundColor: Colors.white,
    marginTop: Sizes.lg,
    marginHorizontal: Sizes.lg,
    borderRadius: 12,
    padding: Sizes.lg,
    ...Shadows.subtle,
  },
  resumeTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
  },
  resumeRow: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginBottom: Sizes.sm,
  },
  resumeLabel: {
    fontSize: Fonts.body,
    color: Colors.gray600,
  },
  resumeValue: {
    fontSize: Fonts.body,
    fontWeight: '500',
    color: Colors.gray800,
  },
  resumeTotal: {
    ...Layout.row,
    ...Layout.spaceBetween,
    marginTop: Sizes.md,
    paddingTop: Sizes.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  resumeTotalLabel: {
    fontSize: Fonts.h4,
    fontWeight: 'bold',
    color: Colors.gray800,
  },
  resumeTotalValue: {
    fontSize: Fonts.h4,
    fontWeight: 'bold',
    color: Colors.success,
  },
  
  // Bouton payer
  buttonContainer: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.xl,
  },
  payerButton: {
    ...Components.button,
    width: '100%',
  },
  payerButtonText: {
    ...Components.buttonText,
  },
  payerButtonDisabled: {
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
  
  // État vide (pas de pannes à payer)
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

export default PaiementStyles;