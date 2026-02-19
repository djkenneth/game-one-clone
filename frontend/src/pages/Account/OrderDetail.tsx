import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrder, cancelOrder } from '@/api/orders';
import { formatNumberToCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';
import { HiArrowLeft } from 'react-icons/hi2';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  PAID: 'secondary',
  PROCESSING: 'secondary',
  SHIPPED: 'default',
  DELIVERED: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await getOrder(parseInt(id!));
        setOrder(res.data.order);
      } catch {
        toast({ variant: 'destructive', description: 'Failed to load order.' });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      setIsCancelling(true);
      const res = await cancelOrder(order.id);
      setOrder(res.data.order);
      toast({ description: 'Order cancelled.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Failed to cancel order.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Order not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/account/orders">
            <HiArrowLeft className="mr-1 h-4 w-4" /> Orders
          </Link>
        </Button>
        <h2 className="text-lg font-semibold">Order #{order.id}</h2>
        <Badge variant={statusVariant[order.status] ?? 'outline'}>{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
          <p className="mt-1 font-medium">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
          <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'outline'} className="mt-1">
            {order.paymentStatus}
          </Badge>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <p className="mt-1 text-lg font-bold text-red-600">
            {formatNumberToCurrency(Number(order.totalAmount))}
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      {order.address && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Delivery Address</h3>
          <p className="text-sm text-gray-600">{order.address.fullName}</p>
          <p className="text-sm text-gray-600">
            {order.address.street}, {order.address.city}
            {order.address.state && `, ${order.address.state}`} {order.address.postalCode}
          </p>
          <p className="text-sm text-gray-600">{order.address.country}</p>
        </div>
      )}

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-medium">Items</h3>
          </div>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-2xl flex-shrink-0">
                  🛍️
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {item.variant?.product?.name ?? `Variant #${item.productVariantId}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.variant?.sku} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatNumberToCurrency(Number(item.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between p-4 font-semibold">
            <span>Total</span>
            <span className="text-red-600">{formatNumberToCurrency(Number(order.totalAmount))}</span>
          </div>
        </div>
      )}

      {/* Cancel */}
      {order.status === 'PENDING' && (
        <Button variant="destructive" onClick={handleCancel} disabled={isCancelling}>
          {isCancelling ? 'Cancelling...' : 'Cancel Order'}
        </Button>
      )}
    </div>
  );
};

export default OrderDetailPage;
