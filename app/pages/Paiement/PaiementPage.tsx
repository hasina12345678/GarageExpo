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
import { Fonts } from '../../../styles/Common.css'; 
import PaiementStyles from '../../../styles/Paiement.css';
import paiementService, { PanneAPayer } from '../../../services/Paiement/PaiementService';
import { Colors, Sizes } from '../../../styles/Common.css';

export default function PaiementPage() {
 
	const [pannes, setPannes] = useState<PanneAPayer[]>([]);
	const [selectedPanne, setSelectedPanne] = useState<PanneAPayer | null>(null);
	const [montant, setMontant] = useState('');
	const [suggestions, setSuggestions] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [error, setError] = useState('');
  
	const loadPannes = async () => {
		try {
			const data = await paiementService.getPannesAPayer();
			setPannes(data);
			
			if (data.length > 0 && !selectedPanne) {
				setSelectedPanne(data[0]);
				updateSuggestions(data[0].montantRestant);
			} else if (selectedPanne) {
				
				const currentPanne = data.find(p => p.id === selectedPanne.id);
				if (currentPanne) {
					setSelectedPanne(currentPanne);
					updateSuggestions(currentPanne.montantRestant);
				} else {
					setSelectedPanne(data.length > 0 ? data[0] : null);
					if (data.length > 0) {
						updateSuggestions(data[0].montantRestant);
					}
				}
			}
		} catch (error: any) {
			setError(error.message || 'Impossible de charger les pannes');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};
  
	useEffect(() => {
		loadPannes();
	}, []);
  
	const onRefresh = () => {
		setRefreshing(true);
		loadPannes();
	};
  
	const updateSuggestions = (montantRestant: number) => {
		const suggestions = paiementService.genererSuggestionsMontant(montantRestant);
		setSuggestions(suggestions);
		
		if (suggestions.length > 0) {
			setMontant(suggestions[0].toString());
		}
	};
  
	const handleSelectPanne = (panne: PanneAPayer) => {
		setSelectedPanne(panne);
		setMontant('');
		updateSuggestions(panne.montantRestant);
		setError('');
	};
  
	const handleSelectSuggestion = (suggestion: number) => {
		setMontant(suggestion.toString());
	};
  
	const validerFormulaire = (): boolean => {
		if (!selectedPanne) {
			setError('Veuillez sélectionner une panne');
			return false;
		}
		
		const montantNum = parseFloat(montant);
		if (isNaN(montantNum) || montantNum <= 0) {
			setError('Veuillez entrer un montant valide');
			return false;
		}
		
		if (montantNum > selectedPanne.montantRestant) {
			setError(`Le montant ne peut pas dépasser ${selectedPanne.montantRestant} MGA`);
			return false;
		}
		
		return true;
	};
  
	const effectuerPaiement = async () => {
		if (!validerFormulaire() || !selectedPanne) return;
		
		setSubmitting(true);
		
		try {
			const result = await paiementService.effectuerPaiement(
				selectedPanne.id,
				parseFloat(montant)
			);
			
			if (result.success) {
				Alert.alert('Succès', result.message, [
				{ 
					text: 'OK', 
					onPress: () => {
						setShowConfirmation(false);
						setMontant('');
						loadPannes(); 
					}
				}
				]);
			} else {
				Alert.alert('Erreur', result.message);
			}
		} catch (error: any) {
			Alert.alert('Erreur', error.message || 'Erreur lors du paiement');
		} finally {
			setSubmitting(false);
		}
	};
  
	const formaterDate = (date: Date): string => {
		return date.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};
  
	if (loading) {   // Rendu du chargement
		return (
			<View style={[PaiementStyles.container, PaiementStyles.loadingContainer]}>
				<ActivityIndicator size="large" color={Colors.blue} />
			</View>
		);
	}
  
	if (pannes.length === 0) {
		return (
			<View style={PaiementStyles.container}>
				<ScrollView
					contentContainerStyle={PaiementStyles.scrollContainer}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					<View style={PaiementStyles.emptyState}>
						<Icon name="check-circle" size={60} style={PaiementStyles.emptyStateIcon} />
						<Text style={PaiementStyles.emptyStateText}>
							Aucune panne à payer
						</Text>
						<Text style={PaiementStyles.emptyStateSubtext}>
							Toutes vos pannes sont payées ou en attente de réparation
						</Text>
					</View>
				</ScrollView>
			</View>
		);
	}
  
	return (
		<View style={PaiementStyles.container}>
			<ScrollView
				style={PaiementStyles.container}
				contentContainerStyle={PaiementStyles.scrollContainer}
				refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={PaiementStyles.headerContainer}>
					<Text style={PaiementStyles.headerTitle}>
						Paiement des pannes
					</Text>
					<Text style={PaiementStyles.headerSubtitle}>
						Effectuez vos paiements pour les réparations effectuées
					</Text>
				</View>
				
				{/* Message d'erreur */}
				{error ? (
				<View style={PaiementStyles.errorContainer}>
					<Text style={PaiementStyles.errorText}>{error}</Text>
				</View>
				) : null}
				
				<View style={PaiementStyles.sectionContainer}>
					<Text style={PaiementStyles.sectionTitle}>
						1. Sélectionnez la panne à payer
					</Text>
					
					<TouchableOpacity
						style={PaiementStyles.panneSelector}
						onPress={() => {
						Alert.alert(
							'Sélectionner une panne',
							'Choisissez une panne à payer',
							pannes.map(panne => ({
							text: `${panne.matriculeVoiture || 'Inconnu'} - ${formaterDate(panne.dateHeure)}`,
							onPress: () => handleSelectPanne(panne),
							})).concat([{
							text: 'Annuler',
							style: 'cancel',
							}])
						);
						}}
						activeOpacity={0.7}
					>
						{selectedPanne ? (
						<Text style={PaiementStyles.panneSelectorValue}>
							{selectedPanne.matriculeVoiture || 'Inconnu'} - {formaterDate(selectedPanne.dateHeure)}
						</Text>
						) : (
						<Text style={PaiementStyles.panneSelectorPlaceholder}>
							Sélectionnez une panne...
						</Text>
						)}
					</TouchableOpacity>
					
					{/* Détails de la panne sélectionnée */}
					{selectedPanne && (
						<View style={PaiementStyles.panneDetailsContainer}>
							<View style={PaiementStyles.panneDetailRow}>
								<Text style={PaiementStyles.panneDetailLabel}>Véhicule:</Text>
								<Text style={PaiementStyles.panneDetailValue}>
									{selectedPanne.matriculeVoiture || 'Inconnu'}
									{selectedPanne.marqueVoiture && ` (${selectedPanne.marqueVoiture})`}
								</Text>
							</View>
							
							<View style={PaiementStyles.panneDetailRow}>
								<Text style={PaiementStyles.panneDetailLabel}>Date:</Text>
								<Text style={PaiementStyles.panneDetailValue}>
									{formaterDate(selectedPanne.dateHeure)}
								</Text>
							</View>
							
							{/* Liste des détails de pannes */}
							{selectedPanne.detailsPannes.length > 0 && (
								<View style={PaiementStyles.detailsList}>
								{selectedPanne.detailsPannes.map((detail, index) => (
									<View key={index} style={PaiementStyles.detailItem}>
										<Text style={PaiementStyles.detailName}>{detail.nom}</Text>
										<Text style={PaiementStyles.detailPrix}>
											{paiementService.formaterPrix(detail.prix)}
										</Text>
									</View>
								))}
								</View>
							)}
							
							<View style={PaiementStyles.panneDetailTotal}>
								<Text style={PaiementStyles.panneDetailTotalLabel}>Montant total:</Text>
								<Text style={PaiementStyles.panneDetailTotalValue}>
									{paiementService.formaterPrix(selectedPanne.montantTotal)}
								</Text>
							</View>
							
							<View style={PaiementStyles.panneDetailRow}>
								<Text style={PaiementStyles.panneDetailLabel}>Déjà payé:</Text>
								<Text style={PaiementStyles.panneDetailValue}>
									{paiementService.formaterPrix(selectedPanne.montantDejaPaye)}
								</Text>
							</View>
							
							<View style={[PaiementStyles.panneDetailRow, { marginTop: Sizes.sm }]}>
								<Text style={[PaiementStyles.panneDetailLabel, { fontWeight: '600' }]}>
									Reste à payer:
								</Text>
								<Text style={PaiementStyles.panneDetailRestant}>
									{paiementService.formaterPrix(selectedPanne.montantRestant)}
								</Text>
							</View>
						</View>
					)}
				</View>
				
				{/* Saisie du montant */}
				{selectedPanne && (
					<View style={PaiementStyles.montantContainer}>
						<Text style={PaiementStyles.montantTitle}>
							2. Entrez le montant à payer
						</Text>
						
						<TextInput
							value={montant}
							onChangeText={setMontant}
							placeholder="0"
							keyboardType="numeric"
							style={PaiementStyles.montantInput}
							onFocus={() => setError('')}
						/>
						
						<Text style={{ fontSize: Fonts.small, color: Colors.gray600, marginBottom: Sizes.sm }}>
							Suggestions:
						</Text>
						
						<View style={PaiementStyles.suggestionsContainer}>
							{suggestions.map((suggestion, index) => (
								<TouchableOpacity
									key={index}
									style={[
										PaiementStyles.suggestionButton,
										montant === suggestion.toString() && PaiementStyles.suggestionButtonActive
									]}
									onPress={() => handleSelectSuggestion(suggestion)}
									activeOpacity={0.7}
								>
									<Text style={[
										PaiementStyles.suggestionButtonText,
										montant === suggestion.toString() && PaiementStyles.suggestionButtonTextActive
									]}>
										{paiementService.formaterPrix(suggestion)}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)}
				
				{/* Résumé du paiement */}
				{selectedPanne && montant && !isNaN(parseFloat(montant)) && (
					<View style={PaiementStyles.resumeContainer}>
						<Text style={PaiementStyles.resumeTitle}>
							Récapitulatif du paiement
						</Text>
						
						<View style={PaiementStyles.resumeRow}>
							<Text style={PaiementStyles.resumeLabel}>Montant à payer:</Text>
							<Text style={PaiementStyles.resumeValue}>
								{paiementService.formaterPrix(parseFloat(montant))}
							</Text>
						</View>
						
						<View style={PaiementStyles.resumeRow}>
							<Text style={PaiementStyles.resumeLabel}>Déjà payé:</Text>
							<Text style={PaiementStyles.resumeValue}>
								{paiementService.formaterPrix(selectedPanne.montantDejaPaye)}
							</Text>
						</View>
						
						<View style={PaiementStyles.resumeRow}>
							<Text style={PaiementStyles.resumeLabel}>Nouveau total payé:</Text>
							<Text style={PaiementStyles.resumeValue}>
								{paiementService.formaterPrix(selectedPanne.montantDejaPaye + parseFloat(montant))}
							</Text>
						</View>
						
						<View style={PaiementStyles.resumeTotal}>
							<Text style={PaiementStyles.resumeTotalLabel}>Reste après paiement:</Text>
							<Text style={PaiementStyles.resumeTotalValue}>
								{paiementService.formaterPrix(selectedPanne.montantRestant - parseFloat(montant))}
							</Text>
						</View>
					</View>
				)}
				
				{/* Bouton payer */}
				<View style={PaiementStyles.buttonContainer}>
					<TouchableOpacity
						style={[
						PaiementStyles.payerButton,
						(!selectedPanne || !montant || isNaN(parseFloat(montant))) && 
						PaiementStyles.payerButtonDisabled
						]}
						onPress={() => setShowConfirmation(true)}
						disabled={!selectedPanne || !montant || isNaN(parseFloat(montant))}
						activeOpacity={0.7}
					>
						<Text style={PaiementStyles.payerButtonText}>
							Effectuer le paiement
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
			<View style={PaiementStyles.modalOverlay}>
				<View style={PaiementStyles.modalContent}>
					<TouchableOpacity
						style={PaiementStyles.closeButton}
						onPress={() => setShowConfirmation(false)}
					>
					</TouchableOpacity>
					
					<Text style={PaiementStyles.modalTitle}>
						Confirmer le paiement
					</Text>
					
					<Text style={PaiementStyles.confirmationMessage}>
						Vous allez effectuer un paiement de :
					</Text>
					
					<View style={PaiementStyles.confirmationDetails}>
						<View style={PaiementStyles.confirmationDetailRow}>
							<Text style={PaiementStyles.confirmationDetailLabel}>
								Montant:
							</Text>
							<Text style={PaiementStyles.confirmationDetailValue}>
								{paiementService.formaterPrix(parseFloat(montant))}
							</Text>
						</View>
						
						<View style={PaiementStyles.confirmationDetailRow}>
							<Text style={PaiementStyles.confirmationDetailLabel}>
								Pour la panne du:
							</Text>
							<Text style={PaiementStyles.confirmationDetailValue}>
								{selectedPanne ? formaterDate(selectedPanne.dateHeure) : ''}
							</Text>
						</View>
						
						<View style={PaiementStyles.confirmationDetailRow}>
							<Text style={PaiementStyles.confirmationDetailLabel}>
								Véhicule:
							</Text>
							<Text style={PaiementStyles.confirmationDetailValue}>
								{selectedPanne?.matriculeVoiture || 'Inconnu'}
							</Text>
						</View>
						
						<View style={PaiementStyles.confirmationDetailRow}>
							<Text style={PaiementStyles.confirmationDetailLabel}>
								Reste à payer après:
							</Text>
							<Text style={PaiementStyles.confirmationDetailValue}>
								{selectedPanne ? paiementService.formaterPrix(selectedPanne.montantRestant - parseFloat(montant)) : ''}
							</Text>
						</View>
					</View>
						
					<Text style={[PaiementStyles.confirmationMessage, { marginTop: Sizes.md }]}>
						Confirmez-vous ce paiement ?
					</Text>
					
					<View style={PaiementStyles.buttonRow}>
						<TouchableOpacity
							style={PaiementStyles.cancelButton}
							onPress={() => setShowConfirmation(false)}
						>
							<Text style={PaiementStyles.cancelButtonText}>
							Annuler
							</Text>
						</TouchableOpacity>
						
						<TouchableOpacity
							style={PaiementStyles.confirmButton}
							onPress={effectuerPaiement}
							disabled={submitting}
						>
							{submitting ? (
							<ActivityIndicator color={Colors.white} />
							) : (
							<Text style={PaiementStyles.confirmButtonText}>
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