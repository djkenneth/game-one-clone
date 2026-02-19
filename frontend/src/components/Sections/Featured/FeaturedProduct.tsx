import Container from '@/components/ui/container';
import FeaturedProductCarousel from './FeaturedProductCarousel';
import { useProducts } from '@/context/ProductsContext';

function FeaturedProduct() {
  const { products } = useProducts();

  if (products.length === 0) return null;

  return (
    <Container className="py-12">
      <h2 className="mb-4 text-2xl font-semibold uppercase">Featured Products</h2>
      <FeaturedProductCarousel products={products.slice(0, 10)} />
    </Container>
  );
}

export default FeaturedProduct;
