// services/Probleme/ProblemeService.ts
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth } from '../firebase';

export interface PanneType {
  id?: string;
  nom: string;
  duree: number; // en heures
  prix: number;
  description?: string;
}

export interface Panne {
  id?: string;
  idVoiture: string;
  dateHeure: Date;
}

export interface PanneDetails {
  id?: string;
  idPanne: string;
  idPanneType: string;
}

export interface PanneStatut {
  id?: string;
  idPanne: string;
  idStatutForPanne: string;
  dateHeure?: Date;
}

export interface Voiture {
  id: string;
  matricule: string;
  marque?: string;
  modele?: string;
}

export default {
  // Récupérer toutes les voitures de l'utilisateur
  getVoitures: async (): Promise<Voiture[]> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      const voituresRef = collection(db, 'voitures');
      const q = query(voituresRef, where('idUtilisateur', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const voitures: Voiture[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        voitures.push({
          id: doc.id,
          matricule: data.matricule || '',
          marque: data.marque,
          modele: data.modele,
        });
      });
      
      return voitures;
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures:', error);
      throw error;
    }
  },

  // Récupérer tous les types de panne
  getPanneTypes: async (): Promise<PanneType[]> => {
    try {
      const panneTypesRef = collection(db, 'panneTypes');
      const querySnapshot = await getDocs(panneTypesRef);
      
      const panneTypes: PanneType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        panneTypes.push({
          id: doc.id,
          nom: data.nom || '',
          duree: data.duree || 0,
          prix: data.prix || 0,
          description: data.description,
        });
      });
      
      // Trier par nom
      return panneTypes.sort((a, b) => a.nom.localeCompare(b.nom));
    } catch (error) {
      console.error('Erreur lors de la récupération des types de panne:', error);
      throw error;
    }
  },

  // Déclarer une nouvelle panne
  declarerPanne: async (
    idVoiture: string, 
    panneTypeIds: string[]
  ): Promise<{ success: boolean; message: string; panneId?: string }> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      // Vérifier que la voiture appartient à l'utilisateur
      const voitureRef = doc(db, 'voitures', idVoiture);
      const voitureDoc = await getDoc(voitureRef);
      
      if (!voitureDoc.exists()) {
        throw new Error('Voiture non trouvée');
      }

      const voitureData = voitureDoc.data();
      if (voitureData.idUtilisateur !== user.uid) {
        throw new Error('Cette voiture ne vous appartient pas');
      }

      // 1. Créer la panne principale
      const nouvellePanne: Omit<Panne, 'id'> = {
        idVoiture,
        dateHeure: new Date()
      };

      const panneRef = await addDoc(collection(db, 'pannes'), {
        ...nouvellePanne,
        dateHeure: serverTimestamp(),
      });

      const panneId = panneRef.id;

      // 2. Créer les détails de panne pour chaque type sélectionné
      for (const panneTypeId of panneTypeIds) {
        const panneDetails: Omit<PanneDetails, 'id'> = {
          idPanne: panneId,
          idPanneType: panneTypeId,
        };

        await addDoc(collection(db, 'panneDetails'), panneDetails);
      }

      // 3. Créer le statut de la panne (non réparé)
      const panneStatut: Omit<PanneStatut, 'id'> = {
        idPanne: panneId,
        idStatutForPanne: '1', // non réparé
        dateHeure: new Date(),
      };

      await addDoc(collection(db, 'panneStatuts'), {
        ...panneStatut,
        dateHeure: serverTimestamp(),
      });

      // 4. Mettre à jour la panne avec le statut
      // (optionnel, si vous voulez garder le statut dans la panne aussi)

      return { 
        success: true, 
        message: 'Panne déclarée avec succès',
        panneId 
      };
    } catch (error: any) {
      console.error('Erreur lors de la déclaration de panne:', error);
      return { 
        success: false, 
        message: error.message || 'Erreur lors de la déclaration de panne'
      };
    }
  },

  // Calculer l'estimation totale (durée et prix)
  calculerEstimation: async (panneTypeIds: string[]): Promise<{ 
    dureeTotale: number; 
    prixTotal: number;
    details: Array<{
      nom: string;
      duree: number;
      prix: number;
    }>;
  }> => {
    try {
      let dureeTotale = 0; // en heures
      let prixTotal = 0;
      const details: Array<{ nom: string; duree: number; prix: number }> = [];

      for (const panneTypeId of panneTypeIds) {
        const panneTypeRef = doc(db, 'panneTypes', panneTypeId);
        const panneTypeDoc = await getDoc(panneTypeRef);
        
        if (panneTypeDoc.exists()) {
          const data = panneTypeDoc.data();
          const duree = data.duree || 0;
          const prix = data.prix || 0;
          
          dureeTotale += duree;
          prixTotal += prix;
          
          details.push({
            nom: data.nom || 'Type inconnu',
            duree,
            prix,
          });
        }
      }

      return { dureeTotale, prixTotal, details };
    } catch (error) {
      console.error('Erreur lors du calcul de l\'estimation:', error);
      return { dureeTotale: 0, prixTotal: 0, details: [] };
    }
  },

  // Formater la durée (heures/minutes)
  formaterDuree: (dureeHeures: number): string => {
    if (dureeHeures < 1) {
      const minutes = Math.round(dureeHeures * 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    const heures = Math.floor(dureeHeures);
    const minutes = Math.round((dureeHeures - heures) * 60);
    
    if (minutes === 0) {
      return `${heures} heure${heures > 1 ? 's' : ''}`;
    }
    
    return `${heures}h${minutes > 0 ? `${minutes}min` : ''}`;
  },

  // Formater le prix
  formaterPrix: (prix: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(prix);
  },

  // Vérifier si l'utilisateur a des voitures
  aDesVoitures: async (): Promise<boolean> => {
    try {
      const voitures = await problemeService.getVoitures();
      return voitures.length > 0;
    } catch (error) {
      return false;
    }
  },
};

// Instance pour l'auto-référence
const problemeService = {
  getVoitures: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    
    const voituresRef = collection(db, 'voitures');
    const q = query(voituresRef, where('idUtilisateur', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Voiture[];
  }
};

export { problemeService };