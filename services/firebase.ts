import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNNUnb8iAxIs50YxXSkfk5iQP6kdck_J8",
  authDomain: "garrageapp-05.firebaseapp.com",
  projectId: "garrageapp-05",
  storageBucket: "garrageapp-05.appspot.com",
  messagingSenderId: "553426867703",
  appId: "1:553426867703:android:b66c2b1942849dac670af2"
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export default app;