export interface Frame {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface Size {
  id: string;
  name: string;
  dimensions: string;
  priceMultiplier: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  role?: 'user' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  frame: Frame;
  size: Size;
  image: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}