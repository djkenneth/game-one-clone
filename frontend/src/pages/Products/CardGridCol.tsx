import PrimaryCard from '@/components/Cards/PrimaryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/context/ProductsContext';
import type { Product } from '@/types';

export const CardGridCol = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product: Product) => (
        <PrimaryCard key={product.id} {...product} />
      ))}
    </div>
  );
};
