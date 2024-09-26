import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormInputs {
    email: string;
    password: string;
}

const Login = () => {
    // const navigate = useNavigate();
    const { register, handleSubmit } = useForm<LoginFormInputs>();
    const { login } = useAuth()

    const onSubmit = async ({ email, password }: LoginFormInputs) => {
        try {
            await login({ email, password });
            // Redirect to dashboard or handle success
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <Card className="mx-auto max-w-md my-10 border-t-red-600 border-t-4">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...register('email')}
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input
                                {...register('password')}
                                type="password" required />
                        </div>
                        <Button type="submit" variant="destructive" className="w-full">
                            Login
                        </Button>
                        {/* <Button variant="outline" className="w-full">
                        Login with Google
                    </Button> */}
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="#" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default Login;

// export function LoginForm() {
//     return (
        
//     )
// }
