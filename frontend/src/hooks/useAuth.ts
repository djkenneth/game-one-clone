import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Login, logout, Signup } from '../apis/auth';
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation(
        {
            mutationFn: Signup,
            onSuccess: () => {
                // Save tokens to localStorage
                navigate("/login", { replace: true });
                // Optionally refetch user data or other queries
                queryClient.invalidateQueries({ queryKey: ['user'] });
            },
        }
    );
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: Login,
        onSuccess: (data) => {
            // Save tokens to localStorage
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            navigate("/", { replace: true });
            // Optionally refetch user data or other queries
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            navigate("/login", { replace: true });
        },
    });
};
