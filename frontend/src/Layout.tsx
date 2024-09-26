import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/global/Header'
import { Footer } from '@/components/global/Footer'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Toaster />
            <Footer />
        </>
    )
}

export default Layout