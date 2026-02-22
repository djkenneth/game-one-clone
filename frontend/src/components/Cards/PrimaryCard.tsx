import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatNumberToCurrency } from '@/lib/utils';
import type { Product } from '@/types';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

function PrimaryCard({ id, name, variants, brand, images }: Product) {
  const { addToCart } = useCart();
  const firstVariant = variants?.[0];
  const price = firstVariant ? Number(firstVariant.price) : 0;
  const compareAtPrice = firstVariant?.compareAtPrice ? Number(firstVariant.compareAtPrice) : null;
  const inStock = firstVariant ? firstVariant.stock > 0 : false;
  const onSale = compareAtPrice !== null && compareAtPrice > price;
  const coverImage = images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (firstVariant) addToCart(firstVariant.id, 1);
  };

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-red-100">

        {/* Image area */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
          {coverImage ? (
            <img
              src={coverImage.url}
              alt={coverImage.altText ?? name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl text-gray-200 transition-transform duration-500 group-hover:scale-110">
              🛍️
            </div>
          )}

          {/* Brand badge */}
          {brand && (
            <span className="absolute left-2 top-2 rounded-md bg-dark-90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              {brand.name}
            </span>
          )}

          {/* Sale / Stock badge */}
          <div className="absolute right-2 top-2 flex flex-col gap-1 items-end">
            {onSale && (
              <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Sale
              </span>
            )}
            {!inStock && firstVariant && (
              <span className="rounded-md bg-gray-700/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                Sold Out
              </span>
            )}
          </div>

          {/* Add to cart overlay — slides up on hover */}
          {inStock && firstVariant && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <button
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 bg-red-600 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-700 active:bg-red-800"
              >
                <HiOutlineShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-800">
            {name}
          </p>
          {firstVariant ? (
            <div className="mt-auto flex items-baseline gap-2 pt-2">
              <p className="text-base font-bold text-red-600">
                {formatNumberToCurrency(price)}
              </p>
              {onSale && (
                <span className="text-xs text-gray-400 line-through">
                  {formatNumberToCurrency(compareAtPrice!)}
                </span>
              )}
            </div>
          ) : (
            <p className="mt-auto pt-2 text-xs text-gray-400">No variants</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PrimaryCard;
