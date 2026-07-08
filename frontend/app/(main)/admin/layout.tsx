'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Store, BookOpen, Receipt, Settings, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/restaurants', label: 'Restaurants', icon: Store },
  { href: '/admin/menu', label: 'Menu Items', icon: BookOpen },
  { href: '/admin/orders', label: 'Orders', icon: Receipt },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="sticky top-16 hidden h-[calc(100vh-64px)] w-55 flex-shrink-0 flex-col overflow-y-auto border-r border-border bg-card p-3 md:flex">
        <div className="mb-6 px-1.5">
          <p className="font-headline text-base font-extrabold">Admin Panel</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">Curator Access</p>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <item.icon className={cn("h-4.5 w-4.5", isActive(item.href) ? "text-primary" : "")} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-border pt-6">
          <div className="flex items-center gap-2.5 px-1.5">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80" 
              alt="Admin"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold">Alex Rivera</p>
              <p className="text-[0.68rem] text-on-surface-variant">Lead Curator</p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-surface-container-low py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Site
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-surface p-7">
        {children}
      </div>
    </div>
  )
}
