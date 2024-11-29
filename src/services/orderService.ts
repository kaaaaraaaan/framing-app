import { supabase } from '../lib/supabase';

// Order status types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// Order interface
export interface Order {
  id?: string;
  customer_email: string;
  total_price: number;
  status?: OrderStatus;
  frame_details?: any;
  created_at?: string;
}

export const orderService = {
  // Create a new order
  async createOrder(orderData: Order) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  // Fetch all orders (admin only)
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  // Get order by ID
  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an order (use with caution)
  async deleteOrder(orderId: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
    return true;
  }
};
