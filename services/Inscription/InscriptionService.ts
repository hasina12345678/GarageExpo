import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default {
	register: async (email: string, password: string) => {
		if (!email || !password) {
			return { success: false, message: 'Valeur incorrecte' };
		}

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			return { success: true };
		} catch (error: any) {
			return { success: false, message: 'Impossible de créer le compte' };
		}
	}

};
