import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import registerService from '../../../services/Inscription/InscriptionService';
import InscriptionStyles from '../../../styles/Inscription.css';

export default function InscriptionPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleRegister = async () => {
		
		if (password !== confirmPassword) {
			setErrorMessage('Les mots de passe ne correspondent pas');
			return;
		}
		
		if (password.length < 6) {
			setErrorMessage('Le mot de passe doit contenir au moins 6 caractères');
			return;
		}

		setIsLoading(true);
		setErrorMessage('');
		
		const result = await registerService.register(email, password);
		
		if (result.success) {
			router.push('/pages/Accueil/AccueilPage');
		} else {
			setErrorMessage(result.message ?? 'Erreur inconnue');
		}
		
		setIsLoading(false);
	};

  	return (
		<View style={InscriptionStyles.container}>
			<View style={InscriptionStyles.formContainer}>
				<Text style={InscriptionStyles.title}>Inscription</Text>

				<Text style={InscriptionStyles.label}>Email</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="Votre email"
					placeholderTextColor="#999"
					autoCapitalize="none"
					keyboardType="email-address"
					style={InscriptionStyles.input}
				/>

				<Text style={InscriptionStyles.label}>Mot de passe</Text>
				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder="Votre mot de passe"
					placeholderTextColor="#999"
					secureTextEntry
					style={InscriptionStyles.input}
				/>

				<Text style={InscriptionStyles.label}>Confirmer le mot de passe</Text>
				<TextInput
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					placeholder="Confirmez votre mot de passe"
					placeholderTextColor="#999"
					secureTextEntry
					style={InscriptionStyles.input}
				/>

				{errorMessage ? (
				<Text style={InscriptionStyles.errorText}>{errorMessage}</Text>
				) : null}

				<TouchableOpacity 
					style={InscriptionStyles.registerButton} 
					onPress={handleRegister}
					disabled={isLoading}
				>
					<Text style={InscriptionStyles.registerButtonText}>
						{isLoading ? 'Inscription...' : "S'inscrire"}
					</Text>
				</TouchableOpacity>

				<View style={InscriptionStyles.linkContainer}>
					<TouchableOpacity onPress={() => router.push('/pages/Login/LoginPage')}>
						<Text style={InscriptionStyles.linkText}>Déjà un compte ? Se connecter</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

}