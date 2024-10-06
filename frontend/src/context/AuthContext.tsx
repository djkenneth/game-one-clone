import { getUser, login as loginApi, signup as signupApi, logout as logoutApi } from '../api/auth';
import { useToast } from '@/hooks/use-toast';
import { SignupData, LoginData } from '@/types/auth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of our context state
interface AuthContextType {
  user: { name: string } | null;
  accessToken: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  // Login function
  const login = async (data: LoginData) => {
    const res = await loginApi(data);

    if (res?.status === 404 || res.status === 400) {
      toast({
        variant: 'destructive',
        description: res?.response?.data.message as string
      });
    }

    if (res?.status === 200) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setAccessToken(res.data.accessToken);
      const user = await getUser();
      setUser(user);
      navigate('/', { replace: true });
    }
  };

  // Signup function
  const signup = async (data: SignupData) => {
    const res = await signupApi(data);

    if (res.status === 400) {
      if (res.response.data.errorCode === 2001) {
        toast({
          variant: 'destructive',
          description: res.response.data.errors.issues[0].message as string
        });
      }

      if (res.response.data.errorCode === 1002) {
        toast({
          variant: 'destructive',
          description: res.response.data.message as string
        });
      }
    }

    if (res.status === 200) {
      navigate('/customer/account/login', { replace: true });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken(null);
    logoutApi();
    navigate('/customer/account/login', { replace: true });
  };

  // Fetch the user if the access token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const userData = await getUser();
          setUser(userData);
        } catch (error) {
          console.log(error);
          logout(); // If error occurs, logout
        }
      }
    };
    fetchUser();
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
