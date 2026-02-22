import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, login as apiLogin } from '@/api/auth';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    getMe()
      .then((res) => {
        const u = res.data.data.user;
        if (u.role !== 'ADMIN') {
          localStorage.removeItem('adminToken');
          setUser(null);
        } else {
          setUser(u);
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    const { accessToken, user: u } = res.data.data;
    if (u.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    localStorage.setItem('adminToken', accessToken);
    // fetch full user
    const meRes = await getMe();
    setUser(meRes.data.data.user);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
