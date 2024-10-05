import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { cva } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import Autoplay from "embla-carousel-autoplay"
import { Product } from "@/types"
import PrimaryCard from "@/components/Cards/PrimaryCard"

const CarouselItemStyle = cva(['pl-3 basis-full sm:basis-1/2 md:basis-1/4 lg:basis-1/5'])

type FeaturedProductCarouselType = {
    products: Product[]
}

function FeaturedProductCarousel({ products }: FeaturedProductCarouselType) {
    return (
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
                {products.map((product: Product) => (
                    <CarouselItem key={product.id} className={twMerge(CarouselItemStyle())}>
                        <PrimaryCard {...product} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-6" />
            <CarouselNext className="absolute top-1/2 right-6" />
        </Carousel>
    )
}

export default FeaturedProductCarousel