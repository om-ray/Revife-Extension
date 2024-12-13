import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { UserProfile } from '@/types/firebase';

export const userService = {
  async upsertUser(userId: string, userData: Partial<UserProfile>) {
    try {
      const userRef = doc(db, 'Users', userId);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return null;
      }
      return userDoc.data() as UserProfile;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string): Promise<(UserProfile & { id: string }) | null> {
    try {
      const usersRef = collection(db, 'Users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      } as UserProfile & { id: string };
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  async updateSurveyData(userId: string, surveyData: any) {
    try {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, {
        'surveyData': surveyData,
        'lastSurveyUpdate': new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating survey data:', error);
      throw error;
    }
  }
};
