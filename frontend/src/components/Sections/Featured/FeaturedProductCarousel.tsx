import PrimaryCard from '@/components/Cards/PrimaryCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Product } from '@/types';
import { cva } from 'class-variance-authority';
import Autoplay from 'embla-carousel-autoplay';
import { twMerge } from 'tailwind-merge';

const CarouselItemStyle = cva(['pl-3 basis-full sm:basis-1/2 md:basis-1/4 lg:basis-1/5']);

type FeaturedProductCarouselType = {
  products: Product[];
};

function FeaturedProductCarousel({ products }: FeaturedProductCarouselType) {
  return (
    <Carousel
      className="relative"
      opts={{
        loop: true
      }}
      plugins={[
        Autoplay({
          delay: 10000
        })
      ]}
    >
      <CarouselContent className="px-3">
        {products.map((product: Product) => (
          <CarouselItem key={product.id} className={twMerge(CarouselItemStyle())}>
            <PrimaryCard {...product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-6 top-1/2" />
      <CarouselNext className="absolute right-6 top-1/2" />
    </Carousel>
  );
}

export default FeaturedProductCarousel;
