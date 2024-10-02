import React from 'react'
// utils
import { formatNumberToCurrency } from '@/lib/utils';

// types
import { Product } from '@/types'

// components
import { Card, CardImage, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
// Icons
import { FaStar } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";

function PrimaryCard({ image, title, price }: Product) {
    return (
        <Card className="group shadow-inner hover:shadow-lg" >
            <div className='overflow-hidden'>
                <CardImage src={image} className="" />
            </div>
            <CardHeader className="p-2 pt-0">
                <CardTitle className="line-clamp-2">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex justify-center gap-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <FaStar className="text-yellow-400 text-xs" />
                    <FaStar className="text-yellow-400 text-xs" />
                    <FaStar className="text-yellow-400 text-xs" />
                </div>
                <p className="text-center font-medium">{formatNumberToCurrency(price)}</p>
                <Button variant="secondary" size="sm" className="inline-flex group-hover:hidden">
                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                </Button>
                <Button variant="destructive" size="sm" className="hidden group-hover:inline-flex">
                    <HiOutlineShoppingBag className="mr-2 h-4 w-4" /> ADD TO CART
                </Button>
            </CardContent>
        </Card>
    )
}

export default PrimaryCard