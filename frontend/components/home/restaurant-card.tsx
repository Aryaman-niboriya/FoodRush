'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Bike, Heart } from 'lucide-react'
import { toast } from 'sonner'
import type { Restaurant } from '@/lib/data'
import { cn } from '@/lib/utils'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [isFav, setIsFav] = useState(false)

  const handleFavToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFav(!isFav)
    toast.success(isFav ? 'Removed from favourites' : 'Added to favourites!')
  }

  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="group block overflow-hidden rounded-[1.25rem] bg-card transition-all duration-220 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img 
          src={restaurant.img} 
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
        />
        <span 
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wide text-white"
          style={{ backgroundColor: restaurant.tagColor }}
        >
          {restaurant.tag}
        </span>
        <button
          onClick={handleFavToggle}
          className="absolute right-2.5 top-2.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/90 text-base transition-transform hover:scale-110 active:scale-95"
        >
          <Heart className={cn("h-4 w-4", isFav ? "fill-red-500 text-red-500" : "text-gray-400")} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-headline text-base font-extrabold leading-tight text-on-surface">
            {restaurant.name}
          </h3>
          <span className="flex-shrink-0 rounded-md bg-surface-container-low px-2 py-0.5 text-xs font-extrabold text-on-surface">
            ★ {restaurant.rating}
          </span>
        </div>
        <p className="mb-3 text-xs text-on-surface-variant">{restaurant.cuisine}</p>
        <div className="flex items-center gap-3 text-xs font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {restaurant.time} MIN
          </span>
          <span className="flex items-center gap-1">
            <Bike className="h-3.5 w-3.5" />
            {restaurant.deliveryFee === 0 ? (
              <span className="font-extrabold text-secondary">FREE</span>
            ) : (
              `$${restaurant.deliveryFee.toFixed(2)}`
            )}
          </span>
          <span>{restaurant.cost}</span>
        </div>
      </div>
    </Link>
  )
}
