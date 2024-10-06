import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const categoriesSliderData = [
  { title: 'Controller', src: 'icons/controller.png' },
  { title: 'Gaming Chair', src: 'icons/chair.png' },
  { title: 'Graphic Card', src: 'icons/graphics_card.png' },
  { title: 'Headset', src: 'icons/headset.png' },
  { title: 'Keyboard', src: 'icons/keyboard.png' },
  { title: 'Memory Card', src: 'icons/memory-card.png' },
  { title: 'Merch', src: 'icons/merch.png' },
  { title: 'Microphone', src: 'icons/mic.png' },
  { title: 'Monitor', src: 'icons/monitor.png' },
  { title: 'Motherboard', src: 'icons/motherboard.png' },
  { title: 'Mouse', src: 'icons/mouse.png' },
  { title: 'Router', src: 'icons/router.png' },
  { title: 'Webcam', src: 'icons/webcam.png' }
];

function CategoryBoxes() {
  return (
    <div className="bg-[#f4f4f4] py-28">
      <div className="mx-auto lg:max-w-[90%]">
        <Carousel
          className="relative"
          opts={{
            loop: true
          }}
          plugins={[
            Autoplay({
              delay: 5000
            })
          ]}
        >
          <CarouselContent className="px-3">
            {categoriesSliderData.map((data) => (
              <CarouselItem key={data.title} className="basis-52">
                <div className="flex h-44 w-48 flex-col items-center justify-center gap-2 bg-egg-white">
                  <img src={data.src} className="w-12" />
                  <p className="text-md font-semibold">{data.title}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-6 top-1/2" />
          <CarouselNext className="absolute right-6 top-1/2" />
        </Carousel>
      </div>
    </div>
  );
}

export default CategoryBoxes;
