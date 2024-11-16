import { create } from 'zustand';
import { Order } from '../types';
import { dbOperations } from '../db';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  getOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  addOrder: (order) => {
    dbOperations.orders.create(order);
    set((state) => ({ orders: [...state.orders, order] }));
  },
  updateOrder: (orderId, updates) => {
    dbOperations.orders.update(orderId, updates);
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      ),
    }));
  },
  getOrders: (userId) => {
    const orders = dbOperations.orders.getByUserId(userId);
    set({ orders });
    return orders;
  },
  getAllOrders: () => {
    const orders = dbOperations.orders.getAll();
    set({ orders });
    return orders;
  },
}));