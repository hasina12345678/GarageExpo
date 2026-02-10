// services/Notification/PushNotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

// Fonction pour vérifier si on est en Expo Go
export function isExpoGo() {
  return Constants.appOwnership === 'expo';
}

// 1. Demander les permissions push (version compatible Expo Go)
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Les notifications ne fonctionnent pas sur un simulateur');
    return null;
  }

  // Si on est en Expo Go, on saute la partie push
  if (isExpoGo()) {
    console.log('Mode Expo Go: notifications push désactivées');
    Alert.alert(
      'Notifications',
      'Les notifications push nécessitent une build de développement. Utilisez "npx expo run:android" pour les tester.'
    );
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permissions pour notifications refusées');
    return null;
  }

  // Récupérer le token push
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;

  console.log('Token push:', token);
  return token;
}

// 2. Configurer les canaux (Android)
export async function setupNotificationChannels() {
  // Même en Expo Go, on peut configurer les canaux pour les notifications locales
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
    } catch (error) {
      console.log('Cannot set notification channel in Expo Go');
    }
  }
}

// 3. Envoyer une notification push (version compatible)
export async function sendPushNotification(title: string, body: string, data?: any) {
  // En Expo Go, on utilise les notifications locales
  if (isExpoGo()) {
    // Notification locale (fonctionne dans Expo Go)
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        badge: 1,
      },
      trigger: null,
    });
  } else {
    // Version complète pour les builds de développement
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        badge: 1,
        vibrate: [250, 250, 250],
      },
      trigger: null,
    });
  }
}

// 4. Réinitialiser le badge
export async function resetNotificationBadge() {
  if (!isExpoGo()) {
    await Notifications.setBadgeCountAsync(0);
  }
}

// 5. Obtenir le nombre actuel de badges
export async function getBadgeCount() {
  if (!isExpoGo()) {
    return await Notifications.getBadgeCountAsync();
  }
  return 0;
}