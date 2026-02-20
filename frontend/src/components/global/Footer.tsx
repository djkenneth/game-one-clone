import logo from '@/assets/gameone_logo.png';
import Container from '@/components/ui/container';
import { Separator } from '@/components/ui/separator';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

const shopLinks = [
  { label: 'All Products', to: '/products' },
  { label: 'PlayStation', to: '/products?category=playstation' },
  { label: 'Xbox', to: '/products?category=xbox' },
  { label: 'Nintendo', to: '/products?category=nintendo' },
  { label: 'PC Peripherals', to: '/products?category=pc-peripherals' },
  { label: 'New Arrivals', to: '/products?sort=newest' },
];

const accountLinks = [
  { label: 'My Account', to: '/account/profile' },
  { label: 'My Orders', to: '/account/orders' },
  { label: 'My Wallet', to: '/account/wallet' },
  { label: 'Saved Addresses', to: '/account/addresses' },
  { label: 'Sign In', to: '/customer/account/login' },
  { label: 'Create Account', to: '/customer/account/create' },
];

const supportLinks = [
  { label: 'Contact Us', to: '/' },
  { label: 'FAQ', to: '/' },
  { label: 'Shipping Policy', to: '/' },
  { label: 'Returns & Refunds', to: '/' },
  { label: 'Track Your Order', to: '/account/orders' },
  { label: 'Find a Store', to: '/' },
];

const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaTwitter, label: 'Twitter', href: '#' },
  { icon: FaYoutube, label: 'YouTube', href: '#' },
  { icon: FaTiktok, label: 'TikTok', href: '#' },
];

const paymentIcons = [FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex];

const legalLinks = [
  { label: 'Privacy Policy', to: '/' },
  { label: 'Terms of Service', to: '/' },
  { label: 'Cookie Policy', to: '/' },
];

export const Footer = () => {
  return (
    <footer>
      {/* Newsletter Banner */}
      <div className="bg-red-600 py-10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="font-oswald text-2xl font-bold uppercase tracking-wide text-white">
                Stay in the loop
              </h3>
              <p className="mt-1 text-sm text-red-100">
                Get exclusive deals, new arrivals and gaming news straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full max-w-md gap-0 overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex flex-1 items-center bg-white px-4">
                <MdEmail className="mr-2 shrink-0 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-dark-90 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </div>

      {/* Main Footer Body */}
      <div className="bg-dark-90 pt-14 pb-10">
        <Container>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Column 1 — Brand */}
            <div className="flex flex-col gap-5">
              <Link to="/" className="inline-block">
                <img src={logo} alt="GameOne" className="h-14 w-auto" />
              </Link>
              <p className="text-sm leading-relaxed text-gray-400">
                Your one-stop destination for gaming gear, consoles, peripherals and everything in between. Level up your setup with GameOne.
              </p>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <a href="tel:+639000000000" className="flex items-center gap-2 transition-colors hover:text-red-500">
                  <MdPhone className="shrink-0 text-base text-red-500" />
                  +63 900 000 0000
                </a>
                <a href="mailto:support@gameone.ph" className="flex items-center gap-2 transition-colors hover:text-red-500">
                  <MdEmail className="shrink-0 text-base text-red-500" />
                  support@gameone.ph
                </a>
                <span className="flex items-start gap-2">
                  <MdLocationOn className="mt-0.5 shrink-0 text-base text-red-500" />
                  123 Gaming St., Makati City, Metro Manila, Philippines
                </span>
              </div>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Icon className="text-sm" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 — Shop */}
            <div>
              <h4 className="mb-5 font-oswald text-sm font-semibold uppercase tracking-widest text-white">
                Shop
              </h4>
              <ul className="flex flex-col gap-3">
                {shopLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-500"
                    >
                      <span className="h-px w-4 bg-gray-600 transition-all group-hover:w-6 group-hover:bg-red-500" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — My Account */}
            <div>
              <h4 className="mb-5 font-oswald text-sm font-semibold uppercase tracking-widest text-white">
                My Account
              </h4>
              <ul className="flex flex-col gap-3">
                {accountLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-500"
                    >
                      <span className="h-px w-4 bg-gray-600 transition-all group-hover:w-6 group-hover:bg-red-500" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Support */}
            <div>
              <h4 className="mb-5 font-oswald text-sm font-semibold uppercase tracking-widest text-white">
                Support
              </h4>
              <ul className="flex flex-col gap-3">
                {supportLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-500"
                    >
                      <span className="h-px w-4 bg-gray-600 transition-all group-hover:w-6 group-hover:bg-red-500" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-10 bg-white/10" />

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright + Legal */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center sm:justify-start">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} GameOne. All rights reserved.
              </p>
              <div className="flex gap-3">
                {legalLinks.map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="text-xs text-gray-500 transition-colors hover:text-red-500"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-2">
              <span className="mr-1 text-xs text-gray-500">We accept:</span>
              {paymentIcons.map((Icon, i) => (
                <Icon key={i} className="text-3xl text-gray-400 transition-colors hover:text-white" />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
