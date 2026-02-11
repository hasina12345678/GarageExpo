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
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Point 1
    Animated.loop(
      Animated.sequence([
        Animated.delay(0),
        Animated.timing(dot1Anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dot1Anim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Point 2
    Animated.loop(
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(dot2Anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Point 3
    Animated.loop(
      Animated.sequence([
        Animated.delay(400), 
        Animated.timing(dot3Anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      checkAuthentication();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthentication = () => {
    setIsCheckingAuth(true);
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (user) {
          router.replace('/pages/Accueil/AccueilPage');
        } else {
          router.replace('/pages/Login/LoginPage');
        }
        unsubscribe();
      });
    });
  };

  const dot1Scale = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const dot2Scale = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const dot3Scale = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const dot1Opacity = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const dot2Opacity = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const dot3Opacity = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
        }
      ]}>
        
        <View style={styles.loadingContainer}>
          <Animated.View 
            style={[
              styles.loadingDot, 
              { 
                transform: [{ scale: dot1Scale }],
                opacity: dot1Opacity
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.loadingDot, 
              styles.loadingDotMiddle,
              { 
                transform: [{ scale: dot2Scale }],
                opacity: dot2Opacity
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.loadingDot, 
              { 
                transform: [{ scale: dot3Scale }],
                opacity: dot3Opacity
              }
            ]} 
          />
        </View>
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
    marginBottom: 60, 
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 20,
    marginBottom: 20,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 8, 
  },
  loadingDotMiddle: {
    backgroundColor: COLORS.primary,
  },
  checkingText: {
    fontSize: 14,
    color: COLORS.accentLight,
    marginTop: 20,
  },
});