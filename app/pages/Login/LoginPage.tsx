import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import loginService from '../../../services/Login/LoginService';
import LoginStyles from '../../../styles/Login.css';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		setIsLoading(true);
		setErrorMessage('');
		
		const result = await loginService.login(email, password);
		
		if (result.success) {
			router.push('/pages/Accueil/AccueilPage');
		} else {
			setErrorMessage(result.message ?? 'Erreur inconnue');
		}
		
		setIsLoading(false);
	};

	return (
		<View style={LoginStyles.container}>
			<View style={LoginStyles.formContainer}>
				<Text style={LoginStyles.title}>Connexion</Text>

				<Text style={LoginStyles.label}>Email</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="Votre email"
					placeholderTextColor="#999"
					autoCapitalize="none"
					keyboardType="email-address"
					style={LoginStyles.input}
				/>

				<Text style={LoginStyles.label}>Mot de passe</Text>
				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder="Votre mot de passe"
					placeholderTextColor="#999"
					secureTextEntry
					style={LoginStyles.input}
				/>

				{errorMessage ? (
				<Text style={LoginStyles.errorText}>{errorMessage}</Text>
				) : null}

				<TouchableOpacity 
					style={LoginStyles.loginButton} 
					onPress={handleLogin}
					disabled={isLoading}
				>
					<Text style={LoginStyles.loginButtonText}>
						{isLoading ? 'Connexion...' : 'Se connecter'}
					</Text>
				</TouchableOpacity>

				<View style={LoginStyles.linkContainer}>
					<TouchableOpacity onPress={() => router.push('/pages/Inscription/InscriptionPage')}>
						<Text style={LoginStyles.linkText}>Pas de compte ? Inscription</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

}