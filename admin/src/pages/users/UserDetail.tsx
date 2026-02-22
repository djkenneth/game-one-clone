import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetUser, adminUpdateRole } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormDialog } from '@/components/shared/FormDialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import type { User, UserRole } from '@/types';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleDialog, setRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminGetUser(Number(id))
      .then((res) => { setUser(res.data.user ?? res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleRoleChange = async () => {
    if (!user || !newRole) return;
    setSaving(true);
    try {
      await adminUpdateRole(user.id, newRole);
      setUser((u) => u ? { ...u, role: newRole as UserRole } : u);
      toast({ title: 'Role updated' });
      setRoleDialog(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return <div className="text-center text-muted-foreground">User not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">User #{user.id}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role</span>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active</span>
              <Badge variant={user.isActive ? 'default' : 'destructive'}>{user.isActive ? 'Yes' : 'No'}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{formatDate(user.createdAt)}</span>
            </div>
            <Button size="sm" onClick={() => { setNewRole(user.role); setRoleDialog(true); }}>
              Change Role
            </Button>
          </CardContent>
        </Card>

        {user.profile && (
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span>{user.profile.firstName} {user.profile.lastName}</span>
              </div>
              {user.profile.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{user.profile.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {user.addresses && user.addresses.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Addresses</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {user.addresses.map((addr) => (
              <div key={addr.id} className="rounded border p-3 text-sm">
                <p className="font-medium">{addr.fullName}</p>
                <p className="text-muted-foreground">{addr.street}, {addr.city}, {addr.postalCode}, {addr.country}</p>
                {addr.isDefault && <Badge className="mt-1" variant="secondary">Default</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <FormDialog
        open={roleDialog}
        title="Change Role"
        onClose={() => setRoleDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label>Role</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SELLER">SELLER</option>
          </select>
        </div>
      </FormDialog>
    </div>
  );
}
