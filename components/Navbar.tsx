import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavbarStyles from '../styles/Navbar.css';
import NotificationService from '../services/Notification/NotificationService';

export default function Navbar() {
	const router = useRouter();
	const segments = useSegments();
	const pathname = `/${segments.join('/')}`;
	const [showSettings, setShowSettings] = useState(false);
	const [notificationCount, setNotificationCount] = useState(0);


	useEffect(() => {
		loadNotificationCount();
		
		const interval = setInterval(loadNotificationCount, 8000);
		
		return () => clearInterval(interval);
	}, []);

  	const loadNotificationCount = async () => {
		try {
			const count = await NotificationService.getUnreadCount();
			setNotificationCount(count);
		} catch (error) {
			console.error('Erreur chargement badge:', error);
		}
  	};

  	const handleLogout = async () => {
		try {
			await signOut(auth);
			setShowSettings(false);
			router.replace('/pages/Login/LoginPage');
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
		}
  	};

	const navItems = [
		{ 
			name: 'Accueil', 
			icon: 'space-dashboard',
			route: '/pages/Accueil/AccueilPage',
		},
		{ 
			name: 'Véhicules', 
			icon: 'directions-car', 
			route: '/pages/Voiture/VoiturePage',
		},
		{ 
			name: 'Problèmes', 
			icon: 'handyman', 
			route: '/pages/Probleme/ProblemePage',
		},
		{ 
			name: 'Paiements', 
			icon: 'payments', 
			route: '/pages/Paiement/PaiementPage',
		},
		{ 
			name: 'Alertes', 
			icon: 'notifications-active',
			route: '/pages/Notification/NotificationPage',
			badge: notificationCount > 0,
			badgeCount: notificationCount,
		},
	];

  	const settingsItems = [
		{ 
			icon: 'account-circle', 
			label: 'Mon profil', 
			action: () => router.push('/pages/Profil/ProfilPage') 
		},
		{ 
			icon: 'palette', 
			label: 'Thème', 
			action: () => {
				router.push('/pages/Theme/ThemePage');
				setShowSettings(false);
			}
		},
		{ 
			icon: 'translate', 
			label: 'Langue', 
			action: () => {
				console.log('Changer langue');
				setShowSettings(false);
			}
		},
		{ 
			icon: 'school', 
			label: 'Équipe ETU', 
			action: () => {
				router.push('/pages/ETU/ETUPage');
				setShowSettings(false);
			}
		},
		{ 
			icon: 'logout', 
			label: 'Déconnexion', 
			action: handleLogout, 
			isLast: true 
		},
  	];

	return (
		<>
			<View style={NavbarStyles.container}>
				
				<View style={NavbarStyles.header}>
					<View style={NavbarStyles.logoContainer}><Text style={NavbarStyles.logoText}>MyGarage</Text></View>
					<TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={NavbarStyles.settingsButton} activeOpacity={0.7} >
						<Icon name="menu" size={24} style={NavbarStyles.settingsIcon} />
					</TouchableOpacity>
				</View>

				<View style={NavbarStyles.navContainer}>
					{navItems.map((item, index) => {
						const isActive = pathname === item.route;
						
						return (
							
							<TouchableOpacity 
								key={index} 
								onPress={() => router.push(item.route)} 
								style={[NavbarStyles.navItem, isActive && NavbarStyles.navItemActive]} 
								activeOpacity={0.7}>
									<View style={[NavbarStyles.navIconContainer, isActive && NavbarStyles.navIconContainerActive]}>
									<Icon 
										name={item.icon} 
										size={20} 
										style={[NavbarStyles.navIcon, isActive && NavbarStyles.navIconActive]}
							/>
								
										{item.name === 'Alertes' && notificationCount > 0 && (
											<View style={[notificationCount > 4 ? NavbarStyles.notificationBadgeWithCount : NavbarStyles.notificationBadge]}>
												<Text style={NavbarStyles.badgeText}>
													{notificationCount > 4 ? '4+' : notificationCount}
												</Text>
											</View>
										)}
									</View>
									<Text style={[NavbarStyles.navText, isActive && NavbarStyles.navTextActive]}>
										{item.name}
									</Text>
							</TouchableOpacity>
						);
					})}
				</View>

			</View>

			<Modal visible={showSettings} transparent={true} animationType="fade" onRequestClose={() => setShowSettings(false)} >
				<TouchableWithoutFeedback onPress={() => setShowSettings(false)}>
					<View style={NavbarStyles.overlay} />
				</TouchableWithoutFeedback>
				
				<View style={NavbarStyles.dropdownContainer}>
					{settingsItems.map((item, index) => (
						<TouchableOpacity 
							key={index} 
							onPress={item.action} 
							style={[ NavbarStyles.dropdownItem, item.isLast && NavbarStyles.dropdownItemLast ]} 
							activeOpacity={0.6} 
						>
							<Icon name={item.icon} size={20} style={NavbarStyles.dropdownIcon} />
							<Text style={NavbarStyles.dropdownText}>{item.label}</Text>
						</TouchableOpacity>
					))}
				</View>
			</Modal>
		</>
  );
}