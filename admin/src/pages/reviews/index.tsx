import { useState } from 'react';
import { getProductReviews, deleteReview } from '@/api/reviews';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, Star } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Review } from '@/types';

export default function ReviewsPage() {
  const { toast } = useToast();
  const [productId, setProductId] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);
    setSearched(true);
    getProductReviews(Number(productId))
      .then((res) => setReviews(res.data.reviews ?? res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteReview(deleteId);
      toast({ title: 'Review deleted' });
      setDeleteId(null);
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const columns: ColumnDef<Review, unknown>[] = [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: row.original.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      ),
    },
    { accessorKey: 'comment', header: 'Comment', cell: ({ row }) => <span className="max-w-xs truncate block">{row.original.comment ?? '—'}</span> },
    { accessorKey: 'user', header: 'User', cell: ({ row }) => row.original.user?.email ?? `#${row.original.userId}` },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ row }) => formatDate(row.original.createdAt) },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button size="sm" variant="destructive" onClick={() => setDeleteId(row.original.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reviews</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Product ID…"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          type="number"
          className="w-40"
        />
        <Button type="submit" disabled={loading || !productId}>
          <Search className="mr-1.5 h-4 w-4" />Search
        </Button>
      </form>

      {searched && (
        <DataTable columns={columns} data={reviews} isLoading={loading} />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Review"
        description="Remove this review permanently?"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
