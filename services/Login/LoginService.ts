import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

	export default {
	login: async (email: string, password: string) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			return { success: true };
		} catch (error: any) {
			return { success: false, message: 'Email ou mot de passe incorrect' };
		}
	}
};
