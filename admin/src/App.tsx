import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/shared/AdminRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import UsersPage from '@/pages/users';
import UserDetail from '@/pages/users/UserDetail';
import CategoriesPage from '@/pages/categories';
import BrandsPage from '@/pages/brands';
import ProductsPage from '@/pages/products';
import ProductForm from '@/pages/products/ProductForm';
import ProductDetail from '@/pages/products/ProductDetail';
import OrdersPage from '@/pages/orders';
import OrderDetail from '@/pages/orders/OrderDetail';
import PaymentsPage from '@/pages/payments';
import ShopsPage from '@/pages/shops';
import SellersPage from '@/pages/sellers';
import ReviewsPage from '@/pages/reviews';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/sellers" element={<SellersPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
