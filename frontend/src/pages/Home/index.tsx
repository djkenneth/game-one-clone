import CategoryBoxes from '@/components/Sections/CategoryBoxes';
import FeaturedProduct from '@/components/Sections/Featured/FeaturedProduct';
import { FirstGrid, SecondGrid } from '@/components/Sections/Grid';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const Home = () => {
  return (
    <>
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
        <CarouselContent>
          <CarouselItem>
            <img src="homeslider/slider-1.jpg" className="min-h-32 w-full object-cover" />
          </CarouselItem>
          <CarouselItem>
            <img src="homeslider/slider-2.jpg" className="min-h-32 w-full object-cover" />
          </CarouselItem>
          <CarouselItem>
            <img src="homeslider/slider-3.jpg" className="min-h-32 w-full object-cover" />
          </CarouselItem>
          <CarouselItem>
            <img src="homeslider/slider-4.jpg" className="min-h-32 w-full object-cover" />
          </CarouselItem>
          <CarouselItem>
            <img src="homeslider/slider-5.jpg" className="min-h-32 w-full object-cover" />
          </CarouselItem>
          <CarouselItem>
            <img src="homeslider/slider-6.jpg" className="min-h-32 w-full object-cover" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="absolute left-6 top-1/2" />
        <CarouselNext className="absolute right-6 top-1/2" />
      </Carousel>
      <FeaturedProduct />
      <CategoryBoxes />
      <FirstGrid />
      <SecondGrid />
    </>
  );
};

export default Home;
