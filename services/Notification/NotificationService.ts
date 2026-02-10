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
  // Retirez orderBy, limit de l'import
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

export default {
  // 1. Vérifier si une notification existe déjà pour cette panne
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

  // 2. Créer une notification pour une panne réparée
  createReparationNotification: async (idPanne: string): Promise<{ success: boolean; message: string }> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Utilisateur non connecté');

      // Vérifier que la panne appartient à l'utilisateur
      const panneRef = doc(db, 'pannes', idPanne);
      const panneDoc = await getDoc(panneRef);
      
      if (!panneDoc.exists()) {
        throw new Error('Panne non trouvée');
      }

      const panneData = panneDoc.data();
      const voitureRef = doc(db, 'voitures', panneData.idVoiture);
      const voitureDoc = await getDoc(voitureRef);
      
      if (!voitureDoc.exists() || voitureDoc.data().idUtilisateur !== user.uid) {
        return { success: false, message: 'Cette panne ne vous appartient pas' };
      }

      // Vérifier si notification existe déjà
      const exists = await notificationService.checkNotificationExists(user.uid, idPanne);
      if (exists) {
        return { success: false, message: 'Notification déjà existante' };
      }

      // Créer la notification
      const notification: Omit<Notification, 'id'> = {
        idUtilisateur: user.uid,
        idPanne,
        titre: '🚗 Panne réparée',
        texte: 'Votre véhicule est réparé et prêt à être récupéré.',
        dateHeure: new Date(),
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

  // 3. Récupérer toutes les notifications de l'utilisateur (SANS orderBy)
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const notificationsRef = collection(db, 'notifications');
      // RETIREZ orderBy pour éviter l'erreur d'index
      const q = query(
        notificationsRef,
        where('idUtilisateur', '==', user.uid)
        // RETIRÉ: orderBy('dateHeure', 'desc')
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

      // Triez côté client au lieu de Firestore
      return notifications.sort((a, b) => 
        b.dateHeure.getTime() - a.dateHeure.getTime()
      );
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return [];
    }
  },

  // 4. Écouter en temps réel les changements de statut (SANS orderBy)
  setupPanneStatutListener: (callback?: (notification: Notification) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const statutsRef = collection(db, 'panneStatuts');
    // RETIREZ orderBy pour éviter l'erreur d'index
    const q = query(
      statutsRef,
      where('idStatutForPanne', '==', '2')
      // RETIRÉ: orderBy('dateHeure', 'desc')
    );

    return onSnapshot(q, async (snapshot) => {
      const changes = snapshot.docChanges();
      
      // Triez les changements par date côté client
      const sortedChanges = changes.sort((a, b) => {
        const dateA = a.doc.data().dateHeure?.toDate() || new Date(0);
        const dateB = b.doc.data().dateHeure?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime(); // Tri décroissant
      });

      for (const change of sortedChanges) {
        if (change.type === 'added') {
          const statutData = change.doc.data();
          const idPanne = statutData.idPanne;

          // Vérifier que la panne appartient à l'utilisateur
          const panneRef = doc(db, 'pannes', idPanne);
          const panneDoc = await getDoc(panneRef);
          
          if (!panneDoc.exists()) continue;
          
          const panneData = panneDoc.data();
          const voitureRef = doc(db, 'voitures', panneData.idVoiture);
          const voitureDoc = await getDoc(voitureRef);
          
          if (!voitureDoc.exists() || voitureDoc.data().idUtilisateur !== user.uid) {
            continue;
          }

          // Vérifier si notification existe déjà
          const exists = await notificationService.checkNotificationExists(user.uid, idPanne);
          if (exists) continue;

          // Créer la notification
          const notification: Omit<Notification, 'id'> = {
            idUtilisateur: user.uid,
            idPanne,
            titre: '🚗 Panne réparée !',
            texte: 'Votre véhicule est réparé. Vous pouvez venir le récupérer.',
            dateHeure: new Date(),
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

          // Envoyer la notification push
          try {
            await sendPushNotification(
              '🚗 Panne réparée !',
              'Votre véhicule est réparé. Vous pouvez venir le récupérer.',
              { idPanne, type: 'reparation' }
            );
            
            // Marquer comme push envoyé
            await updateDoc(doc(db, 'notifications', docRef.id), {
              alreadyPush: true,
            });
          } catch (error) {
            console.error('Erreur envoi notification push:', error);
          }

          // Appeler le callback si fourni
          if (callback) {
            callback(newNotification as Notification);
          }
        }
      }
    });
  },

  // 5. Marquer une notification comme vue
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

  // 6. Marquer toutes les notifications comme vues
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

  // 7. Supprimer une notification
  deleteNotification: async (notificationId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      return true;
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      return false;
    }
  },

  // 8. Supprimer toutes les notifications
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

  // 9. Compter les notifications non lues (version optimisée)
  getUnreadCount: async (): Promise<number> => {
    try {
      const user = auth.currentUser;
      if (!user) return 0;

      // Version simplifiée pour éviter orderBy
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

// Instance pour auto-référence (mise à jour)
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
    // RETIREZ orderBy
    const q = query(
      notificationsRef,
      where('idUtilisateur', '==', user.uid)
      // RETIRÉ: orderBy('dateHeure', 'desc')
    );
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateHeure: doc.data().dateHeure?.toDate() || new Date(),
    })) as Notification[];
    
    // Triez côté client
    return notifications.sort((a, b) => 
      b.dateHeure.getTime() - a.dateHeure.getTime()
    );
  }
};