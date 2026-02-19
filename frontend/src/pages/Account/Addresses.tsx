import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '@/api/users';
import { useToast } from '@/hooks/use-toast';
import type { Address } from '@/types';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi2';

interface AddressFormData {
  fullName: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

const AddressesPage = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<AddressFormData>({
    defaultValues: { isDefault: false },
  });
  const isDefault = watch('isDefault');

  const load = async () => {
    try {
      setIsLoading(true);
      const res = await getAddresses();
      setAddresses(res.data.addresses);
    } catch {
      toast({ variant: 'destructive', description: 'Failed to load addresses.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditingAddress(null);
    reset({ fullName: '', street: '', city: '', state: '', postalCode: '', country: '', phone: '', isDefault: false });
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    reset({
      fullName: addr.fullName,
      street: addr.street,
      city: addr.city,
      state: addr.state ?? '',
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone ?? '',
      isDefault: addr.isDefault,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsSaving(true);
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
      toast({ description: 'Address saved.' });
      setDialogOpen(false);
      load();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Failed to save address.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      toast({ description: 'Address deleted.' });
      load();
    } catch {
      toast({ variant: 'destructive', description: 'Failed to delete address.' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Saved Addresses</h2>
          <p className="text-sm text-gray-500">Manage your delivery addresses.</p>
        </div>
        <Button variant="solidred" size="sm" onClick={openAdd}>
          <HiPlus className="mr-1 h-4 w-4" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">No addresses saved yet.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={openAdd}>
            Add your first address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="flex items-start justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{addr.fullName}</span>
                  {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                <p className="text-sm text-gray-600">
                  {addr.street}, {addr.city}
                  {addr.state && `, ${addr.state}`} {addr.postalCode}
                </p>
                <p className="text-sm text-gray-600">{addr.country}</p>
                {addr.phone && <p className="text-xs text-gray-500">{addr.phone}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(addr)}>
                  <HiPencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(addr.id)}
                >
                  <HiTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input {...register('fullName')} placeholder="Jane Doe" required />
            </div>
            <div className="space-y-1">
              <Label>Street</Label>
              <Input {...register('street')} placeholder="123 Main Street" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>City</Label>
                <Input {...register('city')} placeholder="City" required />
              </div>
              <div className="space-y-1">
                <Label>State</Label>
                <Input {...register('state')} placeholder="State" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Postal Code</Label>
                <Input {...register('postalCode')} placeholder="10001" required />
              </div>
              <div className="space-y-1">
                <Label>Country</Label>
                <Input {...register('country')} placeholder="US" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input {...register('phone')} placeholder="+1 000 000 0000" type="tel" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(v) => setValue('isDefault', !!v)}
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="solidred" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressesPage;
