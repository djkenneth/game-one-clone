import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/apis/products'
import { Product } from '@/types'
import { Card, CardImage, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { FaStar } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { formatNumberToCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Products = () => {
    const { isLoading, error, data: products } = useQuery({ queryKey: ['products'], queryFn: getProducts })

    if (isLoading) return 'Loading...'
    if (error) return `An error has accurred ${error.message}`

    return (
        <div className="container max-w-7xl mx-auto 2xl:max-w-[90%]">
            <div className="flex gap-2">
                <div className="w-[25%] bg-red-400">
                    <h1>aslidjashd</h1>
                </div>
                <div className="w-[75%] grid gap-3 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5">
                    {products.map((product: Product) => (
                        <Card className="group shadow-inner hover:shadow-lg">
                            <div className='overflow-hidden'>
                                <CardImage src={product.image} className="" />
                            </div>
                            <CardHeader className="p-2 pt-0">
                                <CardTitle className="line-clamp-2">{product.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="flex justify-center gap-1">
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                    <FaStar className="text-yellow-400 text-xs" />
                                </div>
                                <p className="text-center font-medium">{formatNumberToCurrency(product.price)}</p>
                                <Button variant="destructive" size="sm">
                                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                                </Button>
                            </CardContent>
                            {/* <CardFooter>
                                    <p>Card Footer</p>
                                </CardFooter> */}
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    )
}
