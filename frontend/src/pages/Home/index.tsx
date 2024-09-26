import Autoplay from "embla-carousel-autoplay"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const Home = () => {
    return (
        <div>
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
                <CarouselContent>
                    <CarouselItem>
                        <img src="homeslider/slider-1.jpg" className="object-cover w-full min-h-32" />
                    </CarouselItem>
                    <CarouselItem>
                        <img src="homeslider/slider-2.jpg" className="object-cover w-full min-h-32" />
                    </CarouselItem>
                    <CarouselItem>
                        <img src="homeslider/slider-3.jpg" className="object-cover w-full min-h-32" />
                    </CarouselItem>
                    <CarouselItem>
                        <img src="homeslider/slider-4.jpg" className="object-cover w-full min-h-32" />
                    </CarouselItem>
                    <CarouselItem>
                        <img src="homeslider/slider-5.jpg" className="object-cover w-full min-h-32" />
                    </CarouselItem>
                    <CarouselItem>
                        <img src="homeslider/slider-6.jpg" className="object-cover w-full min-h-32" />
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-6" />
                <CarouselNext className="absolute top-1/2 right-6" />
            </Carousel>
        </div>
    )
}

export default Home;