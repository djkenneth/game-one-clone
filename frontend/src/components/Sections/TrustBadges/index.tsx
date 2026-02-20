import { FaTruck, FaShieldAlt, FaUndo, FaHeadset, FaMedal } from 'react-icons/fa';

const badges = [
  {
    icon: FaTruck,
    title: 'Free Shipping',
    description: 'On orders over ₱5,000',
  },
  {
    icon: FaShieldAlt,
    title: 'Secure Payment',
    description: 'SSL encrypted checkout',
  },
  {
    icon: FaUndo,
    title: 'Easy Returns',
    description: '30-day hassle-free returns',
  },
  {
    icon: FaHeadset,
    title: '24/7 Support',
    description: 'We\'re always here to help',
  },
  {
    icon: FaMedal,
    title: 'Genuine Products',
    description: '100% authentic guarantee',
  },
];

function TrustBadges() {
  return (
    <div className="border-y border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
          {badges.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col items-center gap-3 px-4 py-6 text-center transition-colors hover:bg-red-600 sm:flex-row sm:text-left"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 transition-colors group-hover:bg-red-500">
                <Icon className="text-xl text-red-600 transition-colors group-hover:text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-white">
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 transition-colors group-hover:text-red-100">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrustBadges;
