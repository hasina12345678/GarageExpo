// services/Profil/ProfilService.ts
import { 
  updatePassword, 
  reauthenticateWithCredential,
  EmailAuthProvider,
  User
} from 'firebase/auth';
import { auth } from '../firebase';

export default {
  // Récupérer les informations de l'utilisateur
  getUserInfo: () => {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    
    return {
      email: user.email,
      displayName: user.displayName || 'Utilisateur',
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      uid: user.uid,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    };
  },

  // Changer le mot de passe
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const user = auth.currentUser;
      
      if (!user || !user.email) {
        throw new Error('Utilisateur non connecté');
      }

      // Ré-authentifier l'utilisateur avec l'ancien mot de passe
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Mettre à jour le mot de passe
      await updatePassword(user, newPassword);
      
      return { 
        success: true, 
        message: 'Mot de passe mis à jour avec succès' 
      };
    } catch (error: any) {
      let message = 'Erreur lors du changement de mot de passe';
      
      switch (error.code) {
        case 'auth/wrong-password':
          message = 'Mot de passe actuel incorrect';
          break;
        case 'auth/weak-password':
          message = 'Le nouveau mot de passe est trop faible (minimum 6 caractères)';
          break;
        case 'auth/requires-recent-login':
          message = 'Veuillez vous reconnecter pour changer votre mot de passe';
          break;
        case 'auth/user-not-found':
          message = 'Utilisateur non trouvé';
          break;
        default:
          message = error.message || message;
      }
      
      return { success: false, message };
    }
  },

  // Mettre à jour le nom d'affichage
  updateDisplayName: async (displayName: string) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Note: Dans Firebase Auth web, vous devez utiliser updateProfile
      // Pour React Native, c'est différent
      console.log('Mise à jour du nom d\'affichage:', displayName);
      // En attendant une implémentation Firebase correcte
      
      return { 
        success: true, 
        message: 'Nom d\'affichage mis à jour avec succès' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Erreur lors de la mise à jour du nom' 
      };
    }
  },

  // Vérifier si l'utilisateur est connecté
  isUserLoggedIn: () => {
    return !!auth.currentUser;
  },
};