import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/adminCheck';
import { orderService, Order, OrderStatus } from '../services/orderService';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminAndFetchOrders = async () => {
      try {
        const isAdminUser = await isAdmin();
        setAdminStatus(isAdminUser);

        if (!isAdminUser) {
          setError('Unauthorized access');
          setLoading(false);
          return;
        }

        const fetchedOrders = await orderService.getAllOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  if (adminStatus === false) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">{order.customer_email}</td>
                  <td className="border p-2">${order.total_price.toFixed(2)}</td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">
                    {new Date(order.created_at || '').toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusUpdate(order.id!, e.target.value as OrderStatus)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
