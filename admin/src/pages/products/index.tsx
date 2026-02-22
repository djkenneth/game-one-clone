import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '@/api/products';
import { getCategories, getBrands } from '@/api/catalog';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Product, Category, Brand } from '@/types';

const PAGE_SIZE = 15;

export default function ProductsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = (p = 1) => {
    setLoading(true);
    getProducts({
      search: search || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      brandId: brandId ? Number(brandId) : undefined,
      page: p,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        setProducts(res.data.products ?? res.data);
        setTotal(res.data.total ?? (res.data.products ?? res.data).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.categories ?? r.data)).catch(() => {});
    getBrands().then((r) => setBrands(r.data.brands ?? r.data)).catch(() => {});
    fetch(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetch(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      toast({ title: 'Product deleted' });
      setDeleteId(null);
      fetch(page);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: ColumnDef<Product, unknown>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="max-w-xs truncate block">{row.original.name}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => row.original.category?.name ?? '—',
    },
    {
      accessorKey: 'brand',
      header: 'Brand',
      cell: ({ row }) => row.original.brand?.name ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status ?? 'draft'}
        </Badge>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const v = row.original.variants?.[0];
        return v ? formatCurrency(Number(v.price)) : '—';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate(`/products/${row.original.id}`)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate(`/products/${row.original.id}/edit`)}>
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
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => navigate('/products/new')}><Plus className="mr-1.5 h-4 w-4" />New Product</Button>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52"
        />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <Button type="submit">Search</Button>
      </form>

      <DataTable
        columns={columns}
        data={products}
        isLoading={loading}
        page={page}
        pageCount={pageCount}
        onPageChange={(p) => { setPage(p); fetch(p); }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Product"
        description="This will permanently delete the product and all its variants, images, options, and tags."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
