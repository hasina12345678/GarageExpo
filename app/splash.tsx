import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../services/firebase';

export default function SplashScreen() {
  const router = useRouter();
  
  // Animations
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animation d'apparition
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de rotation continue
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Redirection après 3 secondes
    const timer = setTimeout(() => {
      const user = auth.currentUser;
      if (user) {
        router.replace('/pages/Accueil/AccueilPage');
      } else {
        router.replace('/pages/Login/LoginPage');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
     
      <Animated.View 
        style={[
          styles.tireContainer,
          { 
            opacity: fadeValue,
            transform: [
              { scale: scaleValue },
              { rotate: spin }
            ]
          }
        ]}
      >
        <View style={styles.tire}>
          
          <View style={styles.spoke} />
          <View style={[styles.spoke, styles.spoke45]} />
          <View style={[styles.spoke, styles.spoke90]} />
          <View style={[styles.spoke, styles.spoke135]} />
          
          <View style={styles.hub}>
            <View style={styles.hubCenter} />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeValue }}>
        <Text style={styles.title}>MyGarage</Text>
        <Text style={styles.subtitle}>Préparation en cours...</Text>
      </Animated.View>

      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((index) => {
          const dotAnim = useRef(new Animated.Value(0)).current;
          
          useEffect(() => {
            Animated.loop(
              Animated.sequence([
                Animated.timing(dotAnim, {
                  toValue: 1,
                  duration: 600,
                  delay: index * 200,
                  useNativeDriver: true,
                }),
                Animated.timing(dotAnim, {
                  toValue: 0,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ])
            ).start();
          }, []);

          const opacity = dotAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          });

          const scale = dotAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1.2],
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tireContainer: {
    marginBottom: 40,
  },
  tire: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2D3748',
    borderWidth: 8,
    borderColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  spoke: {
    position: 'absolute',
    width: 2,
    height: 100,
    backgroundColor: '#CBD5E0',
    opacity: 0.6,
  },
  spoke45: { transform: [{ rotate: '45deg' }] },
  spoke90: { transform: [{ rotate: '90deg' }] },
  spoke135: { transform: [{ rotate: '135deg' }] },
  hub: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4299E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubCenter: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4299E1',
    marginHorizontal: 6,
  },
});