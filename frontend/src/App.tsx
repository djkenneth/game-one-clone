import { Route, Routes } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Layout from "@/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/Login";
import SignupPage from "@/pages/Signup";
import DashboardPage from "@/pages/Dashboard";
import HomePage from "@/pages/Home";
import ProductPage from "@/pages/Products";
import AuthProvider from "@/components/AuthProvider";
import PublicRoute from "@/components/PublicRoute";

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>

        <Layout>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/products' element={<ProductPage />} />
            <Route path='/login' element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path='/signup' element={
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App
