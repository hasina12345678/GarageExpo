import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { sendPushNotification } from './PushNotificationService';

export interface Notification {
  id?: string;
  idUtilisateur: string;
  idPanne: string;
  titre: string;
  texte: string;
  dateHeure: Date | any;
  vue: boolean;
  alreadyPush: boolean;
}

async function getVoitureInfo(idVoiture: string): Promise<{ matricule: string; marque?: string } | null> {
  try {
    const voitureRef = doc(db, 'voitures', idVoiture);
    const voitureDoc = await getDoc(voitureRef);
    
    if (voitureDoc.exists()) {
      const data = voitureDoc.data();
      return {
        matricule: data.matricule || 'Inconnu',
        marque: data.marque
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur récupération info voiture:', error);
    return null;
  }
}

function formaterDatePourNotification(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default {
  checkNotificationExists: async (idUtilisateur: string, idPanne: string): Promise<boolean> => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('idUtilisateur', '==', idUtilisateur),
        where('idPanne', '==', idPanne)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Erreur vérification notification:', error);
      return false;
    }
  },

  createReparationNotification: async (idPanne: string, dateStatut: Date): Promise<{ success: boolean; message: string }> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      const panneRef = doc(db, 'pannes', idPanne);
      const panneDoc = await getDoc(panneRef);
      
      if (!panneDoc.exists()) {
        throw new Error('Panne non trouvée');
      }

      const panneData = panneDoc.data();
      
      const voitureInfo = await getVoitureInfo(panneData.idVoiture);
      if (!voitureInfo) {
        throw new Error('Voiture non trouvée');
      }

      const voitureRef = doc(db, 'voitures', panneData.idVoiture);
      const voitureDoc = await getDoc(voitureRef);
      
      if (!voitureDoc.exists() || voitureDoc.data().idUtilisateur !== user.uid) {
        return { success: false, message: 'Cette panne ne vous appartient pas' };
      }

      const exists = await notificationService.checkNotificationExists(user.uid, idPanne);
      if (exists) {
        return { success: false, message: 'Notification déjà existante' };
      }

      const titre = `🚗 ${voitureInfo.matricule}${voitureInfo.marque ? ` (${voitureInfo.marque})` : ''} réparé !`;
      const texte = `Votre véhicule est réparé. Vous pouvez procéder au paiement. Réparé le ${formaterDatePourNotification(dateStatut)}`;

      const notification: Omit<Notification, 'id'> = {
        idUtilisateur: user.uid,
        idPanne,
        titre,
        texte,
        dateHeure: dateStatut,
        vue: false,
        alreadyPush: false,
      };

      await addDoc(collection(db, 'notifications'), {
        ...notification,
        dateHeure: serverTimestamp(),
      });

      return { success: true, message: 'Notification créée' };
    } catch (error: any) {
      console.error('Erreur création notification:', error);
      return { success: false, message: error.message };
    }
  },

  getNotifications: async (): Promise<Notification[]> => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('idUtilisateur', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      const notifications: Notification[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          dateHeure: data.dateHeure?.toDate() || new Date(),
        } as Notification);
      });

      return notifications.sort((a, b) => 
        b.dateHeure.getTime() - a.dateHeure.getTime()
      );
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return [];
    }
  },

  setupPanneStatutListener: (callback?: (notification: Notification) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const statutsRef = collection(db, 'panneStatuts');
    const q = query(
      statutsRef,
      where('idStatutForPanne', '==', '2')
    );

    return onSnapshot(q, async (snapshot) => {
      const changes = snapshot.docChanges();
      
      const sortedChanges = changes.sort((a, b) => {
        const dateA = a.doc.data().dateHeure?.toDate() || new Date(0);
        const dateB = b.doc.data().dateHeure?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      for (const change of sortedChanges) {
        if (change.type === 'added') {
          const statutData = change.doc.data();
          const idPanne = statutData.idPanne;
          const dateStatut = statutData.dateHeure?.toDate() || new Date(); 

          const panneRef = doc(db, 'pannes', idPanne);
          const panneDoc = await getDoc(panneRef);
          
          if (!panneDoc.exists()) continue;
          
          const panneData = panneDoc.data();
          
          const voitureInfo = await getVoitureInfo(panneData.idVoiture);
          if (!voitureInfo) continue;
          
          const voitureRef = doc(db, 'voitures', panneData.idVoiture);
          const voitureDoc = await getDoc(voitureRef);
          
          if (!voitureDoc.exists() || voitureDoc.data().idUtilisateur !== user.uid) {
            continue;
          }

          const exists = await notificationService.checkNotificationExists(user.uid, idPanne);
          if (exists) continue;

          const titre = `🚗 ${voitureInfo.matricule}${voitureInfo.marque ? ` (${voitureInfo.marque})` : ''} réparé !`;
          const texte = `Votre véhicule est réparé. Vous pouvez procéder au paiement. Réparé le ${formaterDatePourNotification(dateStatut)}`;

          const notification: Omit<Notification, 'id'> = {
            idUtilisateur: user.uid,
            idPanne,
            titre,
            texte,
            dateHeure: dateStatut,
            vue: false,
            alreadyPush: false,
          };

          const docRef = await addDoc(collection(db, 'notifications'), {
            ...notification,
            dateHeure: serverTimestamp(),
          });

          const newNotification = {
            id: docRef.id,
            ...notification,
          };

          try {
            await sendPushNotification(
              titre, 
              `Véhicule réparé. Paiement disponible.`,
              { 
                idPanne, 
                type: 'reparation',
                matricule: voitureInfo.matricule,
                marque: voitureInfo.marque || ''
              }
            );
            
            await updateDoc(doc(db, 'notifications', docRef.id), {
              alreadyPush: true,
            });
          } catch (error) {
            console.error('Erreur envoi notification push:', error);
          }

          if (callback) {
            callback(newNotification as Notification);
          }
        }
      }
    });
  },

  markAsViewed: async (notificationId: string): Promise<boolean> => {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      await updateDoc(doc(db, 'notifications', notificationId), {
        vue: true,
      });
      
      return true;
    } catch (error) {
      console.error('Erreur marquer comme vue:', error);
      return false;
    }
  },

  markAllAsViewed: async (): Promise<boolean> => {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      const notifications = await notificationService.getNotifications();
      const updatePromises = notifications
        .filter(n => !n.vue)
        .map(n => updateDoc(doc(db, 'notifications', n.id!), { vue: true }));

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error('Erreur marquer tout comme vu:', error);
      return false;
    }
  },

  deleteNotification: async (notificationId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      return true;
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      return false;
    }
  },

  deleteAllNotifications: async (): Promise<boolean> => {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      const notifications = await notificationService.getNotifications();
      const deletePromises = notifications.map(n => 
        deleteDoc(doc(db, 'notifications', n.id!))
      );

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Erreur suppression toutes notifications:', error);
      return false;
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const user = auth.currentUser;
      if (!user) return 0;

      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, where('idUtilisateur', '==', user.uid));
      const snapshot = await getDocs(q);
      
      let count = 0;
      snapshot.forEach(doc => {
        if (!doc.data().vue) count++;
      });
      
      return count;
    } catch (error) {
      console.error('Erreur comptage non lus:', error);
      return 0;
    }
  },
};

const notificationService = {
  checkNotificationExists: async (idUtilisateur: string, idPanne: string) => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('idUtilisateur', '==', idUtilisateur),
      where('idPanne', '==', idPanne)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },
  getNotifications: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('idUtilisateur', '==', user.uid)
    );
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateHeure: doc.data().dateHeure?.toDate() || new Date(),
    })) as Notification[];
    
    return notifications.sort((a, b) => 
      b.dateHeure.getTime() - a.dateHeure.getTime()
    );
  }
};