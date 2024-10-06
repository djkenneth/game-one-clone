import { Footer } from '@/components/global/Footer';
import { Header } from '@/components/global/Header';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Toaster />
      <Footer />
    </>
  );
};

export default Layout;
