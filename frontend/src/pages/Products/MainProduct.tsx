import { useEffect, useState } from 'react';
import { cva } from 'class-variance-authority';
import { GoDash, GoPlus } from 'react-icons/go';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaStar } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Container from '@/components/ui/container';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';
import { formatNumberToCurrency, parseMarkdown } from '@/lib/utils';
import type { ProductVariant } from '@/types';

const TabsTriggerStyles = cva([
  'data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-red-600 uppercase',
]);

type MainProductType = {
  productId: string;
};

function MainProduct({ productId }: MainProductType) {
  const { addToCart } = useCart();
  const { onFetchProduct, product, isLoading } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    onFetchProduct(parseInt(productId));
  }, [productId]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const increment = () => setQuantity((v) => v + 1);
  const decrement = () => setQuantity((v) => Math.max(1, v - 1));

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(selectedVariant.id, quantity);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex flex-col gap-4 md:flex-row">
          <Skeleton className="h-80 w-full md:w-[40%]" />
          <div className="flex w-full flex-col gap-4 md:w-[60%]">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
      </Container>
    );
  }

  if (!product) return null;

  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;

  return (
    <Container>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Product Image */}
        <div className="relative flex w-full items-center justify-center rounded-lg border bg-gray-50 aspect-square md:w-[40%]">
          <span className="text-8xl">🛍️</span>
          {product.brand && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {product.brand.name}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full space-y-4 md:w-[60%]">
          <div>
            <p className="text-sm text-gray-500">{product.category.name}</p>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <div className="flex items-center gap-1 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <FaStar key={i} className="text-xs text-yellow-400" />
              ))}
              <span className="text-xs text-gray-400 ml-1">({product.id})</span>
            </div>
          </div>

          {selectedVariant && (
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-red-600">
                {formatNumberToCurrency(Number(selectedVariant.price))}
              </p>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={inStock ? 'default' : 'destructive'}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <p className="text-xs text-gray-500">SKU: {selectedVariant.sku}</p>
              </div>
            </div>
          )}

          {/* Variant Selector */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Options:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={twMerge(
                      'rounded border px-3 py-1 text-sm transition-colors',
                      selectedVariant?.id === v.id
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 hover:border-gray-400',
                      !v.isActive || v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''
                    )}
                    disabled={!v.isActive || v.stock === 0}
                  >
                    {v.sku.split('-').slice(1).join(' ')}
                    {v.stock === 0 && ' (OOS)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <hr />

          {/* Quantity + Add to Cart */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={decrement}>
                <GoDash />
              </Button>
              <Input
                type="number"
                min={1}
                max={selectedVariant?.stock}
                className="w-14 text-center font-bold"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <Button variant="outline" size="icon" onClick={increment}>
                <GoPlus />
              </Button>
            </div>
            <Button
              onClick={handleAddToCart}
              variant="solidred"
              size="lg"
              disabled={!inStock || !selectedVariant}
            >
              <HiOutlineShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <p className="text-xs text-gray-500">Sold by: {product.shop.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="details" className="flex w-full flex-col">
          <TabsList className="justify-start gap-4 bg-transparent">
            <TabsTrigger value="details" className={twMerge(TabsTriggerStyles())}>
              Details
            </TabsTrigger>
            <TabsTrigger value="reviews" className={twMerge(TabsTriggerStyles())}>
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-4">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(product.description) }} />
            ) : (
              <p className="text-gray-500">No description available.</p>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}

export default MainProduct;
