import { create } from 'zustand';
import { Vendor } from '../types';
import { dbOperations } from '../db';

interface VendorState {
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  getVendor: (id: string) => Vendor | undefined;
  loadVendors: () => void;
}

export const useVendorStore = create<VendorState>()((set, get) => ({
  vendors: [],
  addVendor: (vendor) => {
    dbOperations.vendors.create(vendor);
    set((state) => ({ vendors: [...state.vendors, vendor] }));
  },
  updateVendor: (id, updates) => {
    dbOperations.vendors.update(id, updates);
    set((state) => ({
      vendors: state.vendors.map((vendor) =>
        vendor.id === id ? { ...vendor, ...updates } : vendor
      ),
    }));
  },
  deleteVendor: (id) => {
    dbOperations.vendors.update(id, { status: 'inactive' });
    set((state) => ({
      vendors: state.vendors.map((vendor) =>
        vendor.id === id ? { ...vendor, status: 'inactive' } : vendor
      ),
    }));
  },
  getVendor: (id) => {
    const vendor = dbOperations.vendors.getById(id);
    return vendor || undefined;
  },
  loadVendors: () => {
    const vendors = dbOperations.vendors.getAll();
    set({ vendors });
  },
}));