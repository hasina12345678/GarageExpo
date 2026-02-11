import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';
import { setupNotificationChannels } from '../services/Notification/PushNotificationService';
import * as Notifications from 'expo-notifications';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    setupNotificationChannels();

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.idPanne && data.type === 'reparation') {
        router.push(`/pages/Paiement/PaiementPage?panneId=${data.idPanne}`);
      }
    });

    const foregroundListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
    });

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      router.replace('/splash');
    });

    return () => {
      unsubscribeAuth();
      responseListener.remove();
      foregroundListener.remove();
    };
  }, []);

  return null;
}








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

// import React, { useEffect } from 'react';
// import { Redirect } from 'expo-router';

// export default function IndexPage() {
//   return <Redirect href="/splash" />;
// }