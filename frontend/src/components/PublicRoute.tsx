import { RouteProps, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

type PublicRouteProps = RouteProps & {
    redirectPath?: string;
};

export default function PublicRoute({
    children,
    redirectPath = '/',
}: PublicRouteProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user !== null) {
            navigate(redirectPath, { replace: true });
        }
    }, [navigate, user]);

    return children;
}