import { useEffect, useMemo, useState } from 'react';
import { cva } from 'class-variance-authority';
import { GoDash, GoPlus } from 'react-icons/go';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { FaStar } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    onFetchProduct(parseInt(productId));
  }, [productId]);

  // Initialise selectedOptions from first variant when product loads
  useEffect(() => {
    if (!product) return;
    setActiveImageIndex(0);

    if (product.options && product.options.length > 0 && product.variants?.length) {
      const firstVariant = product.variants[0];
      const init: Record<string, string> = {};
      product.options.forEach((opt, i) => {
        const raw = i === 0 ? firstVariant.option1 : i === 1 ? firstVariant.option2 : firstVariant.option3;
        if (raw) init[opt.name] = raw;
      });
      setSelectedOptions(init);
    }
  }, [product]);

  // Derive selectedVariant from selectedOptions (option-based) or fall back to first
  const selectedVariant: ProductVariant | null = useMemo(() => {
    if (!product?.variants?.length) return null;

    if (product.options && product.options.length > 0) {
      const match = product.variants.find((v) =>
        product.options!.every((opt, i) => {
          const raw = i === 0 ? v.option1 : i === 1 ? v.option2 : v.option3;
          return raw === selectedOptions[opt.name];
        }),
      );
      return match ?? product.variants[0];
    }

    return product.variants[0];
  }, [product, selectedOptions]);

  const increment = () => setQuantity((v) => v + 1);
  const decrement = () => setQuantity((v) => Math.max(1, v - 1));

  const handleAddToCart = () => {
    if (selectedVariant) addToCart(selectedVariant.id, quantity);
  };

  // Check if a given option value has any in-stock variant given current selection
  const isOptionAvailable = (optionName: string, value: string) => {
    if (!product?.variants?.length || !product.options) return true;
    const optionIndex = product.options.findIndex((o) => o.name === optionName);
    return product.variants.some((v) => {
      const raw = optionIndex === 0 ? v.option1 : optionIndex === 1 ? v.option2 : v.option3;
      if (raw !== value) return false;
      return (
        product.options!.every((opt, i) => {
          if (opt.name === optionName) return true;
          const sel = selectedOptions[opt.name];
          if (!sel) return true;
          const vRaw = i === 0 ? v.option1 : i === 1 ? v.option2 : v.option3;
          return vRaw === sel;
        }) &&
        v.isActive &&
        v.stock > 0
      );
    });
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
  const price = selectedVariant ? Number(selectedVariant.price) : 0;
  const compareAtPrice = selectedVariant?.compareAtPrice ? Number(selectedVariant.compareAtPrice) : null;
  const onSale = compareAtPrice !== null && compareAtPrice > price;
  const images = product.images ?? [];
  const activeImage = images[activeImageIndex];
  const hasOptions = product.options && product.options.length > 0;

  return (
    <Container>
      <div className="flex flex-col gap-6 md:flex-row">

        {/* ── Left: Image Gallery ─────────────────────────────────────────── */}
        <div className="w-full md:w-[40%]">
          {/* Main image */}
          <div className="relative flex items-center justify-center overflow-hidden rounded-lg border bg-gray-50 aspect-square">
            {activeImage ? (
              <img
                src={activeImage.url}
                alt={activeImage.altText ?? product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-8xl">🛍️</span>
            )}
            {product.brand && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                {product.brand.name}
              </Badge>
            )}
            {onSale && (
              <span className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Sale
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(i)}
                  className={twMerge(
                    'h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-colors',
                    i === activeImageIndex
                      ? 'border-red-600'
                      : 'border-transparent hover:border-gray-300',
                  )}
                >
                  <img src={img.url} alt={img.altText ?? ''} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ─────────────────────────────────────────── */}
        <div className="w-full space-y-4 md:w-[60%]">
          <div>
            <p className="text-sm text-gray-500">
              {product.category.name}
              {product.productType && (
                <span className="text-gray-400"> · {product.productType}</span>
              )}
            </p>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <div className="flex items-center gap-1 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <FaStar key={i} className="text-xs text-yellow-400" />
              ))}
              <span className="text-xs text-gray-400 ml-1">({product.id})</span>
            </div>
          </div>

          {/* Price */}
          {selectedVariant && (
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-red-600">
                  {formatNumberToCurrency(price)}
                </p>
                {onSale && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatNumberToCurrency(compareAtPrice!)}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={inStock ? 'default' : 'destructive'}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <p className="text-xs text-gray-500">SKU: {selectedVariant.sku}</p>
              </div>
            </div>
          )}

          {/* Option-based variant selectors */}
          {hasOptions ? (
            <div className="space-y-3">
              {product.options!.map((option) => (
                <div key={option.id} className="space-y-1.5">
                  <p className="text-sm font-medium">
                    {option.name}:{' '}
                    <span className="font-normal text-gray-600">
                      {selectedOptions[option.name]}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((val) => {
                      const available = isOptionAvailable(option.name, val.value);
                      const active = selectedOptions[option.name] === val.value;
                      return (
                        <button
                          key={val.id}
                          onClick={() =>
                            setSelectedOptions((prev) => ({ ...prev, [option.name]: val.value }))
                          }
                          disabled={!available}
                          className={twMerge(
                            'rounded border px-3 py-1 text-sm transition-colors',
                            active
                              ? 'border-red-600 bg-red-50 text-red-600'
                              : 'border-gray-200 hover:border-gray-400',
                            !available ? 'cursor-not-allowed opacity-40 line-through' : '',
                          )}
                        >
                          {val.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Fallback: flat variant list when no structured options
            product.variants && product.variants.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Options:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedOptions({ _id: String(v.id) })}
                      className={twMerge(
                        'rounded border px-3 py-1 text-sm transition-colors',
                        selectedVariant?.id === v.id
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-200 hover:border-gray-400',
                        !v.isActive || v.stock === 0 ? 'opacity-40 cursor-not-allowed' : '',
                      )}
                      disabled={!v.isActive || v.stock === 0}
                    >
                      {v.title ?? v.sku}
                      {v.stock === 0 && ' (OOS)'}
                    </button>
                  ))}
                </div>
              </div>
            )
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

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.map((t) => (
                <Badge key={t.id} variant="outline" className="text-xs capitalize">
                  {t.tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
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
            {product.bodyHtml ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.bodyHtml }}
              />
            ) : product.description ? (
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
