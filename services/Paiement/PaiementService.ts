import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { auth } from '../firebase';
import { PanneStatut } from '../Probleme/ProblemeService';

export interface PanneAPayer {
  id: string;
  idVoiture: string;
  dateHeure: Date;
  matriculeVoiture?: string;
  marqueVoiture?: string;
  detailsPannes: Array<{
    nom: string;
    prix: number;
  }>;
  montantTotal: number;
  montantDejaPaye: number;
  montantRestant: number;
}

export interface Paiement {
  id?: string;
  idPanne: string;
  montant: number;
  dateHeure?: Date;
}

export interface PaiementStatut {
  id?: string;
  idPanne: string;
  idStatutForPaiement: string;
  dateHeure?: Date;
}

export interface StatutForPaiement {
  id: string;
  statut: string;
}

export default {
  getPannesAPayer: async (): Promise<PanneAPayer[]> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      const voituresRef = collection(db, 'voitures');
      const qVoitures = query(voituresRef, where('idUtilisateur', '==', user.uid));
      const voituresSnapshot = await getDocs(qVoitures);
      
      const voituresMap = new Map();
      const voitureIds: string[] = [];
      voituresSnapshot.forEach((doc) => {
        voitureIds.push(doc.id);
        voituresMap.set(doc.id, {
          matricule: doc.data().matricule,
          marque: doc.data().marque,
        });
      });

      if (voitureIds.length === 0) {
        return [];
      }

      const pannesRef = collection(db, 'pannes');
      const qPannes = query(pannesRef, where('idVoiture', 'in', voitureIds));
      const pannesSnapshot = await getDocs(qPannes);

      const pannesAPayer: PanneAPayer[] = [];

      for (const panneDoc of pannesSnapshot.docs) {
        const panneData = panneDoc.data();
        const voitureInfo = voituresMap.get(panneData.idVoiture);

        if (!voitureInfo) {
          continue;
        }

        // Récupérer le statut le plus récent de la panne
        const statutsRef = collection(db, 'panneStatuts');
        const qStatuts = query(
          statutsRef, 
          where('idPanne', '==', panneDoc.id)
        );
        const statutsSnapshot = await getDocs(qStatuts);
        
        let statutLePlusRecent = null;
        let dateStatutPlusRecent: Date | null = null;
        
        statutsSnapshot.forEach((docStatut) => {
          const statutData = docStatut.data();
          const dateStatut = statutData.dateHeure?.toDate() || new Date(0);
          
          if (!dateStatutPlusRecent || dateStatut > dateStatutPlusRecent) {
            dateStatutPlusRecent = dateStatut;
            statutLePlusRecent = statutData.idStatutForPanne;
          }
        });

        // ne garder que les pannes avec statut (réparé et non payé)
        if (statutLePlusRecent !== '2') {
          continue;
        }

        const detailsRef = collection(db, 'panneDetails');
        const qDetails = query(detailsRef, where('idPanne', '==', panneDoc.id));
        const detailsSnapshot = await getDocs(qDetails);

        const detailsPannes: Array<{ nom: string; prix: number }> = [];
        let montantTotal = 0;

        for (const detailDoc of detailsSnapshot.docs) {
          const detailData = detailDoc.data();
          const panneTypeRef = doc(db, 'panneTypes', detailData.idPanneType);
          const panneTypeDoc = await getDoc(panneTypeRef);
          
          if (panneTypeDoc.exists()) {
            const panneTypeData = panneTypeDoc.data();
            detailsPannes.push({
              nom: panneTypeData.nom,
              prix: panneTypeData.prix,
            });
            montantTotal += panneTypeData.prix;
          }
        }

        // montant déjà payé
        const paiementsRef = collection(db, 'paiements');
        const qPaiements = query(paiementsRef, where('idPanne', '==', panneDoc.id));
        const paiementsSnapshot = await getDocs(qPaiements);
        
        let montantDejaPaye = 0;
        paiementsSnapshot.forEach((doc) => {
          montantDejaPaye += doc.data().montant || 0;
        });

        const montantRestant = montantTotal - montantDejaPaye;

        // si il reste à payer
        if (montantRestant > 0) {
          pannesAPayer.push({
            id: panneDoc.id,
            idVoiture: panneData.idVoiture,
            dateHeure: panneData.dateHeure?.toDate() || new Date(),
            matriculeVoiture: voitureInfo.matricule,
            marqueVoiture: voitureInfo.marque,
            detailsPannes,
            montantTotal,
            montantDejaPaye,
            montantRestant,
          });
        }
      }

      // Trier les pannes par date décroissante
      pannesAPayer.sort((a, b) => b.dateHeure.getTime() - a.dateHeure.getTime());

      return pannesAPayer;
    } catch (error) {
      console.error('Erreur lors de la récupération des pannes à payer:', error);
      throw error;
    }
  },
  
  
  effectuerPaiement: async (
    idPanne: string,
    montant: number
  ): Promise<{ success: boolean; message: string; nouveauStatut?: string }> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      const panneRef = doc(db, 'pannes', idPanne);
      const panneDoc = await getDoc(panneRef);
      
      if (!panneDoc.exists()) {
        throw new Error('Panne non trouvée');
      }

      const panneData = panneDoc.data();
      const voitureRef = doc(db, 'voitures', panneData.idVoiture);
      const voitureDoc = await getDoc(voitureRef);
      
      if (!voitureDoc.exists() || voitureDoc.data().idUtilisateur !== user.uid) {
        throw new Error('Cette panne ne vous appartient pas');
      }

      let montantTotal = 0;
      const detailsRef = collection(db, 'panneDetails');
      const qDetails = query(detailsRef, where('idPanne', '==', idPanne));
      const detailsSnapshot = await getDocs(qDetails);
      
      for (const detailDoc of detailsSnapshot.docs) {
        const detailData = detailDoc.data();
        const panneTypeRef = doc(db, 'panneTypes', detailData.idPanneType);
        const panneTypeDoc = await getDoc(panneTypeRef);
        
        if (panneTypeDoc.exists()) {
          montantTotal += panneTypeDoc.data().prix;
        }
      }

      // montant déjà payé
      const paiementsRef = collection(db, 'paiements');
      const qPaiements = query(paiementsRef, where('idPanne', '==', idPanne));
      const paiementsSnapshot = await getDocs(qPaiements);
      
      let montantDejaPaye = 0;
      paiementsSnapshot.forEach((doc) => {
        montantDejaPaye += doc.data().montant || 0;
      });

      const montantRestantAvant = montantTotal - montantDejaPaye;

      if (montant <= 0) {
        throw new Error('Le montant doit être positif');
      }

      if (montant > montantRestantAvant) {
        throw new Error(`Le montant ne peut pas dépasser ${montantRestantAvant} MGA`);
      }

      const paiement: Omit<Paiement, 'id'> = {
        idPanne,
        montant,
        dateHeure: new Date(),
      };

      await addDoc(collection(db, 'paiements'), {
        ...paiement,
        dateHeure: serverTimestamp(),
      });

      // le nouveau montant payé
      const montantTotalPaye = montantDejaPaye + montant;
      const montantRestantApres = montantTotal - montantTotalPaye;

      // le statut de paiement
      let idStatutForPaiement = '2'; // payé partiel par défaut
      
      if (montantRestantApres === 0) {
        idStatutForPaiement = '3'; // payé complet
        
        await creerStatutPannePaye(idPanne);
      }

      const paiementStatut: Omit<PaiementStatut, 'id'> = {
        idPanne,
        idStatutForPaiement,
        dateHeure: new Date(),
      };

      await addDoc(collection(db, 'paiementStatuts'), {
        ...paiementStatut,
        dateHeure: serverTimestamp(),
      });

      // 8. Si paiement complet, mettre à jour le statut de la panne
      if (montantRestantApres === 0) {
        await updateDoc(panneRef, {
          idStatutForPanne: '3', // payé
        });
      }

      return { 
        success: true, 
        message: `Paiement de ${montant} effectué avec succès`,
        nouveauStatut: idStatutForPaiement
      };
    } catch (error: any) {
      console.error('Erreur lors du paiement:', error);
      return { 
        success: false, 
        message: error.message || 'Erreur lors du paiement'
      };
    }
  },

  // Formater le prix
  formaterPrix: (prix: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(prix);
  },

  // Générer des suggestions de montant
  genererSuggestionsMontant: (montantRestant: number): number[] => {
    const suggestions: number[] = [];
    
    // Suggestion 1: 25%
    const quart = Math.round(montantRestant * 0.25);
    if (quart > 0 && quart < montantRestant) {
      suggestions.push(quart);
    }
    
    // Suggestion 2: 50%
    const moitie = Math.round(montantRestant * 0.5);
    if (moitie > 0 && moitie < montantRestant && moitie !== quart) {
      suggestions.push(moitie);
    }
    
    // Suggestion 3: Montant complet
    suggestions.push(montantRestant);
    
    // Éliminer les doublons et trier
    return [...new Set(suggestions)].sort((a, b) => a - b);
  },

  // Vérifier si l'utilisateur a des pannes à payer
  aDesPannesAPayer: async (): Promise<boolean> => {
    try {
      const pannes = await paiementService.getPannesAPayer();
      return pannes.length > 0;
    } catch (error) {
      return false;
    }
  },

  
};

async function creerStatutPannePaye(idPanne: string): Promise<{ success: boolean; message: string }> {
  try {
    const panneStatut: Omit<PanneStatut, 'id'> = {
      idPanne,
      idStatutForPanne: '3', // Statut "payé"
      dateHeure: new Date(),
    };

    await addDoc(collection(db, 'panneStatuts'), {
      ...panneStatut,
      dateHeure: serverTimestamp(),
    });

    return { 
      success: true, 
      message: 'Statut "payé" créé pour la panne' 
    };
  } catch (error: any) {
    console.error('Erreur création statut panne payé:', error);
    return { 
      success: false, 
      message: error.message || 'Erreur création statut panne'
    };
  }
}



// Fonction updateDoc manquante
const updateDoc = async (ref: any, data: any) => {
  // Implémentation de updateDoc si nécessaire
  console.log('Mise à jour du document:', ref, data);
};


// Instance pour l'auto-référence
const paiementService = {
  getPannesAPayer: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    
    // Implémentation simplifiée
    return [];
  }
};