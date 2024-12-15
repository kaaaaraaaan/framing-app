import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import OrderManagement from './pages/admin/OrderManagement';
import Settings from './pages/admin/Settings';
import Customize from './pages/Customize';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import AdminProducts from './pages/admin/Products';
import AIGenerationPage from './pages/AIGeneration';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  const { initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/success" element={<RegisterSuccess />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/customize" element={<Customize />} />

            {/* Protected user routes */}
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            <Route path="/success" element={
              <PrivateRoute>
                <Success />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
            <Route path="/orders/:id" element={
              <PrivateRoute>
                <OrderDetails />
              </PrivateRoute>
            } />
            <Route path="/ai-generation" element={
              <PrivateRoute>
                <AIGenerationPage />
              </PrivateRoute>
            } />

            {/* Protected admin routes */}
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/orders" element={
              <PrivateRoute adminOnly>
                <AdminOrders />
              </PrivateRoute>
            } />
            <Route path="/admin/orders/:id" element={
              <PrivateRoute adminOnly>
                <OrderManagement />
              </PrivateRoute>
            } />
            <Route path="/admin/settings" element={
              <PrivateRoute adminOnly>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/admin/products" element={
              <PrivateRoute adminOnly>
                <AdminProducts />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}