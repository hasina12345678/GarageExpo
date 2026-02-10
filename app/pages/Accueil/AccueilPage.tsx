import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AccueilStyles from '../../../styles/Accueil.css';

import accueilService, { 
  PanneEnCours, 
  Statistiques 
} from '../../../services/Accueil/AccueilService';

import { extractUsernameFromEmail } from '../../../services/utils';
import { Colors } from '../../../styles/Common.css';
import { router } from 'expo-router';

export default function AccueilPage() {
	
	const [pannesEnCours, setPannesEnCours] = useState<PanneEnCours[]>([]);
	const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [username, setUsername] = useState('');

 	 const loadData = async () => {
		try {
		
		const pannes = await accueilService.getPannesEnCours();
		
		const stats = accueilService.getStatistiques(pannes);
		
		const userName = extractUsernameFromEmail();
		
		setPannesEnCours(pannes);
		setStatistiques(stats);
		setUsername(userName);
		
		} catch (error) {
			console.error('Erreur lors du chargement des données:', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
  	};

	useEffect(() => {
		loadData();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		loadData();
	};


	if (loading) {
		return (
			<View style={[AccueilStyles.container, AccueilStyles.loadingContainer]}>
				<ActivityIndicator size="large" color={Colors.blue} />
			</View>
		);
	}

	const renderEmptyState = () => ( 	// Rendu état vide
		<View style={AccueilStyles.emptyState}>
			<Icon name="check-circle" size={60} style={AccueilStyles.emptyStateIcon} />
			<Text style={AccueilStyles.emptyStateText}>
				Aucune panne en cours
			</Text>
			<Text style={AccueilStyles.emptyStateSubtext}>
				Toutes vos réparations sont terminées ou en attente de déclaration
			</Text>
			<TouchableOpacity
				style={{
				marginTop: 20,
				paddingHorizontal: 20,
				paddingVertical: 10,
				backgroundColor: Colors.blue,
				borderRadius: 8,
				}}
				onPress={() => {
					router.push('/pages/Probleme/ProblemePage');
					console.log('Naviguer vers déclaration panne');
				}}
			>
				<Text style={{ color: Colors.white, fontWeight: '600' }}>
					Déclarer une panne
				</Text>
			</TouchableOpacity>
		</View>
	);

	const renderPanneCard = (panne: PanneEnCours) => (
		<View key={panne.id} style={AccueilStyles.panneCard}>
		
			<View style={AccueilStyles.panneHeader}>
				<View style={AccueilStyles.panneHeaderRow}>
				<Text style={AccueilStyles.panneTitle}>
					Réparation en cours
				</Text>
				<Text style={AccueilStyles.panneDate}>
					{accueilService.formaterDate(panne.dateDeclaration)}
				</Text>
				</View>
				<Text style={AccueilStyles.panneVehicule}>
					{panne.marqueVoiture || 'Véhicule'} • {panne.matriculeVoiture}
					{panne.modeleVoiture && ` • ${panne.modeleVoiture}`}
				</Text>
			</View>

			<View style={AccueilStyles.panneDetails}>
				{panne.detailsPannes.map((detail, index) => (
				<View key={index} style={AccueilStyles.detailItem}>
					<Text style={AccueilStyles.detailName}>{detail.nom}</Text>
					<View style={AccueilStyles.detailInfo}>
						<Text style={AccueilStyles.detailDuree}>
							{accueilService.formaterDuree(detail.duree)}
						</Text>
						<Text style={AccueilStyles.detailPrix}>
							{accueilService.formaterPrix(detail.prix)}
						</Text>
					</View>
				</View>
				))}
			</View>

			<View style={AccueilStyles.panneTotal}>
				<Text style={AccueilStyles.totalLabel}>Total</Text>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={AccueilStyles.totalDuree}>
						{accueilService.formaterDuree(panne.dureeTotale)}
					</Text>
					<Text style={{ marginHorizontal: 10 }}>•</Text>
					<Text style={AccueilStyles.totalPrix}>
						{accueilService.formaterPrix(panne.prixTotal)}
					</Text>
				</View>
			</View>
		</View>
	);

	return (
		<View style={AccueilStyles.container}>
			<ScrollView
				style={AccueilStyles.container}
				contentContainerStyle={AccueilStyles.scrollContainer}
				refreshControl={
				<RefreshControl 
					refreshing={refreshing} 
					onRefresh={onRefresh}
					colors={[Colors.blue]}
				/>
				}
				showsVerticalScrollIndicator={false}
			>
				
				<View style={AccueilStyles.welcomeContainer}>
					<Text style={AccueilStyles.welcomeTitle}>
						Bonjour, {username} !
					</Text>
				</View>

				{statistiques && (
					<View style={AccueilStyles.statsContainer}>
						<Text style={AccueilStyles.statsTitle}>Vue d'ensemble</Text>
						<View style={AccueilStyles.statsGrid}>
							<View style={AccueilStyles.statCard}>
								<Text style={AccueilStyles.statValue}>
									{statistiques.totalPannesEnCours}
								</Text>
								<Text style={AccueilStyles.statLabel}>
									Pannes{'\n'}en cours
								</Text>
							</View>
							
							<View style={AccueilStyles.statCard}>
								<Text style={AccueilStyles.statValue}>
									{accueilService.formaterDuree(statistiques.totalDureeEstimee)}
								</Text>
								<Text style={AccueilStyles.statLabel}>
									Durée{'\n'}estimée
								</Text>
							</View>
						</View>
					</View>
				)}

				<View style={AccueilStyles.sectionContainer}>
					<View style={AccueilStyles.sectionHeader}>
						<Text style={AccueilStyles.sectionTitle}>
							Réparations en cours
						</Text>
						<Text style={AccueilStyles.sectionCount}>
							{pannesEnCours.length}
						</Text>
					</View>

					{pannesEnCours.length === 0 ? (
						renderEmptyState()
					) : (
						<View style={AccueilStyles.panneList}>
							{pannesEnCours.map(renderPanneCard)}
						</View>
					)}
				</View>

			</ScrollView>

		</View>
	);

	
}