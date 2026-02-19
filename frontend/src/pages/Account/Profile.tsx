import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { getProfile, createProfile, updateProfile } from '@/api/users';
import { useToast } from '@/hooks/use-toast';
import type { Profile } from '@/types';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
}

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileFormData>();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await getProfile();
        setProfile(res.data.profile);
        if (res.data.profile) {
          reset({
            firstName: res.data.profile.firstName,
            lastName: res.data.profile.lastName,
            phone: res.data.profile.phone ?? '',
          });
        }
      } catch {
        // No profile yet
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      if (profile) {
        await updateProfile(data);
      } else {
        await createProfile(data);
      }
      await refreshUser();
      toast({ description: 'Profile saved successfully.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Failed to save profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Profile Information</h2>
        <p className="text-sm text-gray-500">Update your personal details.</p>
      </div>

      <div className="rounded-lg border p-4 bg-gray-50">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span> {user?.email}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Role:</span> {user?.role}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>First Name</Label>
            <Input {...register('firstName')} placeholder="First name" required />
          </div>
          <div className="space-y-1">
            <Label>Last Name</Label>
            <Input {...register('lastName')} placeholder="Last name" required />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Phone Number</Label>
          <Input {...register('phone')} placeholder="+1 000 000 0000" type="tel" />
        </div>
        <Button type="submit" variant="solidred" disabled={isSaving}>
          {isSaving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
