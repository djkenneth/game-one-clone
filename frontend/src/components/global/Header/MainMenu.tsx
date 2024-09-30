import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom";

const menus = [
    {
        title: "Play Station",
        href: "/playstation",
        subMenu: [
            { title: 'Console', href: '/console' },
            { title: 'PS4 Games', href: '/ps4-games' },
            { title: 'PS5 Games', href: '/ps5-games' },
            { title: 'Accessories', href: '/accessories' },
            { title: 'Others', href: '/others' },
        ]
    },
    {
        title: "Xbox",
        href: "/xbox",
        subMenu: [
            { title: 'Console', href: '/console' },
            { title: 'Games', href: '/games' },
            { title: 'Accessories', href: '/accessories' },
            { title: 'Xbox Live Cards', href: '/box-live-cards' },
        ]
    },
    {
        title: "Nintendo",
        href: "/nintendo",
        subMenu: [
            { title: 'Console | Handheld', href: '/console-handheld' },
            { title: 'Games', href: '/games' },
            { title: 'Accessories', href: '/accessories' },
            { title: 'Eshop Wallet', href: '/eshop-wallet' },
            { title: 'Others', href: '/others' },
        ]
    },
    {
        title: "Handheld Devices",
        href: "/handhel-devices",
        subMenu: [
            { title: 'Handheld', href: '/handheld' },
            { title: 'Retro', href: '/retro' },
            { title: 'Smartphone', href: '/smartphone' },
            { title: 'Accessories', href: '/accessories' },
        ]
    },
    {
        title: "Laptop",
        href: "/laptop",
        subMenu: [
            { title: 'Gaming Laptop', href: '/gaming-laptop' },
            { title: 'Laptop', href: '/laptop' },
            { title: 'Accessories', href: '/accessories' },
        ]
    },
    {
        title: "PC Peripherals",
        href: "/pc-peripherals",
        subMenu: [
            { title: 'Audio', href: '/audio' },
            { title: 'Capture Card', href: '/capture-card' },
            { title: 'Controller', href: '/controller' },
            { title: 'Keyboard', href: '/keyboard' },
            { title: 'Mouse', href: '/mouse' },
            { title: 'Memory', href: '/memory' },
            { title: 'Productivity', href: '/productivity' },
            { title: 'Others', href: '/others' },
        ]
    },
    {
        title: "Computer Parts",
        href: "/computer-parts",
        subMenu: [
            { title: 'Cables', href: '/cables' },
            { title: 'Chasis', href: '/chasis' },
            { title: 'Fans and PC Cooling', href: '/fans-and-pc-cooling' },
            { title: 'Graphics Card', href: '/graphics-card' },
            { title: 'Monitor', href: '/monitor' },
            { title: 'Motherboard', href: '/motherboard' },
            { title: 'Ram', href: '/ram' },
            { title: 'Storage', href: '/storage' },
            { title: 'Power Supply and Buckup', href: '/power-supply-and-buckup' },
            { title: 'Pre-Build PC', href: '/pre-Build-pc' },
            { title: 'Processor', href: '/processor' },
            { title: 'Routers', href: '/routers' },
            { title: 'Software', href: '/software' },
            { title: 'Steam Wallet', href: '/steam-wallet' },
        ]
    },
]

export const MainMenu = () => {
    return (
        <div className="hidden px-4 py-3 bg-egg-white md:block">
            <div className="mx-auto lg:max-w-[90%]">
                <NavigationMenu>
                    <NavigationMenuList className="flex-wrap sm:gap-2 md:gap-5">
                        {menus.map((item) => (
                            <NavigationMenuItem key={item.title}>
                                <Link to={`/products${item.href}`}>
                                    <NavigationMenuTrigger className="text-gray-950 text-[0.8rem] tracking-wider uppercase font-bold hover:text-red-600">{item.title}</NavigationMenuTrigger>
                                </Link>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-4 grid-cols-4 md:w-[500px] lg:w-[80rem]">
                                        {item.subMenu.map((subMenuItem) => (
                                            <li key={subMenuItem.title} className="text-gray-950 text-[0.8rem] tracking-wider uppercase font-bold p-3 hover:text-red-600">
                                                <Link to={`/products${item.href}${subMenuItem.href}`}>{subMenuItem.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}
