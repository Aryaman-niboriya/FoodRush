'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { restaurants, menuItems } from '@/lib/data'

interface HeroProps {
  onSearch?: (query: string) => void
}

export function Hero({ onSearch }: HeroProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  
  const filteredResults = searchQuery.length > 1
    ? [
        ...restaurants.filter(r => 
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 4),
        ...menuItems.filter(m => 
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 3),
      ]
    : []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch?.(searchQuery)
      setShowResults(false)
      document.getElementById('restaurant-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToRestaurants = () => {
    document.getElementById('restaurant-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative h-[480px] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80" 
        alt="Gourmet food spread"
        className="h-full w-full scale-[1.06] object-cover brightness-[0.58]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/30 to-transparent" />
      
      <div className="absolute inset-0 flex max-w-[700px] flex-col justify-center px-6 md:px-10">
        <span className="fade-up mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-primary-container">
          {"Editor's Pick"}
        </span>
        <h1 className="fade-up fade-up-1 font-headline text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] text-white">
          The Art of<br/>
          <em className="text-primary-container">Fine Dining</em><br/>
          Delivered.
        </h1>
        <p className="fade-up fade-up-2 mb-6 mt-4 max-w-[420px] text-[0.95rem] leading-relaxed text-white/72">
          {"Discover curated menus from the city's most celebrated kitchens, crafted for the modern connoisseur."}
        </p>
        
        {/* Search Bar */}
        <div className="fade-up fade-up-3 relative w-full max-w-md" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center gap-2 rounded-2xl bg-white/95 p-1.5 pl-4 shadow-xl backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => setShowResults(true)}
                className="flex-1 bg-transparent py-2 text-sm text-on-surface outline-none placeholder:text-outline"
              />
              <button 
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary transition-transform hover:scale-105 active:scale-95"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
          
          {showResults && filteredResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white shadow-2xl">
              {filteredResults.map((item, idx) => {
                const isRestaurant = 'cuisine' in item
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isRestaurant) {
                        router.push(`/restaurant/${item.id}`)
                      } else {
                        router.push(`/restaurant/${(item as typeof menuItems[0]).restId}`)
                      }
                      setShowResults(false)
                      setSearchQuery('')
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-container-low"
                  >
                    <img 
                      src={item.img} 
                      alt={item.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{item.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {isRestaurant ? (item as typeof restaurants[0]).cuisine : `$${(item as typeof menuItems[0]).price}`}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        
        <div className="fade-up fade-up-4 mt-5 flex flex-wrap gap-3.5">
          <button 
            onClick={scrollToRestaurants}
            className="grad-btn rounded-xl border-none px-7 py-3.5 font-headline text-[0.95rem] font-extrabold text-on-primary transition-all"
          >
            Explore Menus
          </button>
          <button 
            onClick={() => toast.info("Loading today's offers...")}
            className="rounded-xl border border-white/25 bg-white/18 px-7 py-3.5 font-headline text-[0.95rem] font-extrabold text-white backdrop-blur-lg transition-all hover:bg-white/25"
          >
            View Offers
          </button>
        </div>
      </div>

      {/* Editorial watermark */}
      <div className="absolute bottom-7 right-8 text-right opacity-45 mix-blend-overlay">
        <p className="font-headline text-[2.5rem] font-black uppercase italic leading-none text-white">
          The<br/>Curator
        </p>
        <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white">
          Signature Dining Delivered
        </p>
      </div>
    </div>
  )
}
