import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';

export const customerService = {
  // Create or update customer profile
  async upsertCustomerProfile(userId, profileData) {
    try {
      const customerRef = doc(db, 'customers', userId);
      await setDoc(customerRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating customer profile:', error);
      throw error;
    }
  },

  // Update survey data
  async updateSurveyData(userId, surveyData) {
    try {
      const customerRef = doc(db, 'customers', userId);
      const processedData = processSurveyData(surveyData); // You'll need to implement this
      await updateDoc(customerRef, {
        'surveyData.rawSurveyData': surveyData,
        'surveyData.lastSurveyDate': new Date().toISOString(),
        ...processedData
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating survey data:', error);
      throw error;
    }
  },

  // Get customer profile
  async getCustomerProfile(userId) {
    try {
      const customerRef = doc(db, 'customers', userId);
      const customerDoc = await getDoc(customerRef);
      if (!customerDoc.exists()) {
        throw new Error('Customer profile not found');
      }
      return customerDoc.data();
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw error;
    }
  },

  // Update style box history
  async updateStyleBoxHistory(userId, boxData) {
    try {
      const customerRef = doc(db, 'customers', userId);
      await updateDoc(customerRef, {
        styleBoxHistory: arrayUnion(boxData)
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating style box history:', error);
      throw error;
    }
  }
};

export default customerService;
