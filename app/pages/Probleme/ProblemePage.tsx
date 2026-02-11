// app/pages/Probleme/ProblemePage.tsx
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	Modal,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProblemeStyles from '../../../styles/Probleme.css';
import problemeService, { 
	Voiture, 
	PanneType 
} from '../../../services/Probleme/ProblemeService';
import { Colors, Sizes } from '../../../styles/Common.css';
import { router } from 'expo-router';

export default function ProblemePage() {
  
	const [voitures, setVoitures] = useState<Voiture[]>([]);
	const [panneTypes, setPanneTypes] = useState<PanneType[]>([]);
	const [selectedVoiture, setSelectedVoiture] = useState<Voiture | null>(null);
	const [selectedPanneTypes, setSelectedPanneTypes] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	
	const [estimation, setEstimation] = useState({
		dureeTotale: 0,
		prixTotal: 0,
		details: [] as Array<{ nom: string; duree: number; prix: number }>,
	});
  
	const loadData = async () => {
		try {
			const [voituresData, panneTypesData] = await Promise.all([
				problemeService.getVoitures(),
				problemeService.getPanneTypes(),
			]);
		
			setVoitures(voituresData);
			setPanneTypes(panneTypesData);
		
			if (voituresData.length > 0 && !selectedVoiture) {
				setSelectedVoiture(voituresData[0]);
			}
		} catch (error: any) {
			Alert.alert('Erreur', error.message || 'Impossible de charger les données');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};
  
	useEffect(() => {
		loadData();
	}, []);
  
	useEffect(() => {
		if (selectedPanneTypes.length > 0) {
			updateEstimation();
		} else {
			setEstimation({ dureeTotale: 0, prixTotal: 0, details: [] });
		}
	}, [selectedPanneTypes]);
  
	const updateEstimation = async () => {
		try {
			const result = await problemeService.calculerEstimation(selectedPanneTypes);
			setEstimation(result);
		} catch (error: any) {
			console.error('Erreur lors du calcul de l\'estimation:', error);
		}
	};
  
  	const onRefresh = () => {
		setRefreshing(true);
		loadData();
  	};
  
	const togglePanneType = (panneTypeId: string) => { // Gérer la sélection des types de panne
		if (selectedPanneTypes.includes(panneTypeId)) {
			setSelectedPanneTypes(selectedPanneTypes.filter(id => id !== panneTypeId));
		} else {
			setSelectedPanneTypes([...selectedPanneTypes, panneTypeId]);
		}
	};
	
	const validerFormulaire = (): boolean => { // Valider le formulaire
		if (!selectedVoiture) {
			Alert.alert('Erreur', 'Veuillez sélectionner une voiture');
			return false;
		}
		
		if (selectedPanneTypes.length === 0) {
			Alert.alert('Erreur', 'Veuillez sélectionner au moins un type de panne');
			return false;
		}
		
		return true;
	};
  
	const declarerPanne = async () => { // Déclarer la panne
		if (!validerFormulaire() || !selectedVoiture) return;
		
		setSubmitting(true);
		
		try {
			const result = await problemeService.declarerPanne(
				selectedVoiture.id,
				selectedPanneTypes
			);
			
			if (result.success) {
				Alert.alert('Succès', result.message, [
					{ 
						text: 'OK', 
						onPress: () => {
						setSelectedPanneTypes([]); // Réinitialiser le formulaire
						setEstimation({ dureeTotale: 0, prixTotal: 0, details: [] });
						setShowConfirmation(false);
						}
					}
				]);
			} else {
				Alert.alert('Erreur', result.message);
			}
		} catch (error: any) {
			Alert.alert('Erreur', error.message || 'Erreur lors de la déclaration');
		} finally {
			setSubmitting(false);
		}
	};
  
	const formaterMatricule = (matricule: string): string => {
		if (!matricule) return '';
		return matricule.toUpperCase();
	};
  
 
	if (loading) {  // Rendu du chargement
		return (
			<View style={[ProblemeStyles.container, ProblemeStyles.loadingContainer]}>
				<ActivityIndicator size="large" color={Colors.blue} />
			</View>
		);
	}

	if (voitures.length === 0) {
		return (
			<View style={ProblemeStyles.container}>
				<ScrollView
					contentContainerStyle={ProblemeStyles.scrollContainer}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					<View style={ProblemeStyles.emptyState}>
						<Icon name="directions-car" size={60} style={ProblemeStyles.emptyStateIcon} />
						<Text style={ProblemeStyles.emptyStateText}>
							Aucun véhicule enregistré
						</Text>
						<Text style={ProblemeStyles.emptyStateSubtext}>
							Vous devez d'abord ajouter un véhicule pour déclarer une panne
						</Text>
						<TouchableOpacity
							style={ProblemeStyles.emptyStateButton}
							onPress={() => {
								router.push('/pages/Voiture/VoiturePage');
								Alert.alert('Info', 'Naviguer vers la page Voiture');
							}}
						>
							<Text style={ProblemeStyles.emptyStateButtonText}>
								Ajouter un véhicule
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
  
	return (
		<View style={ProblemeStyles.container}>
			<ScrollView
				style={ProblemeStyles.container}
				contentContainerStyle={ProblemeStyles.scrollContainer}
				refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={ProblemeStyles.headerContainer}>
					<Text style={ProblemeStyles.headerTitle}>
						Déclarer une panne
					</Text>
					<Text style={ProblemeStyles.headerSubtitle}>
						Sélectionnez votre véhicule et les problèmes rencontrés
					</Text>
				</View>
				
				{/* Sélection de la voiture */}
				<View style={ProblemeStyles.sectionContainer}>
					<Text style={ProblemeStyles.sectionTitle}>
						1. Sélectionnez votre véhicule
					</Text>
					
					{/* Affichage de la voiture sélectionnée */}
					{selectedVoiture && (
						<View style={ProblemeStyles.selectedVoitureContainer}>
						<Icon name="directions-car" size={24} color={Colors.blue} />
						<View style={ProblemeStyles.selectedVoitureInfo}>
							<Text style={ProblemeStyles.selectedVoitureMatricule}>
							{formaterMatricule(selectedVoiture.matricule)}
							</Text>
							<Text style={ProblemeStyles.selectedVoitureDetails}>
							{selectedVoiture.marque} {selectedVoiture.modele && `- ${selectedVoiture.modele}`}
							</Text>
						</View>
						</View>
					)}
					
					{/* Liste horizontale des voitures */}
					<ScrollView 
						horizontal 
						showsHorizontalScrollIndicator={false}
						style={ProblemeStyles.voitureScrollContainer}
						contentContainerStyle={ProblemeStyles.voitureScrollContent}
					>
						{voitures.map((voiture) => (
						<TouchableOpacity
							key={voiture.id}
							style={[
							ProblemeStyles.voitureCard,
							selectedVoiture?.id === voiture.id && ProblemeStyles.voitureCardSelected
							]}
							onPress={() => setSelectedVoiture(voiture)}
						>
							<Icon 
							name="directions-car" 
							size={20} 
							color={selectedVoiture?.id === voiture.id ? Colors.white : Colors.gray600} 
							/>
							<Text style={[
							ProblemeStyles.voitureCardMatricule,
							selectedVoiture?.id === voiture.id && ProblemeStyles.voitureCardTextSelected
							]}>
							{formaterMatricule(voiture.matricule)}
							</Text>
							{voiture.marque && (
							<Text style={[
								ProblemeStyles.voitureCardMarque,
								selectedVoiture?.id === voiture.id && ProblemeStyles.voitureCardTextSelected
							]}>
								{voiture.marque}
							</Text>
							)}
						</TouchableOpacity>
						))}
					</ScrollView>
				</View>
				
				{/* Sélection des types de panne */}
				<View style={ProblemeStyles.sectionContainer}>
					<Text style={ProblemeStyles.sectionTitle}>
						2. Sélectionnez les problèmes
					</Text>
					
					<View style={ProblemeStyles.panneTypesContainer}>
						{panneTypes.map((panneType) => (
							<TouchableOpacity
								key={panneType.id}
								style={[
								ProblemeStyles.panneTypeItem,
								selectedPanneTypes.includes(panneType.id!) && 
								ProblemeStyles.panneTypeItemSelected
								]}
								onPress={() => togglePanneType(panneType.id!)}
								activeOpacity={0.7}
							>
								<View style={[
									ProblemeStyles.checkbox,
									selectedPanneTypes.includes(panneType.id!) && 
									ProblemeStyles.checkboxSelected
								]}>
									{selectedPanneTypes.includes(panneType.id!) && (
										<Icon name="check" size={16} style={ProblemeStyles.checkIcon} />
									)}
								</View>
								
								<View style={ProblemeStyles.panneTypeInfo}>
									<Text style={ProblemeStyles.panneTypeName}>
										{panneType.nom}
									</Text>
									
									{panneType.description && (
										<Text style={ProblemeStyles.panneTypeDescription}>
										{panneType.description}
										</Text>
									)}
									
									<View style={ProblemeStyles.panneTypeDetails}>
										<Text style={ProblemeStyles.panneTypeDetail}>
											Durée: {problemeService.formaterDuree(panneType.duree)}
										</Text>
										<Text style={ProblemeStyles.panneTypePrice}>
											{problemeService.formaterPrix(panneType.prix)}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
				
				{/* Estimation */}
				{selectedPanneTypes.length > 0 && (
					<View style={ProblemeStyles.estimationContainer}>
						<Text style={ProblemeStyles.estimationTitle}>
							Estimation de réparation
						</Text>
						
						{/* Détails */}
						{estimation.details.length > 0 && (
							<View style={ProblemeStyles.estimationDetails}>
								{estimation.details.map((detail, index) => (
								<View key={index} style={ProblemeStyles.estimationDetailItem}>
									<Text style={ProblemeStyles.estimationDetailName}>
										{detail.nom}
									</Text>
									<Text style={ProblemeStyles.estimationDetailDuree}>
										{problemeService.formaterDuree(detail.duree)}
									</Text>
									<Text style={ProblemeStyles.estimationDetailPrix}>
										{problemeService.formaterPrix(detail.prix)}
									</Text>
								</View>
								))}
							</View>
						)}
						
						{/* Totaux */}
						<View style={ProblemeStyles.estimationTotal}>
							<Text style={ProblemeStyles.estimationTotalLabel}>
								Total
							</Text>
							<View>
								<Text style={ProblemeStyles.estimationTotalValue}>
									{problemeService.formaterDuree(estimation.dureeTotale)}
								</Text>
								<Text style={[ProblemeStyles.estimationTotalValue, { marginTop: Sizes.xs }]}>
									{problemeService.formaterPrix(estimation.prixTotal)}
								</Text>
							</View>
						</View>
					</View>
				)}
				
				{/* Bouton déclarer */}
				<View style={ProblemeStyles.buttonContainer}>
					<TouchableOpacity
						style={[
						ProblemeStyles.declarerButton,
						(!selectedVoiture || selectedPanneTypes.length === 0) && 
						ProblemeStyles.declarerButtonDisabled
						]}
						onPress={() => setShowConfirmation(true)}
						disabled={!selectedVoiture || selectedPanneTypes.length === 0}
						activeOpacity={0.7}
					>
						<Text style={ProblemeStyles.declarerButtonText}>
							Déclarer la panne
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		
		{/* Modal de confirmation */}
		<Modal
			visible={showConfirmation}
			transparent={true}
			animationType="slide"
			onRequestClose={() => setShowConfirmation(false)}
		>
			<View style={ProblemeStyles.modalOverlay}>
				<View style={ProblemeStyles.modalContent}>
					<TouchableOpacity
						style={ProblemeStyles.closeButton}
						onPress={() => setShowConfirmation(false)}
					>
					
					</TouchableOpacity>
					
					<Text style={ProblemeStyles.modalTitle}>
						Confirmer la déclaration
					</Text>
					
					<Text style={ProblemeStyles.confirmationMessage}>
						Vous allez déclarer une panne pour le véhicule :
					</Text>
					
					<View style={ProblemeStyles.confirmationDetails}>
						<View style={ProblemeStyles.confirmationDetailRow}>
							<Text style={ProblemeStyles.confirmationDetailLabel}>
								Véhicule:
							</Text>
							<Text style={ProblemeStyles.confirmationDetailValue}>
								{selectedVoiture ? formaterMatricule(selectedVoiture.matricule) : ''}
							</Text>
						</View>
						
						<View style={ProblemeStyles.confirmationDetailRow}>
							<Text style={ProblemeStyles.confirmationDetailLabel}>
								Types de panne:
							</Text>
							<Text style={ProblemeStyles.confirmationDetailValue}>
								{selectedPanneTypes.length}
							</Text>
						</View>
						
						<View style={ProblemeStyles.confirmationDetailRow}>
							<Text style={ProblemeStyles.confirmationDetailLabel}>
								Durée estimée:
							</Text>
							<Text style={ProblemeStyles.confirmationDetailValue}>
								{problemeService.formaterDuree(estimation.dureeTotale)}
							</Text>
						</View>
						
						<View style={ProblemeStyles.confirmationDetailRow}>
							<Text style={ProblemeStyles.confirmationDetailLabel}>
								Coût estimé:
							</Text>
							<Text style={ProblemeStyles.confirmationDetailValue}>
								{problemeService.formaterPrix(estimation.prixTotal)}
							</Text>
						</View>
					</View>
					
					<Text style={[ProblemeStyles.confirmationMessage, { marginTop: Sizes.md }]}>
						Confirmez-vous cette déclaration ?
					</Text>
					
					<View style={ProblemeStyles.buttonRow}>
						<TouchableOpacity
							style={ProblemeStyles.cancelButton}
							onPress={() => setShowConfirmation(false)}
						>
							<Text style={ProblemeStyles.cancelButtonText}>
								Annuler
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity
							style={ProblemeStyles.confirmButton}
							onPress={declarerPanne}
							disabled={submitting}
						>
							{submitting ? (
							<ActivityIndicator color={Colors.white} />
							) : (
							<Text style={ProblemeStyles.confirmButtonText}>
								Confirmer
							</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	</View>
	);
}