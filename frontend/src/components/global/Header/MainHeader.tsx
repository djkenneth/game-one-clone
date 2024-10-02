import { useState } from "react";
import { Link } from "react-router-dom";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import logo from '@/assets/gameone_logo.png'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import { IoMenu } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { LuHeart } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi";

export const MainHeader = () => {
    const [toggleSearch, setToggleSearch] = useState(false)

    return (
        <div className="px-4 py-3 bg-dark-90">
            <div className="flex justify-between items-center mx-auto lg:max-w-[90%]">
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
                                    <SheetDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                </div>
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
                <div className="hidden w-full bg-white max-w-lg items-center space-x-2 pl-2 rounded-xl md:flex">
                    <Input type="email" placeholder="Email" className="bg-white border-none h-14 focus-visible:ring-0" />
                    <Button type="submit" variant="solidred" className="h-14 rounded-r-lg rounded-l-none" >
                        <FaSearch className="text-lg" />
                    </Button>
                </div>
                <div className="flex items-center gap-6">
                    <FaSearch onClick={() => setToggleSearch(!toggleSearch)} className="block text-white text-2xl md:hidden" />
                    <LuHeart className="text-white text-2xl" strokeWidth={3} />
                    <Sheet>
                        <SheetTrigger asChild>
                            <div className="relative">
                                <span className="absolute -right-[2px] -top-[2px] font-medium text-white text-xs">1</span>
                                <HiOutlineShoppingBag className="text-white text-3xl" strokeWidth={2} />
                            </div>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full">
                            <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit">Save changes</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            {toggleSearch && (
                <div className="pt-5">
                    <Input className="bg-white" placeholder="Search" />
                </div>
            )}
        </div>
    )
}
