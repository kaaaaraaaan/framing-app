import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface OrderItem {
  id: string;
  order_id: string;
  frame_type: string;
  frame_size: string;
  image_url: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total_amount: number;
  shipping_address_id: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  getOrders: (userId: string) => Promise<Order[]>;
  getAllOrders: () => Promise<Order[]>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],

  addOrder: async (orderData) => {
    const { data: order, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({ orders: [...state.orders, order] }));
  },

  updateOrder: async (orderId, updates) => {
    const { error } = await supabase
      .from('orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      ),
    }));
  },

  getOrders: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        shipping_address:addresses(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    set({ orders: data });
    return data;
  },

  getAllOrders: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        shipping_address:addresses(*),
        user:users(email, first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    set({ orders: data });
    return data;
  },
}));
