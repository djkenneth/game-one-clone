import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory } from '@/api/catalog';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog } from '@/components/shared/FormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    getCategories()
      .then((res) => setCategories(res.data.categories ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setName(''); setDescription(''); setDialogOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setName(c.name); setDescription(c.description ?? ''); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, { name, description: description || undefined });
        toast({ title: 'Category updated' });
      } else {
        await createCategory({ name, description: description || undefined });
        toast({ title: 'Category created' });
      }
      setDialogOpen(false);
      fetch();
    } catch {
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (c: Category) => {
    try {
      await updateCategory(c.id, { isActive: !c.isActive });
      toast({ title: `Category ${c.isActive ? 'deactivated' : 'activated'}` });
      fetch();
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Category, unknown>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => row.original.description ?? '—' },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row.original)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={row.original.isActive ? 'secondary' : 'default'}
            onClick={() => handleToggle(row.original)}
          >
            {row.original.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={openCreate}><Plus className="mr-1.5 h-4 w-4" />New Category</Button>
      </div>

      <DataTable columns={columns} data={categories} isLoading={loading} />

      <FormDialog
        open={dialogOpen}
        title={editing ? 'Edit Category' : 'New Category'}
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
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
        </div>
      </FormDialog>
    </div>
  );
}
