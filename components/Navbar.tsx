// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavbarStyles from '../styles/Navbar.css';
import NotificationService from '../services/Notification/NotificationService';

import { useTheme } from '../hooks/useTheme';

import LogoImage from '../assets/images/logo.png';

export default function Navbar() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = `/${segments.join('/')}`;
  const [showSettings, setShowSettings] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
 
  const { colors } = useTheme();

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
      <View style={[NavbarStyles.container, { backgroundColor: colors.white }]}>
        <View style={[NavbarStyles.header, { backgroundColor: colors.white }]}>
          <View style={NavbarStyles.logoContainer}>
            <Image 
              source={LogoImage} 
              style={NavbarStyles.logoImage}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity 
            onPress={() => setShowSettings(!showSettings)} 
            style={[NavbarStyles.settingsButton, { backgroundColor: colors.gray100 }]} 
            activeOpacity={0.7}
          >
            <Icon name="menu" size={24} style={[NavbarStyles.settingsIcon, { color: colors.gray600 }]} />
          </TouchableOpacity>
        </View>

        <View style={[
          NavbarStyles.navContainer, 
          { 
            backgroundColor: colors.white, 
            borderTopColor: colors.gray100 
          }
        ]}>
          {navItems.map((item, index) => {
            const isActive = pathname === item.route;
            
            return (
              <TouchableOpacity 
                key={index} 
                onPress={() => router.push(item.route)} 
                style={[
                  NavbarStyles.navItem, 
                  isActive && { backgroundColor: colors.gray50 }
                ]} 
                activeOpacity={0.7}
              >
                <View style={[
                  NavbarStyles.navIconContainer, 
                  { backgroundColor: colors.gray100 },
                  isActive && { backgroundColor: colors.blue }
                ]}>
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    style={[
                      NavbarStyles.navIcon, 
                      { color: colors.gray600 },
                      isActive && { color: colors.white }
                    ]}
                  />
                  
                  {item.name === 'Alertes' && notificationCount > 0 && (
                    <View style={[
                      notificationCount > 4 ? NavbarStyles.notificationBadgeWithCount : NavbarStyles.notificationBadge,
                      { 
                        backgroundColor: colors.danger, 
                        borderColor: colors.white 
                      }
                    ]}>
                      <Text style={[
                        NavbarStyles.badgeText, 
                        { color: colors.white }
                      ]}>
                        {notificationCount > 4 ? '4+' : notificationCount}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  NavbarStyles.navText, 
                  { color: colors.gray600 },
                  isActive && { color: colors.blue, fontWeight: '600' }
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Modal 
        visible={showSettings} 
        transparent={true} 
        animationType="fade" 
        onRequestClose={() => setShowSettings(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSettings(false)}>
          <View style={NavbarStyles.overlay} />
        </TouchableWithoutFeedback>
        
        <View style={[
          NavbarStyles.dropdownContainer, 
          { 
            backgroundColor: colors.white, 
            borderColor: colors.gray200 
          }
        ]}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={item.action} 
              style={[
                NavbarStyles.dropdownItem, 
                { borderBottomColor: colors.gray100 },
                item.isLast && { borderBottomWidth: 0 }
              ]} 
              activeOpacity={0.6}
            >
              <Icon name={item.icon} size={20} style={[
                NavbarStyles.dropdownIcon, 
                { color: colors.gray500 }
              ]} />
              <Text style={[
                NavbarStyles.dropdownText, 
                { color: colors.gray700 }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}