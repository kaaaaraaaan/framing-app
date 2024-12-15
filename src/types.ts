// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  city?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface OrderItem {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  name?: string;
  imageUrl?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface FrameDetails {
  name: string;
  image: string;
}

export interface SizeDetails {
  dimensions: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  frame?: FrameDetails;
  size?: SizeDetails;
}

export interface ProfileOrder {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  cancelledAt?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    district: string;
  };
}

// AI Generation types
export interface AIGeneration {
  id: string;
  userId: string;
  prompt: string;
  result: string;
  image_url: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}