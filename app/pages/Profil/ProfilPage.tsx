// app/pages/Profil/ProfilPage.tsx
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfilStyles from '../../../styles/Profil.css';
import profilService from '../../../services/Profil/ProfilService';

export default function ProfilPage() {
	const [userInfo, setUserInfo] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [changingPassword, setChangingPassword] = useState(false);
	const [passwordError, setPasswordError] = useState('');
	const [passwordSuccess, setPasswordSuccess] = useState('');
  
	useEffect(() => {
		loadUserInfo();
	}, []);
  
	const loadUserInfo = () => {
		setLoading(true);
		const info = profilService.getUserInfo();
		
		if (info && info.email) {
			const email = info.email;
			const nameFromEmail = email.split('@')[0];
			
			const formattedName = nameFromEmail
				.split('.')
				.map(part => part.charAt(0).toUpperCase() + part.slice(1))
				.join(' ');
			
			info.displayName = formattedName || nameFromEmail;
		}
		
		setUserInfo(info);
		setLoading(false);
	};
  
	const getInitials = () => {
		if (!userInfo?.displayName) return '?';
		
		return userInfo.displayName
		.split(' ')
		.map(part => part.charAt(0))
		.join('')
		.toUpperCase()
		.substring(0, 2);
	};
  
	const handleChangePassword = async () => {
		// Validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			setPasswordError('Veuillez remplir tous les champs');
			return;
		}
		
		if (newPassword.length < 6) {
			setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
			return;
		}
		
		if (newPassword !== confirmPassword) {
			setPasswordError('Les mots de passe ne correspondent pas');
			return;
		}
		
		setChangingPassword(true);
		setPasswordError('');
		setPasswordSuccess('');
		
		const result = await profilService.changePassword(currentPassword, newPassword);
		
		if (result.success) {
			setPasswordSuccess(result.message);
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
			
			setTimeout(() => {
				setShowPasswordForm(false);
				setPasswordSuccess('');
			}, 2000);
		} else {
			setPasswordError(result.message);
		}
		
		setChangingPassword(false);
	};
  
	const formatDate = (dateString?: string) => {
		if (!dateString) return 'Non disponible';
		
		const date = new Date(dateString);

		return date.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};
  
	const getUsernameFromEmail = (email: string) => {
		if (!email) return 'Utilisateur';
		
		const username = email.split('@')[0];
		
		// Formatter le nom : john.doe@gmail.com → John Doe
		return username
		.split('.')
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
	};
  
  	// obtenir l'email sans le nom de domaine
	const getEmailWithoutDomain = (email: string) => {
		if (!email) return '';
		return email.split('@')[0];
	};
  
	if (loading) {
		return (
			<View style={[ProfilStyles.container, Layout.center]}>
				<ActivityIndicator size="large" color={Colors.blue} />
			</View>
		);
	}
	
	if (!userInfo) {
		return (
			<View style={[ProfilStyles.container, Layout.center]}>
				<Text>Veuillez vous connecter pour voir votre profil</Text>
			</View>
		);
	}
  
	const username = getUsernameFromEmail(userInfo.email);
	const emailLocalPart = getEmailWithoutDomain(userInfo.email);
  
	return (
		<View style={ProfilStyles.container}>
		<ScrollView 
			style={ProfilStyles.container}
			contentContainerStyle={ProfilStyles.scrollContainer}
			showsVerticalScrollIndicator={false}
		>
			{/* Header avec avatar */}
			<View style={ProfilStyles.headerContainer}>
			<View style={ProfilStyles.avatarContainer}>
				<Text style={ProfilStyles.avatarText}>
				{getInitials()}
				</Text>
			</View>
			
			<Text style={ProfilStyles.userName}>
				{username}
			</Text>
			
			<Text style={ProfilStyles.userEmail}>
				{userInfo.email}
			</Text>
			
			{userInfo.emailVerified && (
				<View style={styles.verifiedBadge}>
				<Icon name="verified" size={16} color={Colors.success} />
				<Text style={styles.verifiedText}>Email vérifié</Text>
				</View>
			)}
			</View>
			
			{/* Informations du compte */}
			<View style={ProfilStyles.sectionContainer}>
			<Text style={ProfilStyles.sectionTitle}>
				Informations du compte
			</Text>
			
			<View style={ProfilStyles.infoCard}>
				<View style={ProfilStyles.infoRow}>
				<Icon name="email" size={20} style={ProfilStyles.infoIcon} />
				<Text style={ProfilStyles.infoLabel}>Email complet</Text>
				<Text style={ProfilStyles.infoValue}>{userInfo.email}</Text>
				</View>
				
				<View style={ProfilStyles.infoRow}>
				<Icon name="person" size={20} style={ProfilStyles.infoIcon} />
				<Text style={ProfilStyles.infoLabel}>Nom d'utilisateur</Text>
				<Text style={ProfilStyles.infoValue}>{emailLocalPart}</Text>
				</View>
				
				<View style={[ProfilStyles.infoRow, ProfilStyles.infoRowLast]}>
				<Icon name="account-box" size={20} style={ProfilStyles.infoIcon} />
				<Text style={ProfilStyles.infoLabel}>Nom affiché</Text>
				<Text style={ProfilStyles.infoValue}>{username}</Text>
				</View>
			</View>
			
			{/* Informations de connexion */}
			<Text style={ProfilStyles.sectionTitle}>
				Historique de connexion
			</Text>
			
			<View style={ProfilStyles.infoCard}>
				<View style={ProfilStyles.infoRow}>
				<Icon name="fingerprint" size={20} style={ProfilStyles.infoIcon} />
				<Text style={ProfilStyles.infoLabel}>ID Utilisateur</Text>
				<Text style={[ProfilStyles.infoValue, styles.userIdText]}>
					{userInfo.uid.substring(0, 10)}...
				</Text>
				</View>
				
				<View style={ProfilStyles.infoRow}>
				<Icon name="add-circle" size={20} style={ProfilStyles.infoIcon} />
				<Text style={ProfilStyles.infoLabel}>Compte créé le</Text>
				<Text style={ProfilStyles.infoValue}>
					{formatDate(userInfo.creationTime)}
				</Text>
				</View>
				
				<View style={[ProfilStyles.infoRow, ProfilStyles.infoRowLast]}>
				<Icon name="update" size={20} style={ProfilStyles.infoIcon} />
				<Text style={ProfilStyles.infoLabel}>Dernière connexion</Text>
				<Text style={ProfilStyles.infoValue}>
					{formatDate(userInfo.lastSignInTime)}
				</Text>
				</View>
			</View>
			</View>
			
			{/* Actions - SEULEMENT changement de mot de passe */}
			<View style={ProfilStyles.actionsContainer}>
			<TouchableOpacity 
				style={ProfilStyles.actionButton}
				onPress={() => setShowPasswordForm(true)}
				activeOpacity={0.7}
			>
				<Icon name="lock-reset" size={24} style={ProfilStyles.actionIcon} />
				<Text style={ProfilStyles.actionText}>Changer le mot de passe</Text>
				<Icon name="chevron-right" size={24} style={ProfilStyles.actionArrow} />
			</TouchableOpacity>
			</View>
		</ScrollView>
		
		{/* Modal pour changer le mot de passe */}
		<Modal
			visible={showPasswordForm}
			transparent={true}
			animationType="slide"
			onRequestClose={() => setShowPasswordForm(false)}
		>
			<View style={ProfilStyles.modalOverlay}>
			<View style={ProfilStyles.modalContent}>
				<TouchableOpacity 
				style={ProfilStyles.closeButton}
				onPress={() => setShowPasswordForm(false)}
				>
				</TouchableOpacity>
				
				<Text style={ProfilStyles.modalTitle}>
				Changer le mot de passe
				</Text>
				
				<View style={ProfilStyles.passwordForm}>
				{passwordError ? (
					<Text style={ProfilStyles.errorText}>{passwordError}</Text>
				) : null}
				
				{passwordSuccess ? (
					<Text style={ProfilStyles.successText}>{passwordSuccess}</Text>
				) : null}
				
				<Text style={ProfilStyles.formLabel}>Mot de passe actuel</Text>
				<TextInput
					value={currentPassword}
					onChangeText={setCurrentPassword}
					placeholder="Entrez votre mot de passe actuel"
					secureTextEntry
					style={ProfilStyles.formInput}
					autoCapitalize="none"
				/>
				
				<Text style={ProfilStyles.formLabel}>Nouveau mot de passe</Text>
				<TextInput
					value={newPassword}
					onChangeText={setNewPassword}
					placeholder="Minimum 6 caractères"
					secureTextEntry
					style={ProfilStyles.formInput}
					autoCapitalize="none"
				/>
				
				<Text style={ProfilStyles.formLabel}>Confirmer le nouveau mot de passe</Text>
				<TextInput
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					placeholder="Confirmez votre nouveau mot de passe"
					secureTextEntry
					style={ProfilStyles.formInput}
					autoCapitalize="none"
				/>
				
				<TouchableOpacity 
					style={ProfilStyles.submitButton}
					onPress={handleChangePassword}
					disabled={changingPassword}
				>
					{changingPassword ? (
					<ActivityIndicator color={Colors.white} />
					) : (
					<Text style={ProfilStyles.submitButtonText}>
						Changer le mot de passe
					</Text>
					)}
				</TouchableOpacity>
				
				<TouchableOpacity 
					style={ProfilStyles.cancelButton}
					onPress={() => setShowPasswordForm(false)}
				>
					<Text style={ProfilStyles.cancelButtonText}>Annuler</Text>
				</TouchableOpacity>
				</View>
			</View>
			</View>
		</Modal>
		</View>
	);
}


const styles = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: '#38A169',
    marginLeft: 4,
    fontWeight: '500',
  },
  userIdText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
};

const Colors = {
  blue: '#4299E1',
  white: '#FFFFFF',
  gray500: '#718096',
  gray700: '#2D3748',
  danger: '#E53E3E',
  success: '#38A169',
};

const Layout = {
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};