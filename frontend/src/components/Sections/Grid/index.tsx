import { Link } from 'react-router-dom';

export function FirstGrid() {
  return (
    <section className="bg-egg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="inline-block rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-red-600">
              Deals
            </span>
            <h2 className="mt-2 font-oswald text-2xl font-bold uppercase tracking-wide text-gray-900 md:text-3xl">
              Featured Brands
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden text-sm font-medium text-red-600 underline-offset-4 hover:underline sm:block"
          >
            View all products →
          </Link>
        </div>

        {/* 2-col main banners */}
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="group overflow-hidden rounded-xl bg-gray-100 shadow-sm">
            <img
              src="grid/long/Left_Secondary_Banner_Asus_.png"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              alt="ASUS"
            />
          </div>
          <div className="group overflow-hidden rounded-xl bg-gray-100 shadow-sm">
            <img
              src="grid/long/RIght_Secondary_Banner_MSI.png"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              alt="MSI"
            />
          </div>
        </div>

        {/* 3-col smaller banners */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { src: 'grid/small/8BitDo.png', alt: '8BitDo' },
            { src: 'grid/small/Hori.png', alt: 'Hori' },
            { src: 'grid/small/Yunzii.png', alt: 'Yunzii' },
          ].map(({ src, alt }) => (
            <div key={alt} className="group overflow-hidden rounded-xl bg-gray-100 shadow-sm">
              <img
                src={src}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                alt={alt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SecondGrid() {
  const brands = [
    { src: 'grid/small/ASUS_ROG_1_.png', alt: 'ASUS ROG' },
    { src: 'grid/small/Steelseries.png', alt: 'SteelSeries' },
    { src: 'grid/small/Logitech_1_.png', alt: 'Logitech' },
  ];

  return (
    <section className="bg-[#f4f4f4] py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-red-600">
            Partners
          </span>
          <h2 className="mt-2 font-oswald text-2xl font-bold uppercase tracking-wide text-gray-900 md:text-3xl">
            Top Brands
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Shop authentic gear from the world's leading gaming brands
          </p>
        </div>

        {/* Full-width banner */}
        <div className="group mb-3 overflow-hidden rounded-2xl bg-gray-200 shadow-md">
          <img
            src="grid/long/Left_Secondary_Banner_Asus_.png"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            alt="ASUS"
          />
        </div>

        {/* 3 brand cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {brands.map(({ src, alt }) => (
            <Link
              key={alt}
              to={`/products?brand=${alt.toLowerCase().replace(/\s/g, '-')}`}
              className="group relative overflow-hidden rounded-xl bg-gray-200 shadow-sm"
            >
              <img
                src={src}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                alt={alt}
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-oswald text-sm font-semibold uppercase tracking-wider text-white">
                  Shop {alt} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
