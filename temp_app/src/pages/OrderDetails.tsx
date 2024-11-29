import React from 'react';
  import { useParams, Link } from 'react-router-dom';
  import { useAuthStore } from '../store/authStore';
  import { useOrderStore } from '../store/orderStore';
  import { Package, Truck, MapPin, ArrowLeft } from 'lucide-react';

  export default function OrderDetails() {
    const { orderId } = useParams();
    const { user } = useAuthStore();
    const { getOrders } = useOrderStore();
    const orders = getOrders(user?.id || '');
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
            <Link
              to="/orders"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to orders
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to orders
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order #{order.id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {order.status}
                    </dd>
                  </div>

                  {order.trackingNumber && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Tracking Number
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {order.trackingNumber}
                      </dd>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Estimated Delivery
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {order.estimatedDelivery}
                      </dd>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Shipping Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <address className="not-italic">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </address>
                </dd>
              </div>

              <div className="sm:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={order.frame.image}
                      alt={order.frame.name}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {order.frame.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Size: {order.size.dimensions}
                      </p>
                      <p className="mt-2 text-lg font-medium text-gray-900">
                        NPR {order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {order.status === 'pending' && (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                    {order.status === 'processing' && (
                      <Package className="h-5 w-5 text-blue-500" />
                    )}
                    {order.status === 'shipped' && (
                      <Truck className="h-5 w-5 text-green-500" />
                    )}
                    {order.status === 'delivered' && (
                      <MapPin className="h-5 w-5 text-green-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
