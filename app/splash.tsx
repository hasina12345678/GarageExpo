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

SplashScreen.preventAutoHideAsync();

export default function SplashPage() {
  const router = useRouter();
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
   
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

    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      checkAuthentication();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthentication = async () => {
    try {
      
      await SplashScreen.hideAsync();
      
      auth.onAuthStateChanged((user) => {
       
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
          source={require('../assets/images/logo.png')}
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
      
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotMiddle]} />
        <View style={styles.loadingDot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#2196F3',
    marginHorizontal: 4,
  },
  loadingDotMiddle: {
    backgroundColor: '#1976D2',
    transform: [{ scale: 1.2 }],
  },
});