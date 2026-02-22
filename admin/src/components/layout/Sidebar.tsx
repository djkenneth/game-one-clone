import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Layers,
  ShoppingCart,
  CreditCard,
  Star,
  Store,
  UserCheck,
} from 'lucide-react';

const navGroups = [
  {
    label: null,
    items: [{ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/products', icon: Package, label: 'Products' },
      { to: '/categories', icon: Layers, label: 'Categories' },
      { to: '/brands', icon: Tag, label: 'Brands' },
    ],
  },
  {
    label: 'Store',
    items: [
      { to: '/orders', icon: ShoppingCart, label: 'Orders' },
      { to: '/payments', icon: CreditCard, label: 'Payments' },
      { to: '/reviews', icon: Star, label: 'Reviews' },
    ],
  },
  {
    label: 'Users',
    items: [
      { to: '/users', icon: Users, label: 'Users' },
      { to: '/shops', icon: Store, label: 'Shops' },
      { to: '/sellers', icon: UserCheck, label: 'Sellers' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-bold tracking-tight">Admin Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-4">
            {group.label && (
              <p className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
