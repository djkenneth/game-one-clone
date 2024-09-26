// types
import { Product } from '@/types'

import { useProducts } from '@/context/ProductsContext';

// utils
import { formatNumberToCurrency } from '@/lib/utils';

// components
import { Card, CardImage, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
// Icons
import { FaStar } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export const CardGridCol = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { products, isLoading } = useProducts();

    if (isLoading) return 'Loading...'
    // if (error) return `An error has accurred ${error.message}`

    return (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5">
            {products.map((product: Product) => (
                <Card key={product.id} className="group shadow-inner hover:shadow-lg" >
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
                        <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                        </Button>
                        <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                            <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
