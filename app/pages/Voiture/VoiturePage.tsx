// app/pages/Voiture/VoiturePage.tsx
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Alert,
	Modal,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import VoitureStyles from '../../../styles/Voiture.css';
import voitureService, { Voiture } from '../../../services/Voiture/VoitureService';
import { Colors, Sizes } from '../../../styles/Common.css';

export default function VoiturePage() {
	
	const [voitures, setVoitures] = useState<Voiture[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedVoiture, setSelectedVoiture] = useState<Voiture | null>(null);
	
  	// États du formulaire
	const [matricule, setMatricule] = useState('');
	const [marque, setMarque] = useState('');
	const [modele, setModele] = useState('');
	const [annee, setAnnee] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	const loadVoitures = async () => {
		try {
			const data = await voitureService.getVoitures();
			setVoitures(data);
		} catch (error: any) {
			Alert.alert('Erreur', error.message || 'Impossible de charger les voitures');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};
  
	useEffect(() => {
		loadVoitures();
	}, []);
  
	const onRefresh = () => {
		setRefreshing(true);
		loadVoitures();
	};

	const resetForm = () => {
		setMatricule('');
		setMarque('');
		setModele('');
		setAnnee('');
		setError('');
	};
  

	const handleAddVoiture = async () => {  // Ajouter une voiture
		if (!matricule.trim()) {
			setError('Le matricule est obligatoire');
			return;
		}
		
		if (matricule.length < 4) {
			setError('Le matricule doit contenir au moins 4 caractères');
			return;
		}
		
		setSubmitting(true);
		setError('');
		
		try {
			await voitureService.ajouterVoiture({
				matricule,
				marque: marque.trim(),
				modele: modele.trim(),
				annee: annee ? parseInt(annee) : undefined,
			});
		
			Alert.alert('Succès', 'Voiture ajoutée avec succès');
			resetForm();
			setShowAddModal(false);
			loadVoitures();
		} catch (error: any) {
			setError(error.message || 'Erreur lors de l\'ajout de la voiture');
		} finally {
			setSubmitting(false);
		}
	};
  
	const confirmDelete = (voiture: Voiture) => {
		setSelectedVoiture(voiture);
		setShowDeleteModal(true);
	};
  
  
	const handleDeleteVoiture = async () => { // Supprimer la voiture
		if (!selectedVoiture?.id) return;
		
		try {
		
			const { peutSupprimer, message } = await voitureService.peutSupprimerVoiture(selectedVoiture.id); // Vérifier si la voiture peut être supprimée
		
			if (!peutSupprimer) {
				Alert.alert('Impossible de supprimer', message || 'Cette voiture ne peut pas être supprimée');
				setShowDeleteModal(false);
				return;
		}
		
			await voitureService.supprimerVoiture(selectedVoiture.id);
		
			Alert.alert('Succès', 'Voiture supprimée avec succès');
			setShowDeleteModal(false);
			setSelectedVoiture(null);
			loadVoitures();
		} catch (error: any) {
			Alert.alert('Erreur', error.message || 'Impossible de supprimer la voiture');
			setShowDeleteModal(false);
		}
	};
  
	const getFormattedMatricule = (mat: string) => {
		return voitureService.formaterMatricule(mat);
	};
  

	if (loading) {   // Rendu du chargement
		return (
			<View style={[VoitureStyles.container, VoitureStyles.loadingContainer]}>
				<ActivityIndicator size="large" color={Colors.blue} />
			</View>
		);
	}
  
	return (
		<View style={VoitureStyles.container}>
			<ScrollView
				style={VoitureStyles.container}
				contentContainerStyle={VoitureStyles.scrollContainer}
				refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={VoitureStyles.headerContainer}>
					<Text style={VoitureStyles.headerTitle}>
						Mes véhicules
					</Text>
					<Text style={VoitureStyles.headerSubtitle}>
						Gérez vos véhicules enregistrés et suivez leur historique de maintenance
					</Text>
				</View>
				
				{/* Bouton ajouter */}
				<View style={VoitureStyles.addButtonContainer}>
					<TouchableOpacity
						style={VoitureStyles.addButton}
						onPress={() => setShowAddModal(true)}
						activeOpacity={0.7}
					>
						<Text style={VoitureStyles.addButtonText}>
							Ajouter un véhicule
						</Text>
					</TouchableOpacity>
				</View>
				
				{/* Liste des voitures */}
				<View style={VoitureStyles.voitureList}>
					{voitures.length === 0 ? (
						<View style={VoitureStyles.emptyState}>
						<Icon name="directions-car" size={60} style={VoitureStyles.emptyStateIcon} />
						<Text style={VoitureStyles.emptyStateText}>
							Aucun véhicule enregistré
						</Text>
						<Text style={VoitureStyles.emptyStateSubtext}>
							Ajoutez votre premier véhicule pour commencer
						</Text>
						</View>
					) : (
						voitures.map((voiture) => (
							<View key={voiture.id} style={VoitureStyles.voitureCard}>
								
								<View style={VoitureStyles.voitureHeader}> {/* En-tête avec matricule et bouton suppression */}
									<View style={VoitureStyles.matriculeContainer}>
										<Text style={VoitureStyles.matriculeText}>
											{getFormattedMatricule(voiture.matricule)}
										</Text>
									</View>
									
									<TouchableOpacity
										style={VoitureStyles.deleteButton}
										onPress={() => confirmDelete(voiture)}
										activeOpacity={0.7}
									>
										<Icon name="delete-outline" size={24} style={VoitureStyles.deleteIcon} />
									</TouchableOpacity>
								</View>
								
								{/* Informations de la voiture */}
								<View style={VoitureStyles.infoContainer}>
									{(voiture.marque || voiture.modele) && (
										<View style={VoitureStyles.infoRow}>
											<Icon name="directions-car" size={20} style={VoitureStyles.infoIcon} />
											<Text style={VoitureStyles.infoLabel}>Véhicule</Text>
											<Text style={VoitureStyles.infoValue}>
												{voiture.marque || 'Non spécifié'} {voiture.modele ? `- ${voiture.modele}` : ''}
											</Text>
										</View>
									)}
									
									{voiture.annee && (
										<View style={VoitureStyles.infoRow}>
											<Icon name="calendar-today" size={20} style={VoitureStyles.infoIcon} />
											<Text style={VoitureStyles.infoLabel}>Année</Text>
											<Text style={VoitureStyles.infoValue}>
												{voiture.annee} ({voitureService.calculerAgeVoiture(voiture.annee)})
											</Text>
										</View>
									)}
									
									<View style={VoitureStyles.infoRow}>
										<Icon name="date-range" size={20} style={VoitureStyles.infoIcon} />
										<Text style={VoitureStyles.infoLabel}>Ajoutée le</Text>
										<Text style={VoitureStyles.infoValue}>
											{voiture.dateAjout?.toLocaleDateString('fr-FR') || 'Date inconnue'}
										</Text>
									</View>
								</View>
							</View>
						))
					)}
				</View>
			</ScrollView>
		
		{/* Modal d'ajout de voiture */}
		<Modal
			visible={showAddModal}
			transparent={true}
			animationType="slide"
			onRequestClose={() => {
			setShowAddModal(false);
			resetForm();
			}}
		>
			<View style={VoitureStyles.modalOverlay}>
				<View style={VoitureStyles.modalContent}>
					<TouchableOpacity
						style={VoitureStyles.closeButton}
						onPress={() => {
							setShowAddModal(false);
							resetForm();
						}}
					>
					</TouchableOpacity>
					
					<Text style={VoitureStyles.modalTitle}>
						Ajouter un véhicule
					</Text>
					
					<View style={VoitureStyles.formContainer}>
						{error ? (
							<Text style={VoitureStyles.errorText}>{error}</Text>
						) : null}
						
						<Text style={VoitureStyles.formLabel}>Matricule *</Text>
						<TextInput
							value={matricule}
							onChangeText={setMatricule}
							placeholder="Ex: 1234TAB ou 1234-TAB-123"
							style={VoitureStyles.formInput}
							autoCapitalize="characters"
							maxLength={12}
						/>
						
						<View style={VoitureStyles.formRow}>
							<View style={[VoitureStyles.formHalf, VoitureStyles.formHalfLast]}>
								<Text style={VoitureStyles.formLabel}>Marque</Text>
								<TextInput
									value={marque}
									onChangeText={setMarque}
									placeholder="Ex: Toyota"
									style={VoitureStyles.formInput}
								/>
							</View>
							<View style={[VoitureStyles.formHalf, VoitureStyles.formHalfLast]}>
								<Text style={VoitureStyles.formLabel}>Modèle</Text>
								<TextInput
									value={modele}
									onChangeText={setModele}
									placeholder="Ex: Corolla"
									style={VoitureStyles.formInput}
								/>
							</View>
						</View>
						
						<Text style={VoitureStyles.formLabel}>Année</Text>
						<TextInput
							value={annee}
							onChangeText={setAnnee}
							placeholder="Ex: 2020"
							style={VoitureStyles.formInput}
							keyboardType="numeric"
							maxLength={4}
						/>
						
						<TouchableOpacity
							style={VoitureStyles.submitButton}
							onPress={handleAddVoiture}
							disabled={submitting}
						>
							{submitting ? (
							<ActivityIndicator color={Colors.white} />
							) : (
							<Text style={VoitureStyles.submitButtonText}>
								Ajouter le véhicule
							</Text>
							)}
						</TouchableOpacity>
						
						<TouchableOpacity
							style={VoitureStyles.cancelButton}
							onPress={() => {
							setShowAddModal(false);
							resetForm();
							}}
						>
							<Text style={VoitureStyles.cancelButtonText}>Annuler</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
		
		{/* Modal de confirmation de suppression */}
		<Modal
			visible={showDeleteModal}
			transparent={true}
			animationType="fade"
			onRequestClose={() => setShowDeleteModal(false)}
		>
			<View style={VoitureStyles.modalOverlay}>
				<View style={VoitureStyles.confirmationModal}>
					<Icon name="warning" size={50} style={VoitureStyles.warningIcon} />
					
					<Text style={VoitureStyles.confirmationTitle}>
						Supprimer le véhicule
					</Text>
					
					<Text style={VoitureStyles.confirmationMessage}>
						Êtes-vous sûr de vouloir supprimer le véhicule {' '}
						<Text style={{ fontWeight: 'bold' }}>
							{selectedVoiture ? getFormattedMatricule(selectedVoiture.matricule) : ''}
						</Text>
						{' '}? Cette action est irréversible.
					</Text>
					
					<View style={VoitureStyles.buttonRow}>
						<TouchableOpacity
							style={VoitureStyles.cancelConfirmButton}
							onPress={() => setShowDeleteModal(false)}
						>
							<Text style={VoitureStyles.cancelConfirmButtonText}>
								Annuler
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity
							style={VoitureStyles.confirmButton}
							onPress={handleDeleteVoiture}
						>
							<Text style={VoitureStyles.confirmButtonText}>
								Supprimer
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
		</View>
	);
}