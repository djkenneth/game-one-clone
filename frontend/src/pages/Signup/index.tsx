import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface SignupFormInputs {
  email: string;
  password: string;
}

const Signup = () => {
  const { register, handleSubmit } = useForm<SignupFormInputs>();
  const { signup } = useAuth();

  const onSubmit = async ({ email, password }: SignupFormInputs) => {
    await signup({ email, password });
  };

  return (
    <Card className="mx-auto my-10 max-w-lg border-t-4 border-t-red-600">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
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
              <Input {...register('password')} type="password" placeholder="Min. 8 characters" required />
            </div>
            <Button type="submit" variant="solidred" className="w-full">
              Create an account
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/customer/account/login" className="underline hover:text-red-600">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Signup;
