import { useEffect, useState } from 'react';
import Container from '@/components/ui/container';
import { useProducts } from '@/context/ProductsContext';
import { formatNumberToCurrency, parseMarkdown } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

// Icons
import { FaStar } from 'react-icons/fa6';
import { GoDash, GoPlus } from "react-icons/go";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';
import Image from '@/components/ui/image';

const TabsTriggerStyles = cva([
  'data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-red-600 uppercase'
]);

type MainProducType = {
  productId: string;
};

function MainProduct({ productId }: MainProducType) {
  const { handleAddtoCart } = useAuth();
  const { onFetchProduct, product } = useProducts();

  const [quantity, setQuantity] = useState<number>(1);

  const increment = () => {
    setQuantity(value => value + 1)
  }

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(value => value - 1)
    }
  }

  useEffect(() => {
    onFetchProduct({ id: parseInt(productId) });
  }, [productId]);

  return (
    <Container>
      <div className="flex flex-col gap-4 h-[26rem] md:flex-row">
        <div className="w-full relative border md:w-[30%]">
          {/* <div>
            <img src={product?.image} className="w-full" />
            
          </div> */}
          <Image src={product?.image} />
          <p className="text-sm text-center absolute bottom-1 w-full">{product?.title}</p>
        </div>
        <div className="w-full space-y-5 md:w-[70%]">
          <div>
            <h1 className="text-2xl font-open-sans font-semibold">{product?.title}</h1>
            <div className='flex items-center divide-x-2'>
              <div className="flex items-center gap-1 pr-5">
                <FaStar className="text-xs text-yellow-400" />
                <FaStar className="text-xs text-yellow-400" />
                <FaStar className="text-xs text-yellow-400" />
                <FaStar className="text-xs text-yellow-400" />
              </div>
              <Link to="#" className='pl-5'>Be the first to review this product</Link>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold font-oswald text-red-600">{formatNumberToCurrency(product?.price as number)}</p>
            </div>
            <div className='flex flex-col'>
              <p className="text-sm text-gray-500">Availability: {product?.availability ? 'In Stock' : 'Out of Stock'}</p>
              <p className="text-sm text-gray-500">SKU#: {product?.sku}</p>
            </div>
          </div>
          <hr />
          <div className="flex gap-6">
            <div className='flex items-center'>
              <Button variant="outline" size="icon" onClick={decrement}>
                <GoDash />
              </Button>
              <Input type="text" className="w-14 text-center font-bold" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
              <Button variant="outline" size="icon" onClick={increment}>
                <GoPlus />
              </Button>
            </div>
            <Button onClick={() => handleAddtoCart({ productId: parseInt(productId), quantity })} variant="solidred" size="lg" className="group-hover:inline-flex">
              <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
            </Button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="details" className="flex w-full flex-col">
        <TabsList className="justify-start gap-4 bg-transparent">
          <TabsTrigger value="details" className={twMerge(TabsTriggerStyles())}>
            Details
          </TabsTrigger>
          <TabsTrigger value="reviews" className={twMerge(TabsTriggerStyles())}>
            Reviews
          </TabsTrigger>
          <TabsTrigger value="related-posts" className={twMerge(TabsTriggerStyles())}>
            Related Posts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div dangerouslySetInnerHTML={{ __html: parseMarkdown(product?.description || '') }} />
        </TabsContent>
        <TabsContent value="reviews">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam, iste! Labore exercitationem autem alias odit dolorem sequi repellat harum perspiciatis, explicabo tempore corrupti reprehenderit accusantium iusto nemo natus ea porro!
        </TabsContent>
        <TabsContent value="related-posts">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt mollitia vel, enim consequuntur aspernatur numquam tenetur expedita necessitatibus recusandae eveniet aliquam sed placeat ipsa, deserunt quam provident commodi, quasi nam.
        </TabsContent>
      </Tabs>
    </Container>
  );
}

export default MainProduct;
