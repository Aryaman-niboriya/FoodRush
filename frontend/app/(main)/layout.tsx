'use client'

import { useState } from 'react'
import { CartProvider } from '@/lib/cart-context'
import { Navbar } from '@/components/navbar'
import { CartDrawer } from '@/components/cart-drawer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <CartProvider>
      <div className="min-h-screen pb-20 md:pb-0">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <main>{children}</main>
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </CartProvider>
  )
}
