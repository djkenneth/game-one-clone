import { useToast } from '@/hooks/use-toast';

type ErrorProps = { status: number; errors: { issues: { message: string }[] }; message: unknown };

const ErrorAlertHandle = (error: ErrorProps) => {
  const { toast } = useToast();

  if (error.status === 2001) {
    toast({
      variant: 'destructive',
      description: error.errors.issues[0].message as string
    });
  }

  if (error.status === 1002) {
    toast({
      variant: 'destructive',
      description: error.message as string
    });
  }

  if (error.status === 1003) {
    toast({
      variant: 'destructive',
      description: error.message as string
    });
  }
};

export default ErrorAlertHandle;
