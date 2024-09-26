import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Layout from "@/Layout";
import LoginPage from "@/pages/Login";
import SignupPage from "@/pages/Signup";
import DashboardPage from "@/pages/Dashboard";
import HomePage from "@/pages/Home";
import ProductPage from "@/pages/Products";

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/products' element={<ProductPage />} />
            <Route path='/customer/account/login' element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path='/customer/account/create' element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App
