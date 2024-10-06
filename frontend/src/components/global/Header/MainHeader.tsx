import logo from '@/assets/gameone_logo.png';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { IoMenu } from 'react-icons/io5';
import { LuHeart } from 'react-icons/lu';
import { Link } from 'react-router-dom';

export const MainHeader = () => {
  const [toggleSearch, setToggleSearch] = useState(false);

  return (
    <div className="bg-dark-90 px-4 py-3">
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IoMenu className="size-7 text-white" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full">
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4"></div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="logo" src={logo} className="h-10 w-auto md:h-20" />
            </Link>
          </div>
        </div>
        <div className="hidden w-full max-w-lg items-center space-x-2 rounded-xl bg-white pl-2 md:flex">
          <Input type="email" placeholder="Email" className="h-14 border-none bg-white focus-visible:ring-0" />
          <Button type="submit" variant="solidred" className="h-14 rounded-l-none rounded-r-lg">
            <FaSearch className="text-lg" />
          </Button>
        </div>
        <div className="flex items-center gap-6">
          <FaSearch onClick={() => setToggleSearch(!toggleSearch)} className="block text-2xl text-white md:hidden" />
          <LuHeart className="text-2xl text-white" strokeWidth={3} />
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative">
                <span className="absolute -right-[2px] -top-[2px] text-xs font-medium text-white">1</span>
                <HiOutlineShoppingBag className="text-3xl text-white" strokeWidth={2} />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-full">
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4"></div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
      {toggleSearch && (
        <div className="pt-5">
          <Input className="bg-white" placeholder="Search" />
        </div>
      )}
    </div>
  );
};
