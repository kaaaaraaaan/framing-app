import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { isAdmin } from '../../utils/adminCheck';
import { orderService, OrderStatus, Order as DbOrder } from '../../services/orderService';
import { Box, Settings as SettingsIcon, ShoppingBag, Package, Users } from 'lucide-react';
import type { Order } from '../../types';

const mapDbOrderToAppOrder = (dbOrder: DbOrder & { id: string }): Order => {
  return {
    id: dbOrder.id,
    userId: dbOrder.user_id || '',
    status: dbOrder.status || 'pending',
    totalPrice: dbOrder.total_price || 0,
    customerEmail: dbOrder.customer_email || '',
    createdAt: dbOrder.created_at || new Date().toISOString(),
    updatedAt: dbOrder.updated_at || new Date().toISOString(),
    items: [],
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    frame: {
      name: dbOrder.frame_details?.name || '',
      image: dbOrder.frame_details?.image || ''
    },
    size: {
      dimensions: dbOrder.frame_details?.size || ''
    }
  };
};

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  });

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
        const mappedOrders = fetchedOrders.map(order => 
          mapDbOrderToAppOrder({ ...order, id: order.id || '' })
        );
        setOrders(mappedOrders);

        // Calculate statistics
        const totalOrders = mappedOrders.length;
        const pendingOrders = mappedOrders.filter(order => order.status === 'pending').length;
        const totalRevenue = mappedOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalOrders,
          pendingOrders,
          totalRevenue,
          avgOrderValue
        });
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
      const updatedDbOrder = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId 
          ? mapDbOrderToAppOrder({ ...updatedDbOrder, id: orderId })
          : order
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Box className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">NPR {stats.totalRevenue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Order Value</dt>
                  <dd className="text-lg font-medium text-gray-900">NPR {stats.avgOrderValue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link
          to="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Manage Products</h3>
          <p className="mt-2 text-sm text-gray-500">Add, edit, or remove products from your store</p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Order Management</h3>
          <p className="mt-2 text-sm text-gray-500">View and manage customer orders</p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium text-gray-900">Settings</h3>
          <p className="mt-2 text-sm text-gray-500">Configure system settings and preferences</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <div className="overflow-hidden border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          NPR {(order.totalPrice || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
