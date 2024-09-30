import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardImage, CardTitle } from '../ui/card'
import { FaStar } from 'react-icons/fa'
import { formatNumberToCurrency } from '@/lib/utils'
import { Button } from '../ui/button'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { cva } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel'
import Autoplay from "embla-carousel-autoplay"

const TabsTriggerStyles = cva(['data-[state=active]:bg-transparent data-[state=active]:text-red-600 data-[state=active]:shadow-none data-[state=active]:border-b-4 data-[state=active]:border-red-600 uppercase'])

const CarouselItemStyle = cva(['pl-3 basis-full sm:basis-1/2 md:basis-1/4 lg:basis-1/5'])

function FeaturedProduct() {
    return (
        <div className="mx-auto lg:max-w-[90%]">
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
                    <Carousel
                        className="relative"
                        opts={{
                            loop: true
                        }}
                        plugins={[
                            Autoplay({
                                delay: 10000,
                            }),
                        ]}
                    >
                        <CarouselContent className="px-3">
                            <CarouselItem className={twMerge(CarouselItemStyle())}>
                                <Card className="group shadow-inner hover:shadow-lg" >
                                    <div className='overflow-hidden'>
                                        <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/s/ps5-sandland-standard-ed_1.jpg" className="" />
                                    </div>
                                    <CardHeader className="p-2 pt-0">
                                        <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex justify-center gap-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                        </div>
                                        <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                        <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                        <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem className={twMerge(CarouselItemStyle())}>
                                <Card className="group shadow-inner hover:shadow-lg" >
                                    <div className='overflow-hidden'>
                                        <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/s/ps5-sandland-standard-ed_1.jpg" className="" />
                                    </div>
                                    <CardHeader className="p-2 pt-0">
                                        <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex justify-center gap-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                        </div>
                                        <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                        <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                        <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem className={twMerge(CarouselItemStyle())}>
                                <Card className="group shadow-inner hover:shadow-lg" >
                                    <div className='overflow-hidden'>
                                        <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/s/ps5-sandland-standard-ed_1.jpg" className="" />
                                    </div>
                                    <CardHeader className="p-2 pt-0">
                                        <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex justify-center gap-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                        </div>
                                        <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                        <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                        <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem className={twMerge(CarouselItemStyle())}>
                                <Card className="group shadow-inner hover:shadow-lg" >
                                    <div className='overflow-hidden'>
                                        <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/s/ps5-sandland-standard-ed_1.jpg" className="" />
                                    </div>
                                    <CardHeader className="p-2 pt-0">
                                        <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex justify-center gap-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                        </div>
                                        <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                        <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                        <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem className={twMerge(CarouselItemStyle())}>
                                <Card className="group shadow-inner hover:shadow-lg" >
                                    <div className='overflow-hidden'>
                                        <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/s/ps5-sandland-standard-ed_1.jpg" className="" />
                                    </div>
                                    <CardHeader className="p-2 pt-0">
                                        <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex justify-center gap-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                        </div>
                                        <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                        <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                        <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                            <CarouselItem className={twMerge(CarouselItemStyle())}>
                                <Card className="group shadow-inner hover:shadow-lg" >
                                    <div className='overflow-hidden'>
                                        <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/s/ps5-sandland-standard-ed_1.jpg" className="" />
                                    </div>
                                    <CardHeader className="p-2 pt-0">
                                        <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-3">
                                        <div className="flex justify-center gap-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <FaStar className="text-yellow-400 text-xs" />
                                        </div>
                                        <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                        <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                        <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        </CarouselContent>
                        {/* <CarouselPrevious className="absolute top-1/2 left-6" />
                        <CarouselNext className="absolute top-1/2 right-6" /> */}
                    </Carousel>
                </TabsContent>
                <TabsContent value="nintendo">
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5">
                        <Card className="group shadow-inner hover:shadow-lg" >
                            <div className='overflow-hidden'>
                                <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/3/p3reload_web_2.png" className="" />
                            </div>
                            <CardHeader className="p-2 pt-0">
                                <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex justify-center gap-1">
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                </div>
                                <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                </Button>
                                <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="group shadow-inner hover:shadow-lg" >
                            <div className='overflow-hidden'>
                                <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/3/p3reload_web_2.png" className="" />
                            </div>
                            <CardHeader className="p-2 pt-0">
                                <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex justify-center gap-1">
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                </div>
                                <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                </Button>
                                <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="group shadow-inner hover:shadow-lg" >
                            <div className='overflow-hidden'>
                                <CardImage src="https://gameone.ph/media/catalog/product/cache/19669182221d23c303a16d425547e826/p/3/p3reload_web_2.png" className="" />
                            </div>
                            <CardHeader className="p-2 pt-0">
                                <CardTitle className="line-clamp-2">asdasdas</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex justify-center gap-1">
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                </div>
                                <p className="text-center font-medium">{formatNumberToCurrency(100)}</p>
                                <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                </Button>
                                <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="laptop">Make changes to your account here.</TabsContent>
                <TabsContent value="peripherals">Change your password here.</TabsContent>
                <TabsContent value="computer-parts">Make changes to your account here.</TabsContent>
            </Tabs>
        </div>
    )
}

export default FeaturedProduct