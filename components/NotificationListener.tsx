// components/NotificationListener.tsx
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { setupNotificationChannels } from '../services/Notification/PushNotificationService';
import * as Notifications from 'expo-notifications';
import { auth } from '../services/firebase';
import NotificationService from '../services/Notification/NotificationService';

export default function NotificationListener() {
	const router = useRouter();
	const listenerRef = useRef<any>(null);

	useEffect(() => {
		
		setupNotificationChannels(); // 1. Configurer les canaux (Android)
		
		Notifications.setNotificationHandler({  // 2. Configurer le handler de notifications
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: true,
			}),
		});

		const responseListener = Notifications.addNotificationResponseReceivedListener(  // 3. Écouter les clics sur les notifications
			(response) => {
				const data = response.notification.request.content.data;
				
				if (data.idPanne && data.type === 'reparation') {
					router.push(`/pages/Paiement/PaiementPage?panneId=${data.idPanne}`);
					// router.push(`/pages/Paiement/PaiementPage`);
				}
			}
		);

		const unsubscribeAuth = auth.onAuthStateChanged((user) => { // 4. Écouter les changements d'authentification
		if (user) {
			console.log('Utilisateur connecté, démarrage écoute notifications...');
			
			listenerRef.current = NotificationService.setupPanneStatutListener( // 5. Démarrer l'écoute des pannes réparées
				(notification) => {
					console.log('Nouvelle notification détectée:', notification);
				}
			);
		} else {
			console.log('Utilisateur déconnecté, arrêt écoute notifications...');
			if (listenerRef.current) {
				listenerRef.current();
				listenerRef.current = null;
			}
		}
		});

		return () => {
			console.log('Nettoyage écouteurs notifications...');
			responseListener.remove();
			unsubscribeAuth();
			if (listenerRef.current) {
				listenerRef.current();
			}
		};
	}, []);

  	return null; 


}