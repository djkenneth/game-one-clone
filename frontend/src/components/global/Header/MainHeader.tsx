import logo from '@/assets/gameone_logo.png';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatNumberToCurrency } from '@/lib/utils';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineShoppingBag, HiUser } from 'react-icons/hi';
import { IoMenu } from 'react-icons/io5';
import { GoDash, GoPlus } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';

export const MainHeader = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [search, setSearch] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const { cart, cartCount, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const cartTotal = cart?.items?.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  ) ?? 0;

  return (
    <div className="bg-dark-90 px-4 py-3">
      <Container className="flex items-center justify-between gap-4">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-2">
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IoMenu className="size-7 text-white" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-3 pt-4">
                  <SheetClose asChild>
                    <Link to="/products" className="text-sm font-medium hover:text-red-600">
                      All Products
                    </Link>
                  </SheetClose>
                  {isAuthenticated ? (
                    <>
                      <SheetClose asChild>
                        <Link to="/account/profile" className="text-sm font-medium hover:text-red-600">
                          My Account
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/account/orders" className="text-sm font-medium hover:text-red-600">
                          My Orders
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/account/wallet" className="text-sm font-medium hover:text-red-600">
                          Wallet
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button onClick={logout} className="text-sm font-medium text-red-600 text-left">
                          Logout
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link to="/customer/account/login" className="text-sm font-medium hover:text-red-600">
                          Login
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/customer/account/create" className="text-sm font-medium hover:text-red-600">
                          Register
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Store</span>
            <img alt="logo" src={logo} className="h-10 w-auto md:h-20" />
          </Link>
        </div>

        {/* Center: Search */}
        <form
          onSubmit={handleSearch}
          className="hidden w-full max-w-lg items-center space-x-2 rounded-xl bg-white pl-2 md:flex"
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="h-14 border-none bg-white focus-visible:ring-0"
          />
          <Button type="submit" variant="solidred" className="h-14 rounded-l-none rounded-r-lg">
            <FaSearch className="text-lg" />
          </Button>
        </form>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          <FaSearch
            onClick={() => setToggleSearch(!toggleSearch)}
            className="block cursor-pointer text-2xl text-white md:hidden"
          />

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-white">
                  <HiUser className="text-2xl" />
                  <span className="hidden text-xs md:block max-w-[80px] truncate">
                    {user?.profile ? `${user.profile.firstName}` : user?.email?.split('@')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/addresses">Addresses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/wallet">Wallet</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/customer/account/login">
              <HiUser className="text-2xl text-white" />
            </Link>
          )}

          {/* Cart Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative">
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
                <HiOutlineShoppingBag className="text-3xl text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Your Cart ({cartCount})</SheetTitle>
              </SheetHeader>

              {!isAuthenticated ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <HiOutlineShoppingBag className="text-6xl text-gray-300" />
                  <p className="text-gray-500">Please log in to view your cart</p>
                  <SheetClose asChild>
                    <Button asChild variant="solidred">
                      <Link to="/customer/account/login">Login</Link>
                    </Button>
                  </SheetClose>
                </div>
              ) : !cart || cart.items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <HiOutlineShoppingBag className="text-6xl text-gray-300" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <SheetClose asChild>
                    <Button asChild variant="solidred">
                      <Link to="/products">Shop Now</Link>
                    </Button>
                  </SheetClose>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 py-4">
                    <div className="flex flex-col gap-4 pr-4">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100 text-2xl flex-shrink-0">
                            🛍️
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex justify-between gap-2">
                              <p className="text-sm font-medium line-clamp-1">
                                {item.variant.product.name}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-xs text-gray-400 hover:text-red-500 flex-shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">{item.variant.sku}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                                >
                                  <GoDash className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateItem(item.id, item.quantity + 1)}
                                >
                                  <GoPlus className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-sm font-semibold text-red-600">
                                {formatNumberToCurrency(Number(item.price) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator />
                  <SheetFooter className="flex flex-col gap-3 pt-4">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>{formatNumberToCurrency(cartTotal)}</span>
                    </div>
                    <SheetClose asChild>
                      <Button asChild variant="solidred" className="w-full">
                        <Link to="/cart">View Cart</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link to="/checkout">Checkout</Link>
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </Container>

      {toggleSearch && (
        <form onSubmit={handleSearch} className="pt-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
            placeholder="Search products..."
          />
        </form>
      )}
    </div>
  );
};
