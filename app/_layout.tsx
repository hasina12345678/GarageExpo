import { Stack, useSegments } from 'expo-router';
import { View } from 'react-native';
import Navbar from '../components/Navbar';
import NotificationListener from '../components/NotificationListener';

export default function RootLayout() {
	const segments = useSegments();
	
	const routeName = segments[segments.length - 1] || '';
	
	const noNavbarPages = ['LoginPage', 'InscriptionPage', 'ProfilPage', 'index'];
	
	const showNavbar = !noNavbarPages.includes(routeName);

	return (
		<View style={{ flex: 1, paddingTop: 28 }}>
		{/* Écouteur de notifications */}
		<NotificationListener />
		
		{showNavbar && (
			<View style={{ zIndex: 1000 }}>
			<Navbar />
			</View>
		)}
		
		<View style={{ flex: 1 }}>
			<Stack 
				screenOptions={{ 
					headerShown: false,
					animation: 'none', 
				}} 
			/>
		</View>
		</View>
	);


}