import { useEffect, useState } from 'react';
import { getShops } from '@/api/shops';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { Shop } from '@/types';

const PAGE_SIZE = 15;

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = (p = 1) => {
    setLoading(true);
    getShops({ page: p, limit: PAGE_SIZE })
      .then((res) => {
        setShops(res.data.shops ?? res.data);
        setTotal(res.data.total ?? (res.data.shops ?? res.data).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); }, []);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: ColumnDef<Shop, unknown>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'ownerId', header: 'Owner ID' },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={(row.original as Shop & { isActive?: boolean }).isActive ? 'default' : 'secondary'}>
          {(row.original as Shop & { isActive?: boolean }).isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => formatDate((row.original as Shop & { createdAt?: string }).createdAt ?? '') },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Shops</h1>
      <DataTable
        columns={columns}
        data={shops}
        isLoading={loading}
        page={page}
        pageCount={pageCount}
        onPageChange={(p) => { setPage(p); fetch(p); }}
      />
    </div>
  );
}
