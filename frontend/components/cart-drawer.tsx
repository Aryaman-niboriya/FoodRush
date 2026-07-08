'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, getCartTotal, couponApplied, applyCoupon, removeCoupon } = useCart()
  const [couponInput, setCouponInput] = useState('')

  const subtotal = getCartTotal()
  const deliveryFee = subtotal >= 30 ? 0 : 2.99
  const discount = couponApplied ? 10 : 0
  const total = subtotal + deliveryFee - discount

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      toast.success('Coupon applied! $10 off your order')
      setCouponInput('')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/45 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed right-0 top-0 z-[60] flex h-screen w-full max-w-md flex-col bg-card shadow-xl transition-transform duration-350 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-headline text-lg font-extrabold text-on-surface">Your Order</h2>
            {cart.length > 0 && (
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {cart.length} item{cart.length > 1 ? 's' : ''} in cart
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-outline-variant">
              <ShoppingBag className="mb-3 h-12 w-12" />
              <p className="text-sm font-semibold">Your cart is empty</p>
              <p className="mt-1 text-xs">Add items to get started</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    className="h-13 w-13 flex-shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-on-surface">{item.name}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">${item.price} each</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-5 text-center text-sm font-bold">{item.qty}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-dim transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="min-w-11 text-right text-sm font-bold">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            {/* Summary */}
            <div className="mb-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery Fee</span>
                <span className={cn("font-semibold", deliveryFee === 0 && "text-secondary")}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {couponApplied && (
                <div className="flex justify-between font-bold text-secondary">
                  <span>Promo RUSH50</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2.5 text-base font-black">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter promo code (RUSH50)"
                className="flex-1 rounded-xl bg-surface-container-low px-3.5 py-2.5 text-sm outline-none placeholder:text-outline"
              />
              <button 
                onClick={handleApplyCoupon}
                className="rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            <Link 
              href="/checkout"
              onClick={onClose}
              className="grad-btn flex w-full items-center justify-center gap-2 rounded-2xl border-none px-4 py-4 font-headline text-base font-extrabold text-on-primary transition-all"
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
