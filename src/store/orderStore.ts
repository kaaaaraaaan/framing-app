import { create } from 'zustand';
import { Order } from '../types';
import { supabase } from '../lib/supabase';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  getOrders: (userId: string) => Promise<Order[]>;
  getAllOrders: () => Promise<Order[]>;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  addOrder: async (order) => {
    try {
      const { error } = await supabase.from('orders').insert([{
        id: order.id,
        user_id: order.userId,
        frame: order.frame,
        size: order.size,
        image_url: order.image,
        total_price: order.totalPrice,
        status: order.status,
        shipping_address: order.shippingAddress,
        assigned_vendor_id: order.assignedVendorId,
      }]);

      if (error) throw error;

      set((state) => ({ orders: [...state.orders, order] }));
    } catch (error) {
      console.error('Add order error:', error);
    }
  },
  updateOrder: async (orderId, updates) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: updates.status,
          assigned_vendor_id: updates.assignedVendorId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, ...updates } : order
        ),
      }));
    } catch (error) {
      console.error('Update order error:', error);
    }
  },
  getOrders: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const orders = data.map((order) => ({
        id: order.id,
        userId: order.user_id,
        frame: order.frame,
        size: order.size,
        image: order.image_url,
        totalPrice: order.total_price,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        assignedVendorId: order.assigned_vendor_id,
        shippingAddress: order.shipping_address,
      }));

      set({ orders });
      return orders;
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  },
  getAllOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const orders = data.map((order) => ({
        id: order.id,
        userId: order.user_id,
        frame: order.frame,
        size: order.size,
        image: order.image_url,
        totalPrice: order.total_price,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        assignedVendorId: order.assigned_vendor_id,
        shippingAddress: order.shipping_address,
      }));

      set({ orders });
      return orders;
    } catch (error) {
      console.error('Get all orders error:', error);
      return [];
    }
  },
}));