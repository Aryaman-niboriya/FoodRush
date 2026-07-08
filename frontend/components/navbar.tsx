'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ShoppingBag, User, Settings, X, Home, Menu } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { restaurants, menuItems } from '@/lib/data'
import { cn } from '@/lib/utils'

interface NavbarProps {
  onCartOpen: () => void
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const pathname = usePathname()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredResults = searchQuery.length > 0
    ? [
        ...restaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
        ...menuItems.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
      ]
    : []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const trendingSearches = ['Biryani', 'Pizza', 'Sushi', 'Burger']

  return (
    <>
      <nav className="glass sticky top-0 z-30 border-b border-outline-variant/15">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-6">
          <Link 
            href="/" 
            className="flex-shrink-0 font-headline text-xl font-black italic text-primary tracking-tight"
          >
            FoodRush
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            <Link 
              href="/" 
              className={cn(
                "relative px-0.5 text-sm font-semibold transition-colors",
                pathname === '/' ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Offers
              {pathname === '/' && (
                <span className="absolute -bottom-5 left-0 right-0 h-0.5 rounded bg-primary" />
              )}
            </Link>
            <button className="text-sm font-semibold text-on-surface-variant hover:text-on-surface">
              Help
            </button>
            <Link 
              href="/auth" 
              className="text-sm font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Sign In
            </Link>
          </div>

          {/* Search */}
          <div className="relative hidden max-w-xs flex-1 md:block" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              className="w-full rounded-full border-none bg-surface-container-low py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-outline transition-shadow focus:ring-2 focus:ring-primary/30"
            />
            
            {showSearch && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl bg-card shadow-xl z-50">
                {filteredResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {filteredResults.map((item, idx) => (
                      <Link
                        key={idx}
                        href={'restId' in item ? `/restaurant/${item.restId}` : `/restaurant/${item.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors"
                        onClick={() => {
                          setShowSearch(false)
                          setSearchQuery('')
                        }}
                      >
                        <img 
                          src={'img' in item ? item.img : ''} 
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            {'cuisine' in item ? item.cuisine : `$${item.price}`}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}
                
                <div className="border-t border-border px-4 py-3">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-outline-variant">Trending</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <Link
              href="/admin"
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-surface-container-low transition-colors hover:bg-surface-container md:flex"
              title="Admin Panel"
            >
              <Settings className="h-4.5 w-4.5 text-on-surface-variant" />
            </Link>
            
            <button
              onClick={onCartOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low transition-colors hover:bg-surface-container"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  {cartCount}
                </span>
              )}
            </button>
            
            <Link
              href="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low transition-colors hover:bg-surface-container"
            >
              <User className="h-5 w-5 text-on-surface-variant" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card py-2 pb-3 md:hidden">
        <Link href="/" className={cn("flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold", pathname === '/' ? 'text-primary' : 'text-outline')}>
          <Home className="h-5.5 w-5.5" />
          Home
        </Link>
        <button onClick={() => setShowSearch(true)} className="flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold text-outline">
          <Search className="h-5.5 w-5.5" />
          Search
        </button>
        <button onClick={onCartOpen} className="flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold text-outline relative">
          <ShoppingBag className="h-5.5 w-5.5" />
          Cart
          {cartCount > 0 && (
            <span className="absolute top-0 right-1/4 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
              {cartCount}
            </span>
          )}
        </button>
        <Link href="/admin" className={cn("flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold", pathname.startsWith('/admin') ? 'text-primary' : 'text-outline')}>
          <Settings className="h-5.5 w-5.5" />
          Admin
        </Link>
        <Link href="/profile" className={cn("flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold", pathname === '/profile' ? 'text-primary' : 'text-outline')}>
          <User className="h-5.5 w-5.5" />
          Profile
        </Link>
      </div>
    </>
  )
}
