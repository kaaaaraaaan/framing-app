import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';

// Order status types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Database Order interface
export interface Order {
  id?: string;
  user_id: string;
  customer_email: string;
  total_price: number;
  status: OrderStatus;
  frame_details?: {
    name: string;
    image: string;
    size: string;
  };
  created_at: string;
  updated_at: string;
}

export const orderService = {
  // Create a new order
  async createOrder(userId: string, orderData: Partial<Order>) {
    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, {
        ...orderData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      return { id: docRef.id, ...orderData };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Fetch all orders (admin only)
  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get orders by user ID
  async getOrders(userId: string): Promise<Order[]> {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('user_id', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        return null;
      }
      
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      } as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updated_at: new Date().toISOString()
      });
      
      const updatedDoc = await getDoc(orderRef);
      if (!updatedDoc.exists()) {
        throw new Error('Order not found after update');
      }
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Update order
  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      
      const updatedDoc = await getDoc(orderRef);
      if (!updatedDoc.exists()) {
        throw new Error('Order not found after update');
      }
      
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Order;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Delete an order (use with caution)
  async deleteOrder(orderId: string): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};
