import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';

interface LoginFormInputs {
  email: string;
  password: string;
}

export function LoginForm({ title }: { title: string }) {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();

  const onSubmit = async ({ email, password }: LoginFormInputs) => {
    await login({ email, password });
  };

  return (
    <Card className="mx-auto my-10 max-w-md border-t-4 border-t-red-600">
      <CardHeader>
        <CardTitle className="text-center text-4xl font-bold">{title}</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register('email')} type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input {...register('password')} type="password" required />
            </div>
            <Button type="submit" variant="solidred" className="w-full">
              Login
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/customer/account/create" className="underline hover:text-red-600">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
