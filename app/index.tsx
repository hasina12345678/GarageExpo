// import React, { useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import { auth } from '../services/firebase';
// import { setupNotificationChannels } from '../services/Notification/PushNotificationService';
// import * as Notifications from 'expo-notifications';

// export default function IndexPage() {
//   	const router = useRouter();

// 	useEffect(() => {

// 		setupNotificationChannels();

// 		const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
// 			if (user) {
				
// 				setupNotificationHandlers();
				
// 				router.replace('/pages/Accueil/AccueilPage');
// 				// router.replace('./splash');
// 			} else {
// 				// router.replace('./splash');
// 				router.replace('/pages/Login/LoginPage');
// 			}
// 		});

// 		return () => unsubscribeAuth();

// 	}, []);

  
// 	const setupNotificationHandlers = () => {
		
// 		const responseListener = Notifications.addNotificationResponseReceivedListener(response => {  // Écouter quand l'utilisateur clique sur une notification
// 			const data = response.notification.request.content.data;
		
// 			if (data.idPanne && data.type === 'reparation') {
// 				router.push(`/pages/Paiement/PaiementPage?panneId=${data.idPanne}`);
// 				// router.push(`/pages/Paiement/PaiementPage`);
// 			}
// 		});

// 		return () => {
// 			responseListener.remove();
// 		};
// 	};

//   return null;
  
// }

import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';
import { setupNotificationChannels } from '../services/Notification/PushNotificationService';
import * as Notifications from 'expo-notifications';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Initialiser les canaux de notification
    setupNotificationChannels();

    // Configurer les gestionnaires de notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.idPanne && data.type === 'reparation') {
        router.push(`/pages/Paiement/PaiementPage?panneId=${data.idPanne}`);
      }
    });

    // Écouter les notifications reçues en foreground
    const foregroundListener = Notifications.addNotificationReceivedListener(notification => {
      // Vous pouvez gérer les notifications reçues pendant que l'app est ouverte
      console.log('Notification reçue:', notification);
    });

    // Vérifier l'authentification et rediriger vers le splash
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      // On redirige toujours vers le splash, qui gèrera l'authentification
      router.replace('/splash');
    });

    // Nettoyage
    return () => {
      unsubscribeAuth();
      responseListener.remove();
      foregroundListener.remove();
    };
  }, []);

  return null;
}