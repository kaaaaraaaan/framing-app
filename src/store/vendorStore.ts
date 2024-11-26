import { create } from 'zustand';
import { Vendor } from '../types';
import { supabase } from '../lib/supabase';

interface VendorState {
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => Promise<void>;
  updateVendor: (id: string, updates: Partial<Vendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  getVendor: (id: string) => Promise<Vendor | undefined>;
  loadVendors: () => Promise<void>;
}

export const useVendorStore = create<VendorState>()((set, get) => ({
  vendors: [],
  addVendor: async (vendor) => {
    try {
      const { error } = await supabase.from('vendors').insert([{
        id: vendor.id,
        first_name: vendor.firstName,
        last_name: vendor.lastName,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zip_code: vendor.zipCode,
        status: vendor.status,
        username: vendor.username,
        password: vendor.password, // In production, use proper password hashing
      }]);

      if (error) throw error;

      set((state) => ({ vendors: [...state.vendors, vendor] }));
    } catch (error) {
      console.error('Add vendor error:', error);
    }
  },
  updateVendor: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          email: updates.email,
          phone: updates.phone,
          address: updates.address,
          city: updates.city,
          state: updates.state,
          zip_code: updates.zipCode,
          status: updates.status,
        })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        vendors: state.vendors.map((vendor) =>
          vendor.id === id ? { ...vendor, ...updates } : vendor
        ),
      }));
    } catch (error) {
      console.error('Update vendor error:', error);
    }
  },
  deleteVendor: async (id) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        vendors: state.vendors.map((vendor) =>
          vendor.id === id ? { ...vendor, status: 'inactive' } : vendor
        ),
      }));
    } catch (error) {
      console.error('Delete vendor error:', error);
    }
  },
  getVendor: async (id) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data ? {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        status: data.status,
        username: data.username,
        password: data.password,
        createdAt: data.created_at,
      } : undefined;
    } catch (error) {
      console.error('Get vendor error:', error);
      return undefined;
    }
  },
  loadVendors: async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const vendors = data.map((vendor) => ({
        id: vendor.id,
        firstName: vendor.first_name,
        lastName: vendor.last_name,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zipCode: vendor.zip_code,
        status: vendor.status,
        username: vendor.username,
        password: vendor.password,
        createdAt: vendor.created_at,
      }));

      set({ vendors });
    } catch (error) {
      console.error('Load vendors error:', error);
    }
  },
}));