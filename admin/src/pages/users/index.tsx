import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminListUsers } from '@/api/users';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/types';

const PAGE_SIZE = 15;

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = (p = 1) => {
    setLoading(true);
    adminListUsers({ page: p, limit: PAGE_SIZE })
      .then((res) => {
        setUsers(res.data.users ?? res.data);
        setTotal(res.data.total ?? (res.data.users ?? res.data).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(1); }, []);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: ColumnDef<User, unknown>[] = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id}</span> },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant={row.original.role === 'ADMIN' ? 'default' : 'secondary'}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'destructive'}>
          {row.original.isActive ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => formatDate(row.original.createdAt) },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button size="sm" variant="outline" onClick={() => navigate(`/users/${row.original.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <DataTable
        columns={columns}
        data={users}
        isLoading={loading}
        page={page}
        pageCount={pageCount}
        onPageChange={(p) => { setPage(p); fetchUsers(p); }}
      />
    </div>
  );
}
