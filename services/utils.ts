import { auth } from './firebase';

export const extractUsernameFromEmail = (): string => {
  try {
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      return "Utilisateur";
    }
    
    const email = user.email;
    const usernamePart = email.split('@')[0];
    
    const formattedName = usernamePart
      .split('.')
      .map((part: string) => {
        if (part.length === 0) return '';
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(' ');
    
    return formattedName || "Utilisateur";
    
  } catch (error) {
    console.error('Erreur lors de la récupération du nom:', error);
    return "Utilisateur";
  }
};