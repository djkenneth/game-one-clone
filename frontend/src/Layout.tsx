import { Footer } from '@/components/global/Footer';
import { Header } from '@/components/global/Header';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';
import { DialogLoginForm } from './components/Form/LoginForm';

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <Header />
      {children}
      <Toaster />
      <Footer />
      <DialogLoginForm title="Login to Game One" />
    </>
  );
};

export default Layout;
