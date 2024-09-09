import React from 'react'
import { Header } from '@/components/global/Header'
import { Footer } from '@/components/global/Footer'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default Layout