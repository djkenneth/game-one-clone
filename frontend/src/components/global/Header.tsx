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
import { Button } from '@/components/ui/button'
import { IoMenu } from "react-icons/io5";
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/apis/auth';
import { useLogout } from '@/hooks/useAuth';

export const Header = () => {
    const { data: user } = useQuery({ queryKey: ['user'], queryFn: getUser, retry: 3 })
    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <header className="bg-white">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 2xl:max-w-[90%]">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <IoMenu className="h-6 w-6" />
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
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {!user && (
                        <>
                            <Button asChild variant="link">
                                <a href="/login" className="text-sm font-semibold leading-6">
                                    Log in
                                </a>
                            </Button>

                            <Button asChild variant="link">
                                <a href="/signup" className="text-sm font-semibold leading-6">
                                    Sign up
                                </a>
                            </Button>
                        </>
                    )}
                    {user && (
                        <Button onClick={handleLogout} className="text-sm font-semibold leading-6">
                            Logout
                        </Button>
                    )}

                </div>
            </nav>
        </header>
    )
}
