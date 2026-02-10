import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import themeService, { ThemeType } from '../../../services/Theme/ThemeService';
import ThemeStyles from '../../../styles/Theme.css';

export default function ThemePage() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [themes, setThemes] = useState(themeService.getAvailableThemes());

  useEffect(() => {
    loadCurrentTheme();
  }, []);

  const loadCurrentTheme = () => {
    const theme = themeService.getCurrentTheme();
    setCurrentTheme(theme);
  };

  const handleThemeChange = async (themeId: ThemeType) => {
    try {
      const success = await themeService.setTheme(themeId);
      if (success) {
        setCurrentTheme(themeId);
        Alert.alert(
          'Thème changé',
          'Le thème a été changé avec succès.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de changer le thème');
    }
  };

  const ThemeCard = ({ theme }: { theme: any }) => {
    const isActive = theme.id === currentTheme;
    
    return (
      <TouchableOpacity
        style={[
          ThemeStyles.themeCard,
          isActive && ThemeStyles.themeCardActive,
          { borderColor: theme.colors.blue }
        ]}
        onPress={() => handleThemeChange(theme.id)}
        activeOpacity={0.7}
      >
        <View style={ThemeStyles.themeHeader}>
          <View style={[ThemeStyles.themeIcon, { backgroundColor: theme.colors.blue }]}>
            <Icon name="palette" size={24} color="#FFFFFF" />
          </View>
          <View style={ThemeStyles.themeInfo}>
            <Text style={[ThemeStyles.themeName, { color: theme.colors.gray800 }]}>
              {theme.name}
            </Text>
            <Text style={[ThemeStyles.themeStatus, { color: theme.colors.gray500 }]}>
              {isActive ? 'Actuellement sélectionné' : 'Cliquez pour sélectionner'}
            </Text>
          </View>
          {isActive && (
            <Icon name="check-circle" size={24} color={theme.colors.success} />
          )}
        </View>

        {/* Aperçu des couleurs */}
        <View style={ThemeStyles.colorPreview}>
          <View style={[ThemeStyles.colorBox, { backgroundColor: theme.colors.primary }]}>
            <Text style={ThemeStyles.colorLabel}>Primaire</Text>
          </View>
          <View style={[ThemeStyles.colorBox, { backgroundColor: theme.colors.secondary }]}>
            <Text style={ThemeStyles.colorLabel}>Secondaire</Text>
          </View>
          <View style={[ThemeStyles.colorBox, { backgroundColor: theme.colors.blue }]}>
            <Text style={ThemeStyles.colorLabel}>Bleu</Text>
          </View>
          <View style={[ThemeStyles.colorBox, { backgroundColor: theme.colors.background }]}>
            <Text style={ThemeStyles.colorLabel}>Fond</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={ThemeStyles.container}>
      <ScrollView contentContainerStyle={ThemeStyles.scrollContainer}>
        {/* Header */}
        <View style={ThemeStyles.headerContainer}>
          <TouchableOpacity 
            style={ThemeStyles.backButton}
            onPress={() => router.back()}
          >
            {/* <Icon name="arrow-back" size={24} color="#4A5568" /> */}
          </TouchableOpacity>
          <Text style={ThemeStyles.headerTitle}>Thèmes</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={ThemeStyles.contentContainer}>
          <Text style={ThemeStyles.sectionTitle}>
            Choisissez un thème pour personnaliser l'apparence
          </Text>
          <Text style={ThemeStyles.sectionDescription}>
            Le thème change les couleurs de l'interface. Certains changements nécessitent un redémarrage.
          </Text>

          {/* Liste des thèmes */}
          <View style={ThemeStyles.themesList}>
            {themes.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </View>

          {/* Information */}
          <View style={ThemeStyles.infoCard}>
            <Icon name="info" size={24} color="#4299E1" style={ThemeStyles.infoIcon} />
            <View style={ThemeStyles.infoContent}>
              <Text style={ThemeStyles.infoTitle}>À propos des thèmes</Text>
              <Text style={ThemeStyles.infoText}>
                • Les thèmes changent les couleurs principales de l'application
                {'\n'}• Certains éléments nécessitent un redémarrage pour s'actualiser
                {'\n'}• Vos préférences sont sauvegardées automatiquement
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}