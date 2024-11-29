import { create } from 'zustand';
  import { Order } from '../types';

  interface OrderState {
    orders: Order[];
    addOrder: (order: Order) => Promise<void>;
    updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
    getOrders: (userId: string) => Promise<Order[]>;
    getAllOrders: () => Promise<Order[]>;
  }

  export const useOrderStore = create<OrderState>()((set) => ({
    orders: [],
    addOrder: async (order) => {
      set((state) => ({ orders: [...state.orders, order] }));
    },
    updateOrder: async (orderId, updates) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, ...updates } : order
        ),
      }));
    },
    getOrders: async (userId) => {
      return [];
    },
    getAllOrders: async () => {
      return [];
    },
  }));
