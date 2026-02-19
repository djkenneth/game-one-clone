import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { formatNumberToCurrency } from '@/lib/utils';
import type { Product } from '@/types';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

function PrimaryCard({ id, name, variants, brand }: Product) {
  const { addToCart } = useCart();
  const firstVariant = variants?.[0];
  const price = firstVariant ? Number(firstVariant.price) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (firstVariant) {
      addToCart(firstVariant.id, 1);
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="group shadow-inner hover:shadow-lg h-full flex flex-col">
        <div className="overflow-hidden bg-gray-50 flex items-center justify-center aspect-square">
          <div className="text-gray-300 text-6xl flex items-center justify-center w-full h-full">
            🛍️
          </div>
        </div>
        <CardHeader className="p-2 pt-2 flex-1">
          <CardTitle className="line-clamp-2 text-sm">{name}</CardTitle>
          {brand && <p className="text-xs text-gray-500">{brand.name}</p>}
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-2 pt-0">
          {firstVariant && (
            <p className="text-center font-semibold text-red-600">{formatNumberToCurrency(price)}</p>
          )}
          {firstVariant && firstVariant.stock > 0 ? (
            <>
              <Button
                onClick={handleAddToCart}
                variant="secondary"
                size="sm"
                className="inline-flex group-hover:hidden"
              >
                <HiOutlineShoppingBag className="mr-1 h-4 w-4" /> Add to Cart
              </Button>
              <Button
                onClick={handleAddToCart}
                variant="destructive"
                size="sm"
                className="hidden group-hover:inline-flex"
              >
                <HiOutlineShoppingBag className="mr-1 h-4 w-4" /> Add to Cart
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Out of Stock
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default PrimaryCard;
