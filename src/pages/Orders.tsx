import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { Package, ChevronRight } from 'lucide-react';
import { Order } from '../types';

export default function Orders() {
  const { user } = useAuthStore();
  const { getOrders } = useOrderStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        const userOrders = await getOrders(user.id);
        setOrders(userOrders);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user, getOrders]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h2>
        <div className="text-center py-12">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={order.items[0]?.imageUrl || '/placeholder.jpg'}
                          alt={order.items[0]?.name || 'Order item'}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {order.status}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Total: ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
