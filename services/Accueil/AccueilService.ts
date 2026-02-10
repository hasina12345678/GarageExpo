import { db } from '../firebase';
import { 
  collection, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { auth } from '../firebase';

export interface PanneEnCours {
  id: string;
  idVoiture: string;
  dateDeclaration: Date;
  matriculeVoiture: string;
  marqueVoiture?: string;
  modeleVoiture?: string;
  detailsPannes: Array<{
    nom: string;
    duree: number; 
    prix: number;
  }>;
  dureeTotale: number; 
  prixTotal: number;
  statut: string;
}

export interface Statistiques {
  totalPannesEnCours: number;
  totalDureeEstimee: number; 
  totalCoutEstime: number;
  voitureLaPlusReparee?: {
    matricule: string;
    nombrePannes: number;
  };
}

export default {
  
  getPannesEnCours: async (): Promise<PanneEnCours[]> => {
    try {
      const pannes = await fetchPannesUtilisateur();
      const pannesAvecDetails = await enrichirPannesAvecDetails(pannes);
      return trierPannesParDate(pannesAvecDetails);
    } catch (error) {
      console.error('Erreur lors de la récupération des pannes en cours:', error);
      throw error;
    }
  },

  getStatistiques: (pannesEnCours: PanneEnCours[]): Statistiques => {
    return calculerStatistiques(pannesEnCours);
  },

  formaterDuree: (dureeHeures: number): string => {
    return formaterDureeLisible(dureeHeures);
  },

  formaterPrix: (prix: number): string => {
    return formaterPrixLisible(prix);
  },

  formaterDate: (date: Date): string => {
    return formaterDateLisible(date);
  },

  aDesPannesEnCours: async (): Promise<boolean> => {
    try {
      const pannes = await fetchPannesUtilisateur();
      return pannes.length > 0;
    } catch (error) {
      return false;
    }
  },
};

async function getStatutPanneActuel(idPanne: string): Promise<string | null> {
  try {
    const statutsRef = collection(db, 'panneStatuts');
    const qStatuts = query(
      statutsRef,
      where('idPanne', '==', idPanne)
    );
    
    const statutsSnapshot = await getDocs(qStatuts);
    
    if (statutsSnapshot.empty) {
      return null; 
    }
    
    let statutLePlusRecent: string | null = null;
    let dateStatutPlusRecent: Date = new Date(0);
    
    statutsSnapshot.forEach((docStatut) => {
      const statutData = docStatut.data();
      const dateStatut = statutData.dateHeure?.toDate() || new Date(0);
      
      if (dateStatut > dateStatutPlusRecent) {
        dateStatutPlusRecent = dateStatut;
        statutLePlusRecent = statutData.idStatutForPanne;
      }
    });
    
    return statutLePlusRecent;
  } catch (error) {
    console.error(`Erreur récupération statut panne ${idPanne}:`, error);
    return null;
  }
}

async function fetchPannesUtilisateur(): Promise<any[]> {
  const user = auth.currentUser;
  if (!user) throw new Error('Utilisateur non connecté');

  const voituresRef = collection(db, 'voitures');
  const qVoitures = query(voituresRef, where('idUtilisateur', '==', user.uid));
  const voituresSnapshot = await getDocs(qVoitures);
  
  const voituresMap = new Map();
  voituresSnapshot.forEach((doc) => {
    voituresMap.set(doc.id, {
      matricule: doc.data().matricule,
      marque: doc.data().marque,
      modele: doc.data().modele,
    });
  });

  const pannesRef = collection(db, 'pannes');
  const qPannes = query(pannesRef, orderBy('dateHeure', 'desc'));
  
  const pannesSnapshot = await getDocs(qPannes);
  const pannesUtilisateur: any[] = [];

  for (const docPanne of pannesSnapshot.docs) {
    const panneData = docPanne.data();
    const voitureInfo = voituresMap.get(panneData.idVoiture);

    if (!voitureInfo) {
      continue;
    }

    const statutActuel = await getStatutPanneActuel(docPanne.id);

    if (statutActuel === '1') {
      pannesUtilisateur.push({
        id: docPanne.id,
        idVoiture: panneData.idVoiture,
        dateDeclaration: panneData.dateHeure?.toDate() || new Date(),
        matriculeVoiture: voitureInfo.matricule,
        marqueVoiture: voitureInfo.marque,
        modeleVoiture: voitureInfo.modele,
        statut: 'En cours',
      });
    }
  }

  return pannesUtilisateur;
}

async function enrichirPannesAvecDetails(pannes: any[]): Promise<PanneEnCours[]> {
  const pannesEnCours: PanneEnCours[] = [];
  
  for (const panne of pannes) {

    const detailsRef = collection(db, 'panneDetails');
    const qDetails = query(detailsRef, where('idPanne', '==', panne.id));
    const detailsSnapshot = await getDocs(qDetails);

    const detailsPannes: Array<{ nom: string; duree: number; prix: number }> = [];
    let dureeTotale = 0;
    let prixTotal = 0;

    for (const detailDoc of detailsSnapshot.docs) {
      const detailData = detailDoc.data();
      const panneTypeRef = doc(db, 'panneTypes', detailData.idPanneType);
      const panneTypeDoc = await getDoc(panneTypeRef);
      
      if (panneTypeDoc.exists()) {
        const panneTypeData = panneTypeDoc.data();
        detailsPannes.push({
          nom: panneTypeData.nom,
          duree: panneTypeData.duree || 0,
          prix: panneTypeData.prix || 0,
        });
        dureeTotale += panneTypeData.duree || 0;
        prixTotal += panneTypeData.prix || 0;
      }
    }

    pannesEnCours.push({
      ...panne,
      detailsPannes,
      dureeTotale,
      prixTotal,
    });
  }

  return pannesEnCours;
}

function trierPannesParDate(pannes: PanneEnCours[]): PanneEnCours[] {
  return pannes.sort((a, b) => b.dateDeclaration.getTime() - a.dateDeclaration.getTime());
}

function calculerStatistiques(pannesEnCours: PanneEnCours[]): Statistiques {
  let totalDureeEstimee = 0;
  let totalCoutEstime = 0;
  const voituresCompteur = new Map<string, number>();

  pannesEnCours.forEach((panne) => {
    totalDureeEstimee += panne.dureeTotale;
    totalCoutEstime += panne.prixTotal;
    
    const count = voituresCompteur.get(panne.matriculeVoiture) || 0;
    voituresCompteur.set(panne.matriculeVoiture, count + 1);
  });

  let voitureLaPlusReparee = undefined;
  let maxPannes = 0;
  
  voituresCompteur.forEach((nombre, matricule) => {
    if (nombre > maxPannes) {
      maxPannes = nombre;
      voitureLaPlusReparee = { matricule, nombrePannes: nombre };
    }
  });

  return {
    totalPannesEnCours: pannesEnCours.length,
    totalDureeEstimee,
    totalCoutEstime,
    voitureLaPlusReparee,
  };
}

function formaterDureeLisible(dureeHeures: number): string {
  if (dureeHeures < 1) {
    const minutes = Math.round(dureeHeures * 60);
    return `${minutes} min`;
  }
  
  const heures = Math.floor(dureeHeures);
  const minutes = Math.round((dureeHeures - heures) * 60);
  
  if (minutes === 0) {
    return `${heures} h`;
  }
  
  if (heures === 0) {
    return `${minutes} min`;
  }
  
  return `${heures}h${minutes > 0 ? ` ${minutes}min` : ''}`;
}

function formaterPrixLisible(prix: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
  }).format(prix);
}

function formaterDateLisible(date: Date): string {
  const aujourdhui = new Date();
  const hier = new Date(aujourdhui);
  hier.setDate(aujourdhui.getDate() - 1);

  if (date.toDateString() === aujourdhui.toDateString()) {
    return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  if (date.toDateString() === hier.toDateString()) {
    return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  const diffJours = Math.floor((aujourdhui.getTime() - date.getTime()) / (1000 * 3600 * 24));
  if (diffJours < 7) {
    return `Il y a ${diffJours} jour${diffJours > 1 ? 's' : ''}`;
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}