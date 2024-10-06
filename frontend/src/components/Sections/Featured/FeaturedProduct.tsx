import FeaturedProductCarousel from './FeaturedProductCarousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/context/ProductsContext';
import { cva } from 'class-variance-authority';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

const TabsTriggerStyles = cva([
  'data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-red-600 uppercase'
]);

function FeaturedProduct() {
  const { onFetchCategoryProducts, featuredPlayStation, featuredNintendo, featuredLaptop, featuredPCPeripherals } =
    useProducts();

  useEffect(() => {
    onFetchCategoryProducts({ category: 'console' });
    onFetchCategoryProducts({ category: 'ps4-games' });
    onFetchCategoryProducts({ category: 'ps5-games' });
    onFetchCategoryProducts({ category: 'accessories' });
  }, []);

  return (
    <div className="mx-auto py-24 lg:max-w-[90%]">
      <Tabs defaultValue="playstation" className="flex w-full flex-col">
        <h1 className="text-2xl font-medium uppercase">Featured Products</h1>
        <TabsList className="justify-end gap-4 bg-transparent">
          <TabsTrigger value="playstation" className={twMerge(TabsTriggerStyles())}>
            PlayStation
          </TabsTrigger>
          <TabsTrigger value="nintendo" className={twMerge(TabsTriggerStyles())}>
            Nintendo
          </TabsTrigger>
          <TabsTrigger value="laptop" className={twMerge(TabsTriggerStyles())}>
            Laptop
          </TabsTrigger>
          <TabsTrigger value="peripherals" className={twMerge(TabsTriggerStyles())}>
            PC Peripherals
          </TabsTrigger>
          <TabsTrigger value="computer-parts" className={twMerge(TabsTriggerStyles())}>
            Computer Parts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="playstation">
          <FeaturedProductCarousel products={featuredPlayStation} />
        </TabsContent>
        <TabsContent value="nintendo">
          <FeaturedProductCarousel products={featuredNintendo} />
        </TabsContent>
        <TabsContent value="laptop">
          <FeaturedProductCarousel products={featuredLaptop} />
        </TabsContent>
        <TabsContent value="peripherals">
          <FeaturedProductCarousel products={featuredPCPeripherals} />
        </TabsContent>
        <TabsContent value="computer-parts">Make changes to your account here.</TabsContent>
      </Tabs>
    </div>
  );
}

export default FeaturedProduct;
