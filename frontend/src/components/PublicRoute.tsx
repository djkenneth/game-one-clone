import { useAuth } from '@/context/AuthContext';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

type PublicRouteProps = PropsWithChildren<{ redirectPath?: string }>;

export default function PublicRoute({ children, redirectPath = '/' }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to={redirectPath} replace />;

  return children;
}
