import Layout from '@/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import AccountLayout from '@/pages/Account/layout';
import ProfilePage from '@/pages/Account/Profile';
import AddressesPage from '@/pages/Account/Addresses';
import OrdersPage from '@/pages/Account/Orders';
import OrderDetailPage from '@/pages/Account/OrderDetail';
import WalletPage from '@/pages/Account/Wallet';
import CartPage from '@/pages/Cart';
import CheckoutPage from '@/pages/Checkout';
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
      <CartProvider>
        <ProductsProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:id" element={<SingleProductPage />} />

              {/* Auth routes (redirect if logged in) */}
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

              {/* Protected: Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Cart */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Checkout */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected: Account section */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="profile" element={<ProfilePage />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="wallet" element={<WalletPage />} />
              </Route>
            </Routes>
          </Layout>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
