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

export const userService = {
  // Create or update user
  async upsertUser(userId, userData) {
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

  // Get user by ID
  async getUserById(userId) {
    try {
      const userRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      return userDoc.data();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Get user by email
  async getUserByEmail(email) {
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
      };
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  // Update survey data
  async updateSurveyData(userId, surveyData) {
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
