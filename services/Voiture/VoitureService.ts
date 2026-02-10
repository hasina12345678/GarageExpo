import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth } from '../firebase';

export interface Voiture {
  id?: string;
  idUtilisateur: string;
  matricule: string;
  marque?: string;
  modele?: string;
  annee?: number;
  dateAjout?: Date;
}

export default {
  // Récupérer toutes les voitures de l'utilisateur connecté
  getVoitures: async (): Promise<Voiture[]> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const voituresRef = collection(db, 'voitures');
      const q = query(voituresRef, where('idUtilisateur', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const voitures: Voiture[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        voitures.push({
          id: doc.id,
          ...data,
          dateAjout: data.dateAjout?.toDate(),
        } as Voiture);
      });
      
      return voitures;
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures:', error);
      throw error;
    }
  },

  // Ajouter une nouvelle voiture
  ajouterVoiture: async (voitureData: Omit<Voiture, 'id' | 'idUtilisateur' | 'dateAjout'>): Promise<Voiture> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Validation du matricule (format: 1234TAB ou 1234-TAB-123)
      const matriculeRegex = /^[0-9]{3,4}[A-Z]{2,3}[0-9]{0,3}$|^[0-9]{3,4}-[A-Z]{2,3}-[0-9]{0,3}$/i;
      if (!matriculeRegex.test(voitureData.matricule.toUpperCase())) {
        throw new Error('Format de matricule invalide. Exemples: 1234TAB, 1234-TAB-123');
      }

      // Vérifier si la voiture existe déjà pour cet utilisateur
      const voituresRef = collection(db, 'voitures');
      const q = query(
        voituresRef, 
        where('idUtilisateur', '==', user.uid),
        where('matricule', '==', voitureData.matricule.toUpperCase())
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Une voiture avec ce matricule existe déjà');
      }

      const nouvelleVoiture: Omit<Voiture, 'id'> = {
        idUtilisateur: user.uid,
        matricule: voitureData.matricule.toUpperCase(),
        marque: voitureData.marque || '',
        modele: voitureData.modele || '',
        annee: voitureData.annee,
        dateAjout: new Date(),
      };

      const docRef = await addDoc(voituresRef, {
        ...nouvelleVoiture,
        dateAjout: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...nouvelleVoiture,
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la voiture:', error);
      throw error;
    }
  },

// Supprimer une voiture
supprimerVoiture: async (voitureId: string): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    // VÉRIFICATION SIMPLIFIÉE - Sans inégalité
    const pannesRef = collection(db, 'pannes');
    const q = query(pannesRef, where('idVoiture', '==', voitureId));
    
    const querySnapshot = await getDocs(q);
    
    // Vérifier manuellement si des pannes ont statut ≠ 3
    let aDesPannesNonTerminees = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.idStatutForPanne && data.idStatutForPanne !== '3') {
        aDesPannesNonTerminees = true;
      }
    });
    
    if (aDesPannesNonTerminees) {
      throw new Error('Impossible de supprimer cette voiture car elle a des pannes en cours');
    }

    // Supprimer la voiture
    const voitureRef = doc(db, 'voitures', voitureId);
    await deleteDoc(voitureRef);

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la voiture:', error);
    throw error;
  }
},

// MODIFIER AUSSI la fonction peutSupprimerVoiture :
peutSupprimerVoiture: async (voitureId: string): Promise<{ peutSupprimer: boolean; message?: string }> => {
  try {
    const pannesRef = collection(db, 'pannes');
    const q = query(pannesRef, where('idVoiture', '==', voitureId));
    
    const querySnapshot = await getDocs(q);
    
    // Si pas de pannes du tout, on peut supprimer
    if (querySnapshot.empty) {
      return { peutSupprimer: true };
    }

    // Vérifier manuellement les statuts
    let aDesPannesNonTerminees = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.idStatutForPanne && data.idStatutForPanne !== '3') {
        aDesPannesNonTerminees = true;
      }
    });

    if (aDesPannesNonTerminees) {
      return { 
        peutSupprimer: false, 
        message: 'Cette voiture a des pannes en cours. Terminez-les avant de supprimer.' 
      };
    }

    return { peutSupprimer: true };
  } catch (error) {
    console.error('Erreur lors de la vérification de suppression:', error);
    return { peutSupprimer: false, message: 'Erreur lors de la vérification' };
  }
},
  // Formater le matricule pour l'affichage
  formaterMatricule: (matricule: string): string => {
    if (!matricule) return '';
    
    // Si le matricule contient des tirets, on les garde
    if (matricule.includes('-')) {
      return matricule.toUpperCase();
    }
    
    // Sinon, on formate: 1234TAB → 1234-TAB
    const matriculeUpper = matricule.toUpperCase();
    const match = matriculeUpper.match(/^([0-9]{3,4})([A-Z]{2,3})([0-9]{0,3})$/);
    
    if (match) {
      const [, chiffres, lettres, fin] = match;
      if (fin) {
        return `${chiffres}-${lettres}-${fin}`;
      }
      return `${chiffres}-${lettres}`;
    }
    
    return matriculeUpper;
  },

  // Calculer l'âge de la voiture
  calculerAgeVoiture: (annee?: number): string => {
    if (!annee) return 'Inconnu';
    
    const anneeActuelle = new Date().getFullYear();
    const age = anneeActuelle - annee;
    
    if (age === 0) return 'Neuve';
    if (age === 1) return '1 an';
    return `${age} ans`;
  },
};