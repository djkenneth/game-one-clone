import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminListOrders } from '@/api/orders';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '@/types';

const PAGE_SIZE = 15;
const STATUSES = ['All', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = (p = 1, s = status) => {
    setLoading(true);
    adminListOrders({ status: s === 'All' ? undefined : s, page: p, limit: PAGE_SIZE })
      .then((res) => {
        setOrders(res.data.orders ?? res.data);
        setTotal(res.data.total ?? (res.data.orders ?? res.data).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1, 'All'); }, []);

  const changeStatus = (s: string) => {
    setStatus(s);
    setPage(1);
    fetch(1, s);
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: ColumnDef<Order, unknown>[] = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id}</span> },
    { accessorKey: 'userId', header: 'User ID' },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => formatCurrency(Number(row.original.totalAmount)),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
    },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ row }) => formatDate(row.original.createdAt) },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${row.original.id}`)}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => changeStatus(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              status === s ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={loading}
        page={page}
        pageCount={pageCount}
        onPageChange={(p) => { setPage(p); fetch(p); }}
      />
    </div>
  );
}
