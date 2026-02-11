import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Shadows } from './Common.css';

const NotificationStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  
  // Header de la page
  header: {
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
  
  headerTitle: {
    fontSize: Fonts.h2,
    fontWeight: 'bold',
    color: Colors.gray800,
  },

  headerSubtitle: {
   fontSize: Fonts.body,
    color: Colors.gray600,
  },
  
  headerActions: {
    ...Layout.row,
    ...Layout.alignCenter,
  },
  
  // Liste des notifications
  listContainer: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
  },
  
  // Carte de notification individuelle
  notificationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    ...Shadows.subtle,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue,
    backgroundColor: Colors.blue + '10', 
  },
  
  // En-tête de la carte 
  notificationHeader: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
    marginBottom: Sizes.sm,
  },
  
  titleContainer: {
    ...Layout.row,
    ...Layout.alignCenter,
    flex: 1,
  },
  
  notificationIcon: {
    marginRight: Sizes.sm,
    color: Colors.gray500,
  },
  
  notificationTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.gray800,
    flex: 1,
  },
  
  deleteButton: {
    padding: Sizes.xs,
    marginLeft: Sizes.sm,
  },
  
  // Corps de la notification
  notificationText: {
    fontSize: Fonts.body,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: Sizes.sm,
  },
  
  // Pied de la notification (date + badge)
  notificationFooter: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
  },
  
  dateText: {
    fontSize: Fonts.small,
    color: Colors.gray500,
    fontStyle: 'italic',
  },
  
  unreadBadge: {
    backgroundColor: Colors.blue,
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: 4,
  },
  
  unreadBadgeText: {
    fontSize: Fonts.xsmall,
    color: Colors.white,
    fontWeight: '600',
  },
  
  // État vide 
  emptyState: {
    ...Layout.center,
    paddingHorizontal: Sizes.xl,
    paddingTop: Sizes.xxxl * 2,
    alignItems: 'center',
  },
  
  emptyStateIcon: {
    fontSize: Fonts.h1 * 2,
    color: Colors.gray300,
    marginBottom: Sizes.lg,
  },
  
  emptyStateTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray600,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  
  emptyStateText: {
    fontSize: Fonts.body,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Sizes.xl,
  },
  
  // Bouton pour charger plus ou retour
  actionButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: Sizes.xl,
    paddingVertical: Sizes.md,
    borderRadius: 8,
    ...Shadows.subtle,
  },
  
  actionButtonText: {
    color: Colors.white,
    fontSize: Fonts.body,
    fontWeight: '600',
  },
  
  // Modal de confirmation
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    ...Layout.center,
    paddingHorizontal: Sizes.lg,
  },
  
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Sizes.xl,
    width: '100%',
    maxWidth: 400,
  },
  
  modalTitle: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.md,
    textAlign: 'center',
  },
  
  modalMessage: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    marginBottom: Sizes.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  modalButtons: {
    ...Layout.row,
    ...Layout.spaceBetween,
  },
  
  modalButton: {
    flex: 1,
    paddingVertical: Sizes.md,
    borderRadius: 8,
    ...Layout.center,
  },
  
  modalCancelButton: {
    backgroundColor: Colors.gray200,
    marginRight: Sizes.sm,
  },
  
  modalConfirmButton: {
    backgroundColor: Colors.danger,
    marginLeft: Sizes.sm,
  },
  
  modalButtonText: {
    fontSize: Fonts.body,
    fontWeight: '600',
  },
  
  modalCancelButtonText: {
    color: Colors.gray700,
  },
  
  modalConfirmButtonText: {
    color: Colors.white,
  },
  
  // Indicateur de chargement
  loadingContainer: {
    ...Layout.center,
    paddingVertical: Sizes.xl * 2,
  },
  
  loadingText: {
    fontSize: Fonts.body,
    color: Colors.gray500,
    marginTop: Sizes.md,
  },
  
  // Styles pour les différentes types de notifications
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Sizes.sm,
  },
  
  typeReparation: {
    backgroundColor: Colors.success,
  },
  
  typePaiement: {
    backgroundColor: Colors.info,
  },
  
  typeUrgent: {
    backgroundColor: Colors.danger,
  },
 
  dateGroup: {
    marginBottom: Sizes.lg,
  },
  
  dateGroupTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.gray600,
    marginBottom: Sizes.md,
    paddingHorizontal: Sizes.lg,
  },
  
  // Actions rapides
  quickActions: {
    ...Layout.row,
    ...Layout.spaceBetween,
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  
  quickActionButton: {
    ...Layout.row,
    ...Layout.center,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  
  quickActionText: {
    fontSize: Fonts.small,
    color: Colors.gray700,
    marginLeft: Sizes.xs,
  },
  
  // Filtres
  filterContainer: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  
  filterTitle: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.sm,
  },
  
  filterChips: {
    ...Layout.row,
    ...Layout.wrap,
  },
  
  filterChip: {
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.xs,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
  },
  
  filterChipActive: {
    backgroundColor: Colors.blue,
  },
  
  filterChipText: {
    fontSize: Fonts.small,
    color: Colors.gray700,
  },
  
  filterChipTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default NotificationStyles;