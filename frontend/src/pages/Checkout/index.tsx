import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getAddresses } from '@/api/users';
import { createOrder } from '@/api/orders';
import { formatNumberToCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Address } from '@/types';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartTotal =
    cart?.items?.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0) ?? 0;

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const res = await getAddresses();
        const addrs: Address[] = res.data.addresses;
        setAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(String(defaultAddr.id));
        else if (addrs.length > 0) setSelectedAddressId(String(addrs[0].id));
      } catch {
        toast({ variant: 'destructive', description: 'Failed to load addresses.' });
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    loadAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({ variant: 'destructive', description: 'Please select a delivery address.' });
      return;
    }
    if (!cart || cart.items.length === 0) return;

    const shopId = cart.items[0]?.variant?.product?.id;
    if (!shopId) return;

    try {
      setIsPlacingOrder(true);
      const orderItems = cart.items.map((item) => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      const res = await createOrder({
        shopId: cart.items[0]?.variant?.product?.id ?? 1,
        addressId: parseInt(selectedAddressId),
        items: orderItems,
      });

      await clearCart();
      toast({ description: 'Order placed successfully!' });
      navigate(`/account/orders/${res.data.order.id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error?.response?.data?.error?.message ?? 'Failed to place order.',
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Container>
        <div className="py-12 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Address + Items */}
          <div className="flex-1 space-y-6">
            {/* Delivery Address */}
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Delivery Address</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/account/addresses">Manage</Link>
                </Button>
              </div>

              {isLoadingAddresses ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">No addresses saved.</p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/account/addresses">Add Address</Link>
                  </Button>
                </div>
              ) : (
                <RadioGroup
                  value={selectedAddressId}
                  onValueChange={setSelectedAddressId}
                  className="space-y-3"
                >
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                        selectedAddressId === String(addr.id)
                          ? 'border-red-500 bg-red-50'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddressId(String(addr.id))}
                    >
                      <RadioGroupItem value={String(addr.id)} id={`addr-${addr.id}`} className="mt-0.5" />
                      <Label htmlFor={`addr-${addr.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{addr.fullName}</span>
                          {addr.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {addr.street}, {addr.city}
                          {addr.state && `, ${addr.state}`} {addr.postalCode}, {addr.country}
                        </p>
                        {addr.phone && <p className="text-xs text-gray-500">{addr.phone}</p>}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Order Items */}
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 font-semibold">Order Items</h2>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-2xl">
                      🛍️
                    </div>
                    <div className="flex flex-1 justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.variant.product.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.variant.sku} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatNumberToCurrency(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-80">
            <div className="rounded-lg border p-6 sticky top-4">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatNumberToCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-red-600">{formatNumberToCurrency(cartTotal)}</span>
              </div>
              <Button
                variant="solidred"
                className="mt-4 w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || !selectedAddressId || addresses.length === 0}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link to="/cart">Back to Cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPage;
