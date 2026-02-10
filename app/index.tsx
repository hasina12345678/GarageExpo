import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';
import { setupNotificationChannels } from '../services/Notification/PushNotificationService';
import * as Notifications from 'expo-notifications';

export default function IndexPage() {
  	const router = useRouter();

	useEffect(() => {

		setupNotificationChannels();

		const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
			if (user) {
				
				setupNotificationHandlers();
				
				router.replace('/pages/Accueil/AccueilPage');
			} else {
				router.replace('/pages/Login/LoginPage');
			}
		});

		return () => unsubscribeAuth();

	}, []);

  
	const setupNotificationHandlers = () => {
		
		const responseListener = Notifications.addNotificationResponseReceivedListener(response => {  // Écouter quand l'utilisateur clique sur une notification
			const data = response.notification.request.content.data;
		
			if (data.idPanne && data.type === 'reparation') {
				router.push(`/pages/Paiement/PaiementPage?panneId=${data.idPanne}`);
				// router.push(`/pages/Paiement/PaiementPage`);
			}
		});

		return () => {
			responseListener.remove();
		};
	};

  return null;
  
}