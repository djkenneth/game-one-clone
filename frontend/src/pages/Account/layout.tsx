import Container from '@/components/ui/container';
import { cn } from '@/lib/utils';
import {
  HiOutlineUser,
  HiOutlineMapPin,
  HiOutlineShoppingBag,
  HiOutlineWallet,
} from 'react-icons/hi2';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/account/profile', label: 'Profile', icon: HiOutlineUser },
  { to: '/account/addresses', label: 'Addresses', icon: HiOutlineMapPin },
  { to: '/account/orders', label: 'Orders', icon: HiOutlineShoppingBag },
  { to: '/account/wallet', label: 'Wallet', icon: HiOutlineWallet },
];

const AccountLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top banner */}
      <div className="bg-dark-90 py-6">
        <Container>
          <h1 className="font-oswald text-2xl font-bold uppercase tracking-wide text-white">
            My Account
          </h1>
        </Container>
      </div>

      <Container>
        <div className="flex flex-col gap-6 py-8 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full flex-shrink-0 md:w-52">
            <nav className="flex flex-row gap-1 overflow-x-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm md:flex-col">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-gray-400')} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountLayout;
