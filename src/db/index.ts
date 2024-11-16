// Using localStorage for browser storage
import { Order, User, Vendor } from '../types';

const STORAGE_KEYS = {
  USERS: 'framecraft_users',
  VENDORS: 'framecraft_vendors',
  ORDERS: 'framecraft_orders',
};

// Helper functions
const getItem = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItem = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize storage
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  localStorage.setItem(STORAGE_KEYS.USERS, '[]');
}
if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
  localStorage.setItem(STORAGE_KEYS.VENDORS, '[]');
}
if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, '[]');
}

export const dbOperations = {
  users: {
    create: (user: User) => {
      const users = getItem<User>(STORAGE_KEYS.USERS);
      users.push(user);
      setItem(STORAGE_KEYS.USERS, users);
    },
    update: (updates: Partial<User> & { id: string }) => {
      const users = getItem<User>(STORAGE_KEYS.USERS);
      const index = users.findIndex(u => u.id === updates.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        setItem(STORAGE_KEYS.USERS, users);
      }
    },
    getByEmail: (email: string) => {
      const users = getItem<User>(STORAGE_KEYS.USERS);
      return users.find(u => u.email === email);
    },
    getById: (id: string) => {
      const users = getItem<User>(STORAGE_KEYS.USERS);
      return users.find(u => u.id === id);
    },
    getByUsername: (username: string) => {
      const users = getItem<User>(STORAGE_KEYS.USERS);
      return users.find(u => u.username === username);
    },
  },
  vendors: {
    create: (vendor: Vendor) => {
      const vendors = getItem<Vendor>(STORAGE_KEYS.VENDORS);
      vendors.push(vendor);
      setItem(STORAGE_KEYS.VENDORS, vendors);
    },
    update: (id: string, updates: Partial<Vendor>) => {
      const vendors = getItem<Vendor>(STORAGE_KEYS.VENDORS);
      const index = vendors.findIndex(v => v.id === id);
      if (index !== -1) {
        vendors[index] = { ...vendors[index], ...updates };
        setItem(STORAGE_KEYS.VENDORS, vendors);
      }
    },
    getAll: () => getItem<Vendor>(STORAGE_KEYS.VENDORS),
    getById: (id: string) => {
      const vendors = getItem<Vendor>(STORAGE_KEYS.VENDORS);
      return vendors.find(v => v.id === id);
    },
    getByUsername: (username: string) => {
      const vendors = getItem<Vendor>(STORAGE_KEYS.VENDORS);
      return vendors.find(v => v.username === username);
    },
  },
  orders: {
    create: (order: Order) => {
      const orders = getItem<Order>(STORAGE_KEYS.ORDERS);
      orders.push(order);
      setItem(STORAGE_KEYS.ORDERS, orders);
    },
    update: (id: string, updates: Partial<Order>) => {
      const orders = getItem<Order>(STORAGE_KEYS.ORDERS);
      const index = orders.findIndex(o => o.id === id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updates };
        setItem(STORAGE_KEYS.ORDERS, orders);
      }
    },
    getByUserId: (userId: string) => {
      const orders = getItem<Order>(STORAGE_KEYS.ORDERS);
      return orders.filter(o => o.userId === userId);
    },
    getAll: () => getItem<Order>(STORAGE_KEYS.ORDERS),
    getById: (id: string) => {
      const orders = getItem<Order>(STORAGE_KEYS.ORDERS);
      return orders.find(o => o.id === id) || null;
    },
  },
};