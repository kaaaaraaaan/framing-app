import { create } from 'zustand';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, getDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  createOrder: (orderData: Partial<Order>) => Promise<void>;
  fetchOrders: (userId: string) => Promise<void>;
  getAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  createOrder: async (orderData: Partial<Order>) => {
    set({ loading: true, error: null });
    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const newOrder = {
        id: docRef.id,
        ...orderData
      } as Order;

      set(state => ({
        orders: [...state.orders, newOrder],
        currentOrder: newOrder,
        loading: false
      }));
    } catch (error) {
      console.error('Error creating order:', error);
      set({ error: 'Failed to create order', loading: false });
    }
  },

  fetchOrders: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      set({ orders, loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ error: 'Failed to fetch orders', loading: false });
    }
  },

  getAllOrders: async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersRef);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      return orders;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString()
      });

      const updatedDoc = await getDoc(orderRef);
      const updatedOrder = {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Order;

      set(state => ({
        orders: state.orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      set({ error: 'Failed to update order status', loading: false });
    }
  },

  setCurrentOrder: (order: Order | null) => set({ currentOrder: order })
}));
