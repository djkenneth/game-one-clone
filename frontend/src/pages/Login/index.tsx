import { useForm } from 'react-hook-form';
import { useLogin } from '../../hooks/useAuth';

interface LoginFormInputs {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit } = useForm<LoginFormInputs>();
    const loginMutation = useLogin();

    const onSubmit = (data: LoginFormInputs) => {
        loginMutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email')} placeholder="Email" />
            <input {...register('password')} type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    )
}

export default Login;