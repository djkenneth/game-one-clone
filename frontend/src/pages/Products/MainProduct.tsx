import Container from '@/components/ui/container';
import { useProducts } from '@/context/ProductsContext';
import { useEffect } from 'react';

type MainProducType = {
  productId: string;
};

function MainProduct({ productId }: MainProducType) {
  const { onFetchProduct, product } = useProducts();

  useEffect(() => {
    onFetchProduct({ id: parseInt(productId) });
  }, [productId]);

  return (
    <Container>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full bg-red-300 md:w-[30%]">
          <img src={product?.image} className="w-full" />
        </div>
        <div className="w-full bg-red-300 md:w-[70%]">
          <h1 className="text-2xl font-medium">{product?.title}</h1>
        </div>
      </div>
    </Container>
  );
}

export default MainProduct;
