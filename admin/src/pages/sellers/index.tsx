import { useEffect, useState } from 'react';
import { getShops } from '@/api/shops';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { Shop } from '@/types';

type SellerRow = {
  shopId: number;
  shopName: string;
  ownerId: number;
  isVerified?: boolean;
  status?: string;
  createdAt?: string;
};

const PAGE_SIZE = 15;

export default function SellersPage() {
  const [rows, setRows] = useState<SellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = (p = 1) => {
    setLoading(true);
    getShops({ page: p, limit: PAGE_SIZE })
      .then((res) => {
        const shops: (Shop & { isVerified?: boolean; status?: string; createdAt?: string })[] =
          res.data.shops ?? res.data;
        setTotal(res.data.total ?? shops.length);
        setRows(
          shops.map((s) => ({
            shopId: s.id,
            shopName: s.name,
            ownerId: (s as Shop & { ownerId?: number }).ownerId ?? 0,
            isVerified: (s as Shop & { isVerified?: boolean }).isVerified,
            status: (s as Shop & { status?: string }).status,
            createdAt: (s as Shop & { createdAt?: string }).createdAt,
          })),
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); }, []);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: ColumnDef<SellerRow, unknown>[] = [
    { accessorKey: 'shopId', header: 'Shop ID' },
    { accessorKey: 'shopName', header: 'Shop Name' },
    { accessorKey: 'ownerId', header: 'Owner (User ID)' },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => (
        <Badge variant={row.original.isVerified ? 'default' : 'secondary'}>
          {row.original.isVerified ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => row.original.status ?? '—',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => row.original.createdAt ? formatDate(row.original.createdAt) : '—',
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sellers</h1>
      <DataTable
        columns={columns}
        data={rows}
        isLoading={loading}
        page={page}
        pageCount={pageCount}
        onPageChange={(p) => { setPage(p); fetch(p); }}
      />
    </div>
  );
}
