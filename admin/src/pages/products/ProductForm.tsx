import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '@/api/products';
import { getCategories, getBrands } from '@/api/catalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import type { Category, Brand } from '@/types';

type FormData = {
  name: string;
  handle: string;
  description: string;
  bodyHtml: string;
  productType: string;
  status: string;
  publishedAt: string;
  categoryId: string;
  brandId: string;
  shopId: string;
};

const EMPTY: FormData = {
  name: '', handle: '', description: '', bodyHtml: '',
  productType: '', status: 'draft', publishedAt: '',
  categoryId: '', brandId: '', shopId: '1',
};

export default function ProductForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<FormData>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.categories ?? r.data)).catch(() => {});
    getBrands().then((r) => setBrands(r.data.brands ?? r.data)).catch(() => {});

    if (isEdit) {
      getProduct(Number(id))
        .then((res) => {
          const p = res.data.product ?? res.data;
          setForm({
            name: p.name ?? '',
            handle: p.handle ?? '',
            description: p.description ?? '',
            bodyHtml: p.bodyHtml ?? '',
            productType: p.productType ?? '',
            status: p.status ?? 'draft',
            publishedAt: p.publishedAt ? p.publishedAt.slice(0, 16) : '',
            categoryId: String(p.categoryId ?? ''),
            brandId: p.brandId ? String(p.brandId) : '',
            shopId: String(p.shopId ?? 1),
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId || !form.shopId) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        handle: form.handle || undefined,
        description: form.description || undefined,
        bodyHtml: form.bodyHtml || undefined,
        productType: form.productType || undefined,
        status: form.status,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
        categoryId: Number(form.categoryId),
        brandId: form.brandId ? Number(form.brandId) : undefined,
        shopId: Number(form.shopId),
      };
      if (isEdit) {
        await updateProduct(Number(id), payload);
        toast({ title: 'Product updated' });
        navigate(`/products/${id}`);
      } else {
        const res = await createProduct(payload);
        const newId = res.data.product?.id ?? res.data.id;
        toast({ title: 'Product created' });
        navigate(`/products/${newId}`);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save product', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={form.name} onChange={set('name')} placeholder="Product name" required />
            </div>
            <div className="space-y-1.5">
              <Label>Handle / Slug</Label>
              <Input value={form.handle} onChange={set('handle')} placeholder="my-product" />
            </div>
            <div className="space-y-1.5">
              <Label>Product Type</Label>
              <Input value={form.productType} onChange={set('productType')} placeholder="e.g. Smartphone" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.status}
                onChange={set('status')}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.categoryId}
                onChange={set('categoryId')}
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.brandId}
                onChange={set('brandId')}
              >
                <option value="">No brand</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Published At</Label>
              <Input type="datetime-local" value={form.publishedAt} onChange={set('publishedAt')} />
            </div>
            <div className="space-y-1.5">
              <Label>Shop ID</Label>
              <Input type="number" value={form.shopId} onChange={set('shopId')} placeholder="1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Short Description</Label>
              <Textarea value={form.description} onChange={set('description')} placeholder="Brief description…" rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Body HTML</Label>
              <Textarea value={form.bodyHtml} onChange={set('bodyHtml')} placeholder="<p>Full HTML description…</p>" rows={6} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/products')}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}</Button>
        </div>
      </form>
    </div>
  );
}
