import { Link } from 'react-router-dom';

const categoriesData = [
  { title: 'Controller', src: 'icons/controller.png', slug: 'controller' },
  { title: 'Gaming Chair', src: 'icons/chair.png', slug: 'gaming-chair' },
  { title: 'Graphic Card', src: 'icons/graphics_card.png', slug: 'graphic-card' },
  { title: 'Headset', src: 'icons/headset.png', slug: 'headset' },
  { title: 'Keyboard', src: 'icons/keyboard.png', slug: 'keyboard' },
  { title: 'Memory Card', src: 'icons/memory-card.png', slug: 'memory-card' },
  { title: 'Merch', src: 'icons/merch.png', slug: 'merch' },
  { title: 'Microphone', src: 'icons/mic.png', slug: 'microphone' },
  { title: 'Monitor', src: 'icons/monitor.png', slug: 'monitor' },
  { title: 'Motherboard', src: 'icons/motherboard.png', slug: 'motherboard' },
  { title: 'Mouse', src: 'icons/mouse.png', slug: 'mouse' },
  { title: 'Router', src: 'icons/router.png', slug: 'router' },
  { title: 'Webcam', src: 'icons/webcam.png', slug: 'webcam' },
];

function CategoryBoxes() {
  return (
    <section className="bg-dark-90 py-20">
      {/* Section Header */}
      <div className="mx-auto mb-12 max-w-7xl px-4 text-center">
        <span className="inline-block rounded-full bg-red-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-500">
          Browse
        </span>
        <h2 className="mt-3 font-oswald text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
          Shop by Category
        </h2>
        <p className="mt-2 text-sm text-gray-400">Find the perfect gear for your setup</p>
      </div>

      {/* Category Grid */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          {categoriesData.map((cat) => (
            <Link
              key={cat.title}
              to={`/products?category=${cat.slug}`}
              className="group relative flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-600/50 hover:bg-red-600/10 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]"
            >
              <div className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img
                  src={cat.src}
                  alt={cat.title}
                  className="h-10 w-10 object-contain drop-shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xs font-semibold leading-tight text-gray-300 transition-colors group-hover:text-white">
                {cat.title}
              </span>
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-red-500 transition-all duration-300 group-hover:w-8" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryBoxes;
