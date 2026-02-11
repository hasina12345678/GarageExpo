import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Components, Shadows } from './Common.css';

const AccueilStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Sizes.xl,
  },
  
  // Header de bienvenue
  welcomeContainer: {
    backgroundColor: Colors.blue,
    paddingVertical: Sizes.xl,
    paddingHorizontal: Sizes.lg,
  },
  welcomeTitle: {
    fontSize: Fonts.h1,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Sizes.xs,
  },
  welcomeSubtitle: {
    fontSize: Fonts.body,
    color: Colors.blueLight,
  },
  
  // Statistiques
  statsContainer: {
    backgroundColor: Colors.white,
    marginTop: -Sizes.lg,
    marginHorizontal: Sizes.lg,
    borderRadius: 12,
    padding: Sizes.lg,
    ...Shadows.medium,
  },
  statsTitle: {
    fontSize: Fonts.h4,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
  },
  statsGrid: {
    ...Layout.row,
    ...Layout.spaceBetween,
  },
  statCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    padding: Sizes.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Sizes.xs,
  },
  statValue: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.blue,
    marginBottom: Sizes.xs,
  },
  statLabel: {
    fontSize: Fonts.xsmall,
    color: Colors.gray600,
    textAlign: 'center',
  },
  
  // Section pannes en cours
  sectionContainer: {
    marginTop: Sizes.xl,
    marginHorizontal: Sizes.lg,
  },
  sectionHeader: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
    marginBottom: Sizes.md,
  },
  sectionTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray700,
  },
  sectionCount: {
    fontSize: Fonts.body,
    color: Colors.gray500,
    backgroundColor: Colors.gray100,
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.xs,
    borderRadius: 12,
  },
  
  // Liste des pannes
  panneList: {
    marginBottom: Sizes.xl,
  },
  
  // Carte panne
  panneCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Sizes.md,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  panneHeader: {
    backgroundColor: Colors.gray50,
    padding: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  panneHeaderRow: {
    ...Layout.row,
    ...Layout.spaceBetween,
    ...Layout.alignCenter,
    marginBottom: Sizes.xs,
  },
  panneTitle: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.gray800,
    flex: 1,
  },
  panneDate: {
    fontSize: Fonts.xsmall,
    color: Colors.gray500,
  },
  panneVehicule: {
    fontSize: Fonts.small,
    color: Colors.gray600,
  },
  
  // Détails de la panne
  panneDetails: {
    padding: Sizes.md,
	width: '95%',
  },
  detailItem: {
    ...Layout.row,
    ...Layout.spaceBetween,
    paddingVertical: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  detailName: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    flex: 2,
  },
  detailInfo: {
    ...Layout.row,
    flex: 1,
    justifyContent: 'space-between',
  },
  detailDuree: {
    fontSize: Fonts.small,
    color: Colors.gray500,
    textAlign: 'right',
    width: 60,
  },
  detailPrix: {
    fontSize: Fonts.small,
    color: Colors.success,
    fontWeight: '500',
    textAlign: 'right',
    width: 80,
  },
  
  // Total panne
  panneTotal: {
    ...Layout.row,
    ...Layout.spaceBetween,
    padding: Sizes.md,
    backgroundColor: Colors.gray50,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
  },
  totalLabel: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.gray700,
  },
  totalDuree: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.blue,
  },
  totalPrix: {
    fontSize: Fonts.body,
    fontWeight: 'bold',
    color: Colors.success,
  },
  
  // État vide
  emptyState: {
    ...Layout.center,
    paddingVertical: Sizes.xl * 2,
    paddingHorizontal: Sizes.lg,
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
  },
  
  // Loading
  loadingContainer: {
    ...Layout.center,
    flex: 1,
  },
  
  // Refresh control
  refreshControl: {
    backgroundColor: Colors.gray50,
  },
});

export default AccueilStyles;