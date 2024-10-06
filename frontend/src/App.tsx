import { ProductsProvider } from './context/ProductsContext';
import Layout from '@/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import { AuthProvider } from '@/context/AuthContext';
import DashboardPage from '@/pages/Dashboard';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';
import ProductPage from '@/pages/Products';
import SingleProductPage from '@/pages/Products/Single';
import SignupPage from '@/pages/Signup';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:category" element={<ProductPage />} />
            <Route path="/products/:category/:subCategory" element={<ProductPage />} />
            <Route path="/product/:slug/:id" element={<SingleProductPage />} />
            <Route
              path="/customer/account/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/customer/account/create"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
