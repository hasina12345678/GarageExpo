import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes, Layout, Shadows } from './Common.css';

const ETUStyles = StyleSheet.create({
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
  
  // Header
  headerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Sizes.xl,
    ...Layout.center,
    ...Shadows.subtle,
    marginBottom: Sizes.lg,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray100,
    ...Layout.center,
    marginBottom: Sizes.md,
  },
  headerTitle: {
    fontSize: Fonts.h2,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: 'center',
    paddingHorizontal: Sizes.lg,
  },
  
  // Section
  sectionContainer: {
    marginHorizontal: Sizes.lg,
    marginBottom: Sizes.xl,
  },
  sectionTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
    paddingHorizontal: Sizes.sm,
  },
  
  // Carte étudiant
  etudiantCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Sizes.lg,
    marginBottom: Sizes.md,
    ...Shadows.subtle,
  },
  cardHeader: {
    ...Layout.row,
    ...Layout.alignCenter,
    marginBottom: Sizes.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    ...Layout.center,
    marginRight: Sizes.md,
  },
  avatarText: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.white,
  },
  nameContainer: {
    flex: 1,
  },
  etudiantName: {
    fontSize: Fonts.h4,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.xs,
  },
  etudiantRole: {
    fontSize: Fonts.small,
    color: Colors.gray600,
    backgroundColor: Colors.gray100,
    paddingHorizontal: Sizes.sm,
    paddingVertical: Sizes.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  // Informations étudiant
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Sizes.md,
  },
  infoRow: {
    ...Layout.row,
    ...Layout.alignCenter,
    ...Layout.spaceBetween,
    paddingVertical: Sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoItem: {
    ...Layout.row,
    ...Layout.alignCenter,
    flex: 1,
  },
  infoIcon: {
    marginRight: Sizes.sm,
  },
  infoLabel: {
    fontSize: Fonts.body,
    color: Colors.gray600,
  },
  infoValue: {
    fontSize: Fonts.body,
    color: Colors.gray800,
    fontWeight: '500',
  },
  emailText: {
    fontSize: Fonts.small,
    color: Colors.blue,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  
  // Section projet
  projectContainer: {
    marginHorizontal: Sizes.lg,
    marginBottom: Sizes.xl,
  },
  projectTitle: {
    fontSize: Fonts.h3,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.md,
    paddingHorizontal: Sizes.sm,
  },
  projectCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Sizes.lg,
    ...Shadows.subtle,
    ...Layout.center,
  },
  projectIcon: {
    marginBottom: Sizes.md,
  },
  projectName: {
    fontSize: Fonts.h3,
    fontWeight: 'bold',
    color: Colors.gray800,
    marginBottom: Sizes.sm,
  },
  projectDescription: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Sizes.lg,
  },
  projectTech: {
    width: '100%',
  },
  techTitle: {
    fontSize: Fonts.body,
    fontWeight: '600',
    color: Colors.gray700,
    marginBottom: Sizes.sm,
  },
  techTags: {
    ...Layout.row,
    ...Layout.wrap,
  },
  techTag: {
    backgroundColor: Colors.blue + '20',
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.xs,
    borderRadius: 16,
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
  },
  techTagText: {
    fontSize: Fonts.small,
    color: Colors.blue,
    fontWeight: '500',
  },
  
  // Bouton retour
  backButton: {
    ...Layout.row,
    ...Layout.center,
    backgroundColor: Colors.blue,
    paddingVertical: Sizes.md,
    paddingHorizontal: Sizes.xl,
    borderRadius: 8,
    marginHorizontal: Sizes.lg,
    marginTop: Sizes.sm,
    ...Shadows.subtle,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: Fonts.body,
    fontWeight: '600',
    marginLeft: Sizes.sm,
  },
  
  // Styles additionnels
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ETUStyles;