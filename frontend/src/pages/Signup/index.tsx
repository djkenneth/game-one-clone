import { useForm } from 'react-hook-form';
import { useSignup } from '../../hooks/useAuth';

interface SignupFormInputs {
    email: string;
    password: string;
    name: string;
}

const Signup = () => {
    const { register, handleSubmit } = useForm<SignupFormInputs>();
    const signupMutation = useSignup();

    const onSubmit = (data: SignupFormInputs) => {
        signupMutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('name')} placeholder="Name" />
            <input {...register('email')} placeholder="Email" />
            <input {...register('password')} type="password" placeholder="Password" />
            <button type="submit">Signup</button>
        </form>
    );
};

export default Signup;