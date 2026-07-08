'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Lock, CreditCard, Wallet, Banknote, MapPin } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AddressModal } from '@/components/checkout/address-modal'

type PaymentMethod = 'card' | 'wallet' | 'cash'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, couponApplied, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')

  const subtotal = getCartTotal()
  const deliveryFee = subtotal >= 30 ? 0 : 2.99
  const discount = couponApplied ? 10 : 0
  const total = subtotal + deliveryFee - discount

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    toast.success('Order placed successfully!')
    clearCart()
    router.push('/')
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-headline text-2xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-on-surface-variant">Add some items to proceed to checkout</p>
        <Link 
          href="/" 
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-on-primary"
        >
          Browse Restaurants
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link 
          href="/"
          className="mb-7 flex items-center gap-1.5 text-sm font-bold text-on-surface-variant"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back
        </Link>

        <h1 className="mb-7 font-headline text-3xl font-black">Checkout</h1>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {/* Delivery Address */}
            <div className="rounded-[1.25rem] bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-lg font-extrabold">Delivery Address</h3>
                <button 
                  onClick={() => setAddressModalOpen(true)}
                  className="text-xs font-bold text-primary"
                >
                  Change
                </button>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-surface p-3.5">
                <Home className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold">Home</p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">123 Main Street, Apt 4B, New York, NY 10001</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-[1.25rem] bg-card p-6">
              <h3 className="mb-4 font-headline text-lg font-extrabold">Payment Method</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'card' as const, label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'wallet' as const, label: 'Digital Wallet', icon: Wallet },
                  { id: 'cash' as const, label: 'Cash on Delivery', icon: Banknote },
                ].map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition-colors",
                      paymentMethod === id 
                        ? "border-primary bg-primary/5" 
                        : "border-surface-container-high"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="h-4.5 w-4.5 accent-primary"
                    />
                    <Icon className={cn("h-5 w-5", paymentMethod === id ? "text-primary" : "text-on-surface-variant")} />
                    <span className="text-sm font-bold">{label}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-4 flex flex-col gap-2.5">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Instructions */}
            <div className="rounded-[1.25rem] bg-card p-6">
              <h3 className="mb-3 font-headline text-lg font-extrabold">Delivery Instructions</h3>
              <textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="E.g. Leave at the door, Ring doorbell twice..."
                rows={3}
                className="w-full resize-none rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="sticky top-20 rounded-[1.25rem] bg-card p-6">
            <h3 className="mb-4 font-headline text-lg font-extrabold">Order Summary</h3>
            
            <div className="mb-4 flex flex-col gap-2.5 border-b border-border pb-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">{item.qty}x {item.name}</span>
                  <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mb-5 flex flex-col gap-2 text-sm">
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

            <button
              onClick={handlePlaceOrder}
              className="grad-btn flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline font-extrabold text-on-primary transition-all"
            >
              <Lock className="h-5 w-5" /> Place Order
            </button>
            <p className="mt-2.5 text-center text-xs text-outline-variant">
              By placing the order you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>

      <AddressModal 
        isOpen={addressModalOpen} 
        onClose={() => setAddressModalOpen(false)} 
      />
    </>
  )
}
