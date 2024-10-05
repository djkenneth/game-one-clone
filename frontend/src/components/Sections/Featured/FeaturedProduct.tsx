import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cva } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { useProducts } from '@/context/ProductsContext';
import { useEffect } from "react"
import FeaturedProductCarousel from "./FeaturedProductCarousel"

const TabsTriggerStyles = cva(['data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-red-600 uppercase'])

function FeaturedProduct() {
    const { fetchCategoryProducts, featuredPlayStation, featuredNintendo, featuredLaptop, featuredPCPeripherals } = useProducts();

    useEffect(() => {
        fetchCategoryProducts({ category: 'console' });
        fetchCategoryProducts({ category: 'ps4-games' });
        fetchCategoryProducts({ category: 'ps5-games' });
        fetchCategoryProducts({ category: 'accessories' });
    }, [])


    return (
        <div className="mx-auto lg:max-w-[90%] py-24">
            <Tabs defaultValue="playstation" className="w-full flex flex-col">
                <h1 className="text-2xl uppercase font-medium">Featured Products</h1>
                <TabsList className="justify-end bg-transparent gap-4">
                    <TabsTrigger value="playstation" className={twMerge(TabsTriggerStyles())}>PlayStation</TabsTrigger>
                    <TabsTrigger value="nintendo" className={twMerge(TabsTriggerStyles())}>Nintendo</TabsTrigger>
                    <TabsTrigger value="laptop" className={twMerge(TabsTriggerStyles())}>Laptop</TabsTrigger>
                    <TabsTrigger value="peripherals" className={twMerge(TabsTriggerStyles())}>PC Peripherals</TabsTrigger>
                    <TabsTrigger value="computer-parts" className={twMerge(TabsTriggerStyles())}>Computer Parts</TabsTrigger>
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
    )
}

export default FeaturedProduct