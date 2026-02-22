import { useEffect, useState } from 'react';
import { getBrands, createBrand, updateBrand, deleteBrand } from '@/api/catalog';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog } from '@/components/shared/FormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Brand } from '@/types';

export default function BrandsPage() {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetch = () => {
    setLoading(true);
    getBrands()
      .then((res) => setBrands(res.data.brands ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setName(''); setLogoUrl(''); setDialogOpen(true); };
  const openEdit = (b: Brand) => { setEditing(b); setName(b.name); setLogoUrl(b.logoUrl ?? ''); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateBrand(editing.id, { name, logoUrl: logoUrl || undefined });
        toast({ title: 'Brand updated' });
      } else {
        await createBrand({ name, logoUrl: logoUrl || undefined });
        toast({ title: 'Brand created' });
      }
      setDialogOpen(false);
      fetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to save brand', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteBrand(deleteId);
      toast({ title: 'Brand deleted' });
      setDeleteId(null);
      fetch();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const columns: ColumnDef<Brand, unknown>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'logoUrl',
      header: 'Logo',
      cell: ({ row }) =>
        row.original.logoUrl ? (
          <img src={row.original.logoUrl} alt={row.original.name} className="h-8 w-8 rounded object-contain" />
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row.original)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />New Brand</Button>
      </div>

      <DataTable columns={columns} data={brands} isLoading={loading} />

      <FormDialog
        open={dialogOpen}
        title={editing ? 'Edit Brand' : 'New Brand'}
        onClose={() => setDialogOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Brand name" />
        </div>
        <div className="space-y-1.5">
          <Label>Logo URL</Label>
          <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…" />
        </div>
      </FormDialog>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Brand"
        description="This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
