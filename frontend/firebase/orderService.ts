import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { Order } from '@/types/firebase';

export const orderService = {
  async createOrder(orderData: Partial<Order>) {
    try {
      const ordersRef = collection(db, 'Orders');
      const newOrderRef = doc(ordersRef);
      const orderWithMetadata = {
        ...orderData,
        orderId: newOrderRef.id,
        createdAt: new Date().toISOString(),
        status: 'pending' as const
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

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(db, 'Orders', orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        return null;
      }
      return orderDoc.data() as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
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
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
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
  }
};
