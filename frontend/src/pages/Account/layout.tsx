import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/account/profile', label: 'Profile' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/wallet', label: 'Wallet' },
];

const AccountLayout = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold">My Account</h1>
        <Separator className="my-4" />
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-48 flex-shrink-0">
            <nav className="flex flex-row gap-1 md:flex-col">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AccountLayout;
