// types
import { Product } from '@/types'

import { useProducts } from '@/context/ProductsContext';
import PrimaryCard from '@/components/Cards/PrimaryCard';



export const CardGridCol = () => {
    const { products, isLoading } = useProducts();

    if (isLoading) return 'Loading...'
    // if (error) return `An error has accurred ${error.message}`

    return (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5">
            {products.map((product: Product) => (
                <PrimaryCard key={product.id} {...product} />
            ))}
        </div>
    )
}
