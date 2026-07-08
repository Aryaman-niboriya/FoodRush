'use client'

import { useState } from 'react'
import { X, Home, Briefcase, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
}

type AddressType = 'home' | 'work' | 'other'

export function AddressModal({ isOpen, onClose }: AddressModalProps) {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [addressType, setAddressType] = useState<AddressType>('home')

  const handleSave = () => {
    if (!address.trim()) {
      toast.error('Please enter your address')
      return
    }
    toast.success('Address saved successfully!')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className={cn(
          "w-full max-w-md overflow-hidden rounded-3xl bg-card transition-transform",
          isOpen ? "scale-100" : "scale-95"
        )}
      >
        <div className="p-7">
          <div className="mb-6">
            <h3 className="font-headline text-xl font-extrabold">Delivery Address</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Where should we deliver?</p>
          </div>

          <div className="flex flex-col gap-3.5">
            <input
              type="text"
              placeholder="Full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
              />
            </div>

            {/* Address Type */}
            <div className="flex gap-2">
              {[
                { id: 'home' as const, label: 'Home', icon: Home },
                { id: 'work' as const, label: 'Work', icon: Briefcase },
                { id: 'other' as const, label: 'Other', icon: MapPin },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setAddressType(id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-colors",
                    addressType === id 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-surface-container-high text-on-surface-variant"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="grad-btn mt-5 w-full rounded-xl py-3.5 font-bold text-on-primary transition-all"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  )
}
