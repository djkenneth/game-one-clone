import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, login as loginApi, logout as logoutApi, signup as signupApi } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import type { LoginData, SignupData, UserData } from '@/types/auth';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  openLoginModal: boolean;
  setOpenLoginModal: (open: boolean) => void;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const res = await loginApi(data);
      if (res.status === 200) {
        localStorage.setItem('accessToken', res.data.data.accessToken);
        setUser({ ...res.data.data.user, isActive: true, createdAt: '', updatedAt: '' });
        await refreshUser();
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Login failed',
      });
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const res = await signupApi(data);
      if (res.status === 201) {
        toast({ description: 'Account created! Please log in.' });
        navigate('/customer/account/login', { replace: true });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Signup failed',
      });
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    navigate('/customer/account/login', { replace: true });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    openLoginModal,
    setOpenLoginModal,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
