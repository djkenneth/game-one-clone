// types
import PrimaryCard from '@/components/Cards/PrimaryCard';
import { useProducts } from '@/context/ProductsContext';
import { Product } from '@/types';

export const CardGridCol = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) return 'Loading...';
  // if (error) return `An error has accurred ${error.message}`

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5">
      {products.map((product: Product) => (
        <PrimaryCard key={product.id} {...product} />
      ))}
    </div>
  );
};
