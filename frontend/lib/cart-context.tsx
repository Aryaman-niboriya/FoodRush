'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CartItem, MenuItem } from './data'

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: number) => void
  updateQuantity: (itemId: number, delta: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  couponApplied: boolean
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [couponApplied, setCouponApplied] = useState(false)

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((itemId: number) => {
    setCart(prev => prev.filter(c => c.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: number, delta: number) => {
    setCart(prev => {
      const item = prev.find(c => c.id === itemId)
      if (!item) return prev
      
      const newQty = item.qty + delta
      if (newQty <= 0) {
        return prev.filter(c => c.id !== itemId)
      }
      return prev.map(c => c.id === itemId ? { ...c, qty: newQty } : c)
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    setCouponApplied(false)
  }, [])

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  }, [cart])

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0)
  }, [cart])

  const applyCoupon = useCallback((code: string) => {
    if (code.toUpperCase() === 'RUSH50') {
      setCouponApplied(true)
      return true
    }
    return false
  }, [])

  const removeCoupon = useCallback(() => {
    setCouponApplied(false)
  }, [])

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      couponApplied,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
