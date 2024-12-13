import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';

export const orderService = {
  // Create new order
  async createOrder(orderData) {
    try {
      const ordersRef = collection(db, 'Orders');
      const newOrderRef = doc(ordersRef);
      const orderWithMetadata = {
        ...orderData,
        orderId: newOrderRef.id,
        createdAt: new Date().toISOString(),
        status: 'pending' // or whatever initial status you want
      };
      
      await setDoc(newOrderRef, orderWithMetadata);
      return { 
        success: true, 
        orderId: newOrderRef.id 
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const orderRef = doc(db, 'Orders', orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }
      return orderDoc.data();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(userId) {
    try {
      const ordersRef = collection(db, 'Orders');
      const q = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'Orders', orderId);
      await setDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Add scraped products to order
  async addScrapedProducts(orderId, products) {
    try {
      const orderRef = doc(db, 'Orders', orderId);
      await setDoc(orderRef, {
        products,
        scrapedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error adding scraped products:', error);
      throw error;
    }
  }
};
