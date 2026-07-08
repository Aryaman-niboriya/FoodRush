'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Bell, CreditCard, Tag, HelpCircle, LogOut, ChevronRight, Home, Briefcase, Plus, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AddressModal } from '@/components/checkout/address-modal'

const menuItems = [
  { icon: User, label: 'Edit Profile', action: () => toast.info('Opening profile editor...') },
  { icon: Bell, label: 'Notifications', action: () => toast.info('Notification settings...') },
  { icon: CreditCard, label: 'Payment Methods', action: () => toast.info('Payment methods...') },
  { icon: Tag, label: 'My Offers', action: () => toast.info('Loading your offers...') },
  { icon: HelpCircle, label: 'Help & Support', action: () => toast.info('Opening help center...') },
]

const addresses = [
  { type: 'home', icon: Home, label: 'Home', address: '123 Main Street, Apt 4B, New York, NY 10001' },
  { type: 'work', icon: Briefcase, label: 'Work', address: '456 Corporate Ave, Floor 12, New York, NY 10002' },
]

const orderHistory = [
  { rest: 'Omonoia Sushi Bar', date: 'Mar 28, 2024', items: 'Truffle Wagyu, Charred Octopus', total: '$70.00', status: 'delivered' as const },
  { rest: 'Prime Cut Burgers', date: 'Mar 20, 2024', items: 'Double Truffle Burger x2', total: '$48.00', status: 'delivered' as const },
  { rest: 'Verde & Vine', date: 'Mar 14, 2024', items: 'Avocado Buddha Bowl', total: '$16.00', status: 'cancelled' as const },
]

export default function ProfilePage() {
  const [addressModalOpen, setAddressModalOpen] = useState(false)

  const getStatusStyle = (status: 'delivered' | 'cancelled' | 'transit' | 'pending') => {
    const styles = {
      delivered: 'bg-green-100 text-secondary',
      transit: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-destructive',
      pending: 'bg-gray-100 text-on-surface-variant',
    }
    return styles[status]
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Profile Header */}
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-surface-container">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" 
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-headline text-2xl font-extrabold">Alex Johnson</h1>
            <p className="text-sm text-on-surface-variant">alex.johnson@email.com</p>
            <p className="text-sm text-on-surface-variant">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Menu */}
          <div className="overflow-hidden rounded-[1.25rem] bg-card">
            {menuItems.map((item, idx) => (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-surface",
                  idx < menuItems.length - 1 && "border-b border-surface"
                )}
              >
                <item.icon className="h-5 w-5 text-on-surface-variant" />
                <span className="flex-1 text-sm font-semibold">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-outline-variant" />
              </button>
            ))}
            <Link
              href="/auth"
              className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-surface"
            >
              <LogOut className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-semibold text-primary">Sign Out</span>
              <ChevronRight className="h-4 w-4 text-outline-variant" />
            </Link>
          </div>

          {/* Addresses */}
          <div className="overflow-hidden rounded-[1.25rem] bg-card">
            <div className="border-b border-border px-5 py-4.5">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-widest text-outline-variant">
                Saved Addresses
              </p>
            </div>
            {addresses.map((addr) => (
              <div key={addr.type} className="flex items-start gap-3 border-b border-surface px-5 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <addr.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{addr.label}</p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">{addr.address}</p>
                </div>
              </div>
            ))}
            <div className="px-5 py-4">
              <button 
                onClick={() => setAddressModalOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-primary"
              >
                <Plus className="h-4.5 w-4.5" /> Add New Address
              </button>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="mt-5 overflow-hidden rounded-[1.25rem] bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4.5">
            <p className="text-[0.7rem] font-extrabold uppercase tracking-widest text-outline-variant">
              Order History
            </p>
            <button 
              onClick={() => toast.info('Loading all orders...')}
              className="text-xs font-bold text-primary"
            >
              View All
            </button>
          </div>
          {orderHistory.map((order, idx) => (
            <div 
              key={idx} 
              className="flex flex-wrap items-center gap-3.5 border-b border-surface px-5 py-4 last:border-b-0"
            >
              <div className="min-w-50 flex-1">
                <p className="text-sm font-bold">{order.rest}</p>
                <p className="mt-0.5 text-xs text-on-surface-variant">{order.items}</p>
                <p className="mt-0.5 text-xs text-outline-variant">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold">{order.total}</p>
                <span className={cn(
                  "mt-1 inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold uppercase",
                  getStatusStyle(order.status)
                )}>
                  {order.status}
                </span>
              </div>
              <button 
                onClick={() => toast.info(`Reordering from ${order.rest}...`)}
                className="whitespace-nowrap rounded-full border border-surface-container-high bg-card px-3.5 py-2 text-xs font-bold hover:bg-surface"
              >
                Reorder
              </button>
            </div>
          ))}
        </div>
      </div>

      <AddressModal isOpen={addressModalOpen} onClose={() => setAddressModalOpen(false)} />
    </>
  )
}
