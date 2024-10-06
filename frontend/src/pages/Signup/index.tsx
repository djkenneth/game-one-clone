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
  name: string;
}

const Signup = () => {
  const { register, handleSubmit } = useForm<SignupFormInputs>();
  const { signup } = useAuth();

  const onSubmit = async ({ email, password, name }: SignupFormInputs) => {
    try {
      await signup({ email, password, name });
      // Redirect to dashboard or handle success
    } catch (error) {
      console.error('Signup failed', error);
    }
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
              <Label htmlFor="name">Name</Label>
              <Input {...register('name')} placeholder="Max Robinson" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                // id="email"
                // type="email"
                {...register('email')}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                // id="password"
                {...register('password')}
                type="password"
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            {/* <Button variant="outline" className="w-full">
                        Sign up with GitHub
                    </Button> */}
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/customer/account/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Signup;

// export function LoginForm() {
//     return (

//     )
// }
