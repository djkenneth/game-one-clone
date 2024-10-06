import Container from '@/components/ui/container';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export const MainPanelTop = () => {
  const { user, logout } = useAuth();

  return (
    <div className="hidden bg-red-600 md:block">
      <Container className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center justify-end px-6 py-3 text-white lg:px-8">
          <ul className="flex divide-x uppercase">
            <li className="px-5 text-sm"></li>
            <li className="cursor-pointer px-5 text-sm">Contact Us</li>
            <li className="cursor-pointer px-5 text-sm">FInd a Store</li>
            {user && (
              <li onClick={logout} className="cursor-pointer px-5 text-sm">
                Sign Out
              </li>
            )}

            {!user && (
              <>
                <li className="cursor-pointer px-5 text-sm">
                  <Link to="/customer/account/login">Sign In</Link>
                </li>
                <li className="cursor-pointer pl-5 text-sm">
                  <Link to="/customer/account/create">Create an Account</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </Container>
    </div>
  );
};
