import { Link } from 'react-router-dom';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const links = [
    { to: '/account/profile', label: 'Profile', desc: 'Update your personal information' },
    { to: '/account/orders', label: 'Orders', desc: 'Track and manage your orders' },
    { to: '/account/addresses', label: 'Addresses', desc: 'Manage your delivery addresses' },
    { to: '/account/wallet', label: 'Wallet', desc: 'View balance and transactions' },
  ];

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.profile ? user.profile.firstName : user?.email?.split('@')[0]}!
        </h1>
        <p className="mt-1 text-gray-500">What would you like to do today?</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <div key={link.to} className="rounded-lg border p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold">{link.label}</h3>
              <p className="mt-1 text-sm text-gray-500">{link.desc}</p>
              <Button asChild variant="solidred" size="sm" className="mt-3">
                <Link to={link.to}>Go</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
