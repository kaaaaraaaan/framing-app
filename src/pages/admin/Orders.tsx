import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { Package, ChevronRight } from 'lucide-react';
import { Order } from '../../types';

export default function AdminOrders() {
  const { getAllOrders } = useOrderStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [getAllOrders]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">All Orders</h2>
        <div className="text-center py-12">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">All Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no orders in the system yet.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={order.items && order.items.length > 0 ? order.items[0]?.imageUrl : '/placeholder.jpg'}
                          alt={order.items && order.items.length > 0 ? order.items[0]?.name : 'Order item'}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            Customer ID: {order.userId}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {order.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          ${(order.totalPrice || 0).toFixed(2)}
                        </p>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress ? 
                          `Shipping to: ${order.shippingAddress.city}, ${order.shippingAddress.state}` :
                          'No shipping address provided'
                        }
                      </p>
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
