import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';
import * as SplashScreen from 'expo-splash-screen';

// Empêche le splash screen natif de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

// Couleurs de votre thème
const COLORS = {
  primary: '#F7931e',
  secondary: '#F9A742',
  accent: '#4A5568',
  accentLight: '#718096',
  border: '#E0E0E0',
  surface: '#FFFFFF',
  blue: '#F7931e', // orange dans votre thème
  blueDark: '#D47A1A',
  background: '#FEF9F3', // Fond plus clair pour aller avec l'orange
};

export default function SplashPage() {
  const router = useRouter();
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Démarrer l'animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de rotation continue
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animation des points de chargement
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnimation, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dotAnimation, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Vérifier l'authentification après un délai
    const timer = setTimeout(() => {
      checkAuthentication();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthentication = async () => {
    try {
      await SplashScreen.hideAsync();
      
      auth.onAuthStateChanged((user) => {
        // Animation de sortie
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (user) {
            router.replace('/pages/Accueil/AccueilPage');
          } else {
            router.replace('/pages/Login/LoginPage');
          }
        });
      });
    } catch (error) {
      console.error('Erreur lors du splash:', error);
      auth.onAuthStateChanged((user) => {
        if (user) {
          router.replace('/pages/Accueil/AccueilPage');
        } else {
          router.replace('/pages/Login/LoginPage');
        }
      });
    }
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Interpolation pour l'animation des points
  const dotScale = dotAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { rotate: rotateInterpolate },
              { scale: scale }
            ]
          }
        ]}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        GarageApp
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Votre partenaire automobile
      </Animated.Text>
      
      {/* Indicateur de chargement avec animation */}
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingDot, { transform: [{ scale: dotScale }] }]} />
        <Animated.View style={[
          styles.loadingDot, 
          styles.loadingDotMiddle, 
          { 
            transform: [{ scale: dotAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1.2, 1.5]
            })}] 
          }
        ]} />
        <Animated.View style={[styles.loadingDot, { transform: [{ scale: dotScale }] }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 150,
    tintColor: COLORS.primary, // Optionnel: si votre logo est blanc, il deviendra orange
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textShadowColor: 'rgba(247, 147, 30, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.accent,
    marginBottom: 40,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 6,
  },
  loadingDotMiddle: {
    backgroundColor: COLORS.primary,
  },
});