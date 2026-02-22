import { useEffect, useState } from 'react';
import { adminListOrders } from '@/api/orders';
import { updatePaymentStatus, createRefund } from '@/api/payments';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormDialog } from '@/components/shared/FormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '@/types';

// We use orders list and derive payment info from paymentStatus field
// Real payment objects come from the order detail call
const PAGE_SIZE = 15;

export default function PaymentsPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Dialogs operate on orderId (we'll call getOrderPayment on detail)
  const [statusDialog, setStatusDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const fetch = (p = 1) => {
    setLoading(true);
    adminListOrders({ page: p, limit: PAGE_SIZE })
      .then((res) => {
        setOrders(res.data.orders ?? res.data);
        setTotal(res.data.total ?? (res.data.orders ?? res.data).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(1); }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      // We use orderId as payment proxy — backend resolves it
      await updatePaymentStatus(selectedOrder.id, newStatus);
      toast({ title: 'Payment status updated' });
      setStatusDialog(false);
      fetch(page);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedOrder || !refundAmount) return;
    setSaving(true);
    try {
      await createRefund(selectedOrder.id, Number(refundAmount));
      toast({ title: 'Refund created' });
      setRefundDialog(false);
      setRefundAmount('');
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns: ColumnDef<Order, unknown>[] = [
    { accessorKey: 'id', header: 'Order ID', cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id}</span> },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(Number(row.original.totalAmount)),
    },
    { accessorKey: 'createdAt', header: 'Date', cell: ({ row }) => formatDate(row.original.createdAt) },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setSelectedOrder(row.original); setNewStatus(row.original.paymentStatus); setStatusDialog(true); }}
          >
            Update Status
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setSelectedOrder(row.original); setRefundDialog(true); }}
          >
            Refund
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Payments</h1>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={loading}
        page={page}
        pageCount={pageCount}
        onPageChange={(p) => { setPage(p); fetch(p); }}
      />

      <FormDialog
        open={statusDialog}
        title="Update Payment Status"
        onClose={() => setStatusDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setStatusDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            {['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </FormDialog>

      <FormDialog
        open={refundDialog}
        title="Create Refund"
        onClose={() => setRefundDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setRefundDialog(false)}>Cancel</Button>
            <Button onClick={handleRefund} disabled={saving || !refundAmount}>{saving ? 'Processing…' : 'Refund'}</Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label>Refund Amount</Label>
          <Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" />
        </div>
      </FormDialog>
    </div>
  );
}
