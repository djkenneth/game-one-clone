import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LoginFormInputs {
  email: string;
  password: string;
}

export function LoginForm({ title }: { title: string }) {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();

  const onSubmit = async ({ email, password }: LoginFormInputs) => {
    try {
      await login({ email, password });
      // Redirect to dashboard or handle success
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Card className="mx-auto my-10 max-w-md border-t-4 border-t-red-600">
      <CardHeader>
        <CardTitle className="text-4xl text-center font-bold">{title}</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register('email')} placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input {...register('password')} type="password" required />
            </div>
            <Button type="submit" variant="destructive" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export function DialogLoginForm({ title }: { title: string }) {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login, openLoginModal: open, setOpenLoginModal: setOpen } = useAuth();

  const onSubmit = async ({ email, password }: LoginFormInputs) => {
    try {
      await login({ email, password });
      setOpen(false)
      // Redirect to dashboard or handle success
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-4xl text-center font-bold">{title}</DialogTitle>
          <DialogDescription className='text-center'>
            By continuing, you agree to Raket.PH’sTerms of Use
            and acknowledge you’ve read ourPrivacy Policy.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register('email')} placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input {...register('password')} type="password" required />
            </div>
            <Button type="submit" variant="destructive" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="#" className="underline">
            Sign up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}