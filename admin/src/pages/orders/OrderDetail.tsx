import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetOrder, adminUpdateOrderStatus } from '@/api/orders';
import { getOrderPayment, updatePaymentStatus, createRefund } from '@/api/payments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormDialog } from '@/components/shared/FormDialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import type { Order } from '@/types';

type Payment = { id: number; status: string; amount: string | number };

const ORDER_STATUSES = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const [payStatusDialog, setPayStatusDialog] = useState(false);
  const [newPayStatus, setNewPayStatus] = useState('');
  const [savingPayStatus, setSavingPayStatus] = useState(false);

  const [refundDialog, setRefundDialog] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [savingRefund, setSavingRefund] = useState(false);

  useEffect(() => {
    Promise.all([
      adminGetOrder(Number(id)),
      getOrderPayment(Number(id)).catch(() => ({ data: null })),
    ])
      .then(([orderRes, payRes]) => {
        const o = orderRes.data.order ?? orderRes.data;
        setOrder(o);
        setNewStatus(o.status);
        setPayment(payRes.data?.payment ?? payRes.data);
        setNewPayStatus((payRes.data?.payment ?? payRes.data)?.status ?? 'PENDING');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async () => {
    setSavingStatus(true);
    try {
      await adminUpdateOrderStatus(Number(id), newStatus);
      setOrder((o) => o ? { ...o, status: newStatus as Order['status'] } : o);
      toast({ title: 'Order status updated' });
      setStatusDialog(false);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleUpdatePayStatus = async () => {
    if (!payment) return;
    setSavingPayStatus(true);
    try {
      await updatePaymentStatus(payment.id, newPayStatus);
      setPayment((p) => p ? { ...p, status: newPayStatus } : p);
      toast({ title: 'Payment status updated' });
      setPayStatusDialog(false);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSavingPayStatus(false);
    }
  };

  const handleRefund = async () => {
    if (!payment || !refundAmount) return;
    setSavingRefund(true);
    try {
      await createRefund(payment.id, Number(refundAmount));
      toast({ title: 'Refund created' });
      setRefundDialog(false);
      setRefundAmount('');
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setSavingRefund(false);
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center text-muted-foreground">Loading…</div>;
  if (!order) return <div className="text-center text-muted-foreground">Order not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Order Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={order.status} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><StatusBadge status={order.paymentStatus} /></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold">{formatCurrency(Number(order.totalAmount))}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">User ID</span><span>#{order.userId}</span></div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => { setNewStatus(order.status); setStatusDialog(true); }}>Update Status</Button>
            </div>
          </CardContent>
        </Card>

        {payment && (
          <Card>
            <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Payment ID</span><span>#{payment.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={payment.status} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>{formatCurrency(Number(payment.amount))}</span></div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => { setNewPayStatus(payment.status); setPayStatusDialog(true); }}>Update Status</Button>
                <Button size="sm" variant="outline" onClick={() => setRefundDialog(true)}>Refund</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {order.items && order.items.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.variant?.product?.name ?? 'Product'}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.variant?.sku} × {item.quantity}</p>
                  </div>
                  <span className="font-medium">{formatCurrency(Number(item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order status dialog */}
      <FormDialog
        open={statusDialog}
        title="Update Order Status"
        onClose={() => setStatusDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setStatusDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={savingStatus}>{savingStatus ? 'Saving…' : 'Save'}</Button>
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
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </FormDialog>

      {/* Payment status dialog */}
      <FormDialog
        open={payStatusDialog}
        title="Update Payment Status"
        onClose={() => setPayStatusDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setPayStatusDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdatePayStatus} disabled={savingPayStatus}>{savingPayStatus ? 'Saving…' : 'Save'}</Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label>Payment Status</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={newPayStatus}
            onChange={(e) => setNewPayStatus(e.target.value)}
          >
            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </FormDialog>

      {/* Refund dialog */}
      <FormDialog
        open={refundDialog}
        title="Create Refund"
        onClose={() => setRefundDialog(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setRefundDialog(false)}>Cancel</Button>
            <Button onClick={handleRefund} disabled={savingRefund || !refundAmount}>{savingRefund ? 'Processing…' : 'Refund'}</Button>
          </>
        }
      >
        <div className="space-y-1.5">
          <Label>Amount</Label>
          <Input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" />
        </div>
      </FormDialog>
    </div>
  );
}
