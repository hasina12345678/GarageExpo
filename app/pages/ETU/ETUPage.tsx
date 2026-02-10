import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import ETUStyles from '../../../styles/ETU.css';

export default function ETUPage() {
  const router = useRouter();

  const etudiants = [
    {
      nom: 'Hasina',
      etu: 'ETU003519',
      role: 'Développeur Fullstack',
      couleur: '#4299E1',
      email: 'andrianirinahasina07@gmail.com',
    },
    {
      nom: 'Manuelo',
      etu: 'ETU003661',
      couleur: '#38A169', 
      email: 'manuelo@etu.univ-antananarivo.mg',
    },
    {
      nom: 'Fenitra',
      etu: 'ETU003500',
      couleur: '#D69E2E', 
      email: 'fenitra@etu.univ-antananarivo.mg',
    },
    {
      nom: 'Dylan',
      etu: 'ETU003520',
      couleur: '#9F7AEA',
      email: 'dylan@etu.univ-antananarivo.mg',
    },
  ];

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={ETUStyles.container}>
      <ScrollView contentContainerStyle={ETUStyles.scrollContainer}>
        {/* Header */}
        <View style={ETUStyles.headerContainer}>
          <View style={ETUStyles.logoContainer}>
            <Icon name="school" size={60} color="#2D3748" />
          </View>
          <Text style={ETUStyles.headerTitle}>Équipe de Développement</Text>
          <Text style={ETUStyles.headerSubtitle}>
            Projet MyGarage
          </Text>
        </View>

        {/* Liste des étudiants */}
        <View style={ETUStyles.sectionContainer}>
          <Text style={ETUStyles.sectionTitle}>Membres de l'équipe</Text>
          
          {etudiants.map((etudiant, index) => (
            <View key={index} style={ETUStyles.etudiantCard}>
              {/* En-tête avec avatar */}
              <View style={ETUStyles.cardHeader}>
                <View style={[ETUStyles.avatarContainer, { backgroundColor: etudiant.couleur }]}>
                  <Text style={ETUStyles.avatarText}>
                    {etudiant.nom.charAt(0)}
                  </Text>
                </View>
                <View style={ETUStyles.nameContainer}>
                  <Text style={ETUStyles.etudiantName}>
                     {etudiant.nom}
                  </Text>
                  <Text style={ETUStyles.etudiantRole}>{etudiant.role}</Text>
                </View>
              </View>

              {/* Informations */}
              <View style={ETUStyles.infoContainer}>
                <View style={ETUStyles.infoRow}>
                  <View style={ETUStyles.infoItem}>
                    <Icon name="badge" size={16} color="#718096" style={ETUStyles.infoIcon} />
                    <Text style={ETUStyles.infoLabel}>Numéro ETU:</Text>
                  </View>
                  <Text style={ETUStyles.infoValue}>{etudiant.etu}</Text>
                </View>

                <View style={[ETUStyles.infoRow, ETUStyles.infoRowLast]}>
                  <View style={ETUStyles.infoItem}>
                    <Icon name="email" size={16} color="#718096" style={ETUStyles.infoIcon} />
                    <Text style={ETUStyles.infoLabel}>Email:</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleEmailPress(etudiant.email)}>
                    <Text style={ETUStyles.emailText}>{etudiant.email}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Informations du projet */}
        <View style={ETUStyles.projectContainer}>
          <Text style={ETUStyles.projectTitle}>À propos du projet</Text>
          <View style={ETUStyles.projectCard}>
            <Icon name="handyman" size={24} color="#4299E1" style={ETUStyles.projectIcon} />
            <Text style={ETUStyles.projectName}>MyGarage</Text>
            <Text style={ETUStyles.projectDescription}>
              Application mobile de gestion de garage automobile permettant de suivre 
              les réparations, les paiements et les véhicules des clients.
            </Text>
            <View style={ETUStyles.projectTech}>
              <Text style={ETUStyles.techTitle}>Technologies utilisées:</Text>
              <View style={ETUStyles.techTags}>
                <View style={ETUStyles.techTag}><Text style={ETUStyles.techTagText}>React Native (Expo)</Text></View>
                <View style={ETUStyles.techTag}><Text style={ETUStyles.techTagText}>TypeScript</Text></View>
                <View style={ETUStyles.techTag}><Text style={ETUStyles.techTagText}>Laravel</Text></View>
                <View style={ETUStyles.techTag}><Text style={ETUStyles.techTagText}>Godot</Text></View>
                <View style={ETUStyles.techTag}><Text style={ETUStyles.techTagText}>React JS</Text></View>
              </View>
            </View>
          </View>
        </View>

        {/* Bouton retour */}
        {/* <TouchableOpacity 
          style={ETUStyles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={ETUStyles.backButtonText}>Retour</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
}