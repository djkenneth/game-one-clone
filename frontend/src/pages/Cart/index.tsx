import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Container from '@/components/ui/container';
import { useCart } from '@/context/CartContext';
import { formatNumberToCurrency } from '@/lib/utils';
import { GoDash, GoPlus } from 'react-icons/go';
import { HiOutlineShoppingBag, HiTrash } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, cartCount, updateItem, removeItem, clearCart } = useCart();

  const cartTotal =
    cart?.items?.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0) ?? 0;

  if (!cart || cart.items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center gap-6 py-24">
          <HiOutlineShoppingBag className="text-8xl text-gray-200" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-gray-500">Browse our products and add some items.</p>
          </div>
          <Button asChild variant="solidred" size="lg">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="mb-6 text-2xl font-bold">Shopping Cart ({cartCount} items)</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="text-red-500" onClick={clearCart}>
                <HiTrash className="mr-1 h-4 w-4" /> Clear Cart
              </Button>
            </div>
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-3xl">
                  🛍️
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.variant.product.id}`}
                        className="font-medium hover:text-red-600"
                      >
                        {item.variant.product.name}
                      </Link>
                      <p className="text-xs text-gray-500">SKU: {item.variant.sku}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <GoDash className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                      >
                        <GoPlus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-red-600">
                      {formatNumberToCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80">
            <div className="rounded-lg border p-6 sticky top-4">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600 line-clamp-1 max-w-[60%]">
                      {item.variant.product.name} × {item.quantity}
                    </span>
                    <span>{formatNumberToCurrency(Number(item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-red-600">{formatNumberToCurrency(cartTotal)}</span>
              </div>
              <Button asChild variant="solidred" className="mt-4 w-full" size="lg">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
