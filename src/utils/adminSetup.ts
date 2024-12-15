import { createUserWithEmailAndPassword } from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../lib/firebase';

export async function setupAdmin(email: string, password: string, firstName: string, lastName: string) {
  try {
    // Create user in Firebase Auth
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Create user document in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      email,
      firstName,
      lastName,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log('Admin user created successfully');
    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}
