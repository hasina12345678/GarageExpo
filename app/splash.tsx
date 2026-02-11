import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Text,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';

const COLORS = {
  primary: '#F7931e',
  secondary: '#F9A742',
  accent: '#4A5568',
  accentLight: '#718096',
  border: '#E0E0E0',
  surface: '#FFFFFF',
  blue: '#F7931e', 
  blueDark: '#D47A1A',
  background: '#FEF9F3',
};

export default function SplashPage() {
  const router = useRouter();
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnimation = useRef(new Animated.Value(0)).current;
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(false);

  useEffect(() => {
    // Animation d'entrée
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

    // Animation de rotation du logo
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animation des points
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

    // Vérifier l'authentification après 2 secondes
    const timer = setTimeout(() => {
      checkAuthentication();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthentication = () => {
    setIsCheckingAuth(true);
    
    // Écouter l'état d'authentification
    const unsubscribe = auth.onAuthStateChanged((user) => {
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
        // Redirection après l'animation de sortie
        if (user) {
          router.replace('/pages/Accueil/AccueilPage');
        } else {
          router.replace('/pages/Login/LoginPage');
        }
        unsubscribe();
      });
    });
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dotScale = dotAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ scale: scale }]
        }
      ]}>
		<Animated.View style={[
		styles.logoContainer,
		{
			transform: [{ scale: scale }]
		}
		]}>
		<Image
			source={require('../assets/images/logo.png')}
			style={styles.logo}
			resizeMode="contain"
		/>
		</Animated.View>
        
        <Text style={styles.title}>
          Garage
        </Text>
        <Text style={styles.subtitle}>
          Votre partenaire automobile
        </Text>
        
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
        
        {isCheckingAuth && (
          <Text style={styles.checkingText}>
            Vérification...
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 150,
    height: 150,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // Effets visuels optionnels
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
    // Optionnel: appliquer une teinte orange si votre logo est d'une autre couleur
    // tintColor: COLORS.primary,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
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
    marginTop: 40,
    marginBottom: 20,
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
  checkingText: {
    fontSize: 14,
    color: COLORS.accentLight,
    marginTop: 10,
  },
});