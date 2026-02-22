import { Link } from 'react-router-dom';
import Container from '@/components/ui/container';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineMapPin, HiOutlineWallet } from 'react-icons/hi2';

const links = [
  {
    to: '/account/profile',
    label: 'Profile',
    desc: 'Update your personal information',
    icon: HiOutlineUser,
    color: 'bg-blue-50 text-blue-600',
    border: 'hover:border-blue-200',
  },
  {
    to: '/account/orders',
    label: 'My Orders',
    desc: 'Track and manage your orders',
    icon: HiOutlineShoppingBag,
    color: 'bg-red-50 text-red-600',
    border: 'hover:border-red-200',
  },
  {
    to: '/account/addresses',
    label: 'Addresses',
    desc: 'Manage your delivery addresses',
    icon: HiOutlineMapPin,
    color: 'bg-green-50 text-green-600',
    border: 'hover:border-green-200',
  },
  {
    to: '/account/wallet',
    label: 'Wallet',
    desc: 'View balance and transactions',
    icon: HiOutlineWallet,
    color: 'bg-amber-50 text-amber-600',
    border: 'hover:border-amber-200',
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const name = user?.profile ? user.profile.firstName : user?.email?.split('@')[0];

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-dark-90">
        <Container>
          <div className="flex items-center justify-between py-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-red-500">
                Welcome back
              </p>
              <h1 className="mt-1 font-oswald text-3xl font-bold text-white md:text-4xl">
                {name}!
              </h1>
              <p className="mt-1 text-sm text-gray-400">What would you like to do today?</p>
            </div>
            <div className="hidden h-20 w-20 items-center justify-center rounded-full bg-red-600/10 text-4xl md:flex">
              👾
            </div>
          </div>
        </Container>
      </div>

      {/* Cards */}
      <Container>
        <div className="py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {links.map(({ to, label, desc, icon: Icon, color, border }) => (
              <Link
                key={to}
                to={to}
                className={`group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${border}`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
                </div>
                <span className="mt-auto text-xs font-medium text-gray-400 transition-colors group-hover:text-red-600">
                  View →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
