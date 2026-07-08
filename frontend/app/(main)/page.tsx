'use client'

import { useState, useEffect, useMemo } from 'react'
import { Hero } from '@/components/home/hero'
import { CategoryChips } from '@/components/home/category-chips'
import { FilterBar, type FilterType, type SortType } from '@/components/home/filter-bar'
import { FeaturedCollections } from '@/components/home/featured-collections'
import { RestaurantCard } from '@/components/home/restaurant-card'
import { PromoBanner } from '@/components/home/promo-banner'
import { Footer } from '@/components/footer'
import { restaurants } from '@/lib/data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

type BackendRestaurant = {
  id: number
  name: string
  description?: string
  cuisine_type: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  phone?: string
  image_url?: string
  banner_url?: string
  is_open: boolean
  is_active: boolean
  avg_rating: number
  total_reviews: number
  min_order: number
  delivery_fee: number
  delivery_time_min: number
}

type ApiRestaurantList = {
  total: number
  page: number
  size: number
  items: BackendRestaurant[]
}

const mapRestaurant = (restaurant: BackendRestaurant) => ({
  id: String(restaurant.id),
  name: restaurant.name,
  cuisine: `${restaurant.cuisine_type.replace(/_/g, ' ')} • ${restaurant.city}`,
  rating: restaurant.avg_rating,
  time: `${restaurant.delivery_time_min}-${restaurant.delivery_time_min + 10}`,
  deliveryFee: restaurant.delivery_fee,
  cost: restaurant.min_order > 0 ? `₹${Math.round(restaurant.min_order)}` : '$$',
  img: restaurant.image_url || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  tag: restaurant.is_open ? 'OPEN' : 'CLOSED',
  tagColor: restaurant.is_open ? '#16a34a' : '#374151',
  cat: restaurant.cuisine_type.toLowerCase(),
  veg: false,
  minOrder: restaurant.min_order,
})

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set())
  const [sortBy, setSortBy] = useState<SortType>('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [restaurantsData, setRestaurantsData] = useState(() => restaurants)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/restaurants?size=100`, {
          cache: 'no-store',
        })
        if (!res.ok) {
          throw new Error(`Failed to fetch restaurants: ${res.status}`)
        }

        const data = (await res.json()) as ApiRestaurantList
        if (!mounted) return

        setRestaurantsData(data.items.map(mapRestaurant))
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (error) {
        console.error('Unable to load restaurants from backend', error)
      }
    }

    fetchRestaurants()
    const interval = window.setInterval(fetchRestaurants, 10000)
    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [])

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurantsData]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(r => r.cat === selectedCategory)
    }

    // Active filters
    if (activeFilters.has('rating')) {
      result = result.filter(r => r.rating >= 4.5)
    }
    if (activeFilters.has('fast')) {
      result = result.filter(r => parseInt(r.time) <= 25)
    }
    if (activeFilters.has('free')) {
      result = result.filter(r => r.deliveryFee === 0)
    }
    if (activeFilters.has('veg')) {
      result = result.filter(r => r.veg)
    }

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'time') {
      result.sort((a, b) => parseInt(a.time) - parseInt(b.time))
    } else if (sortBy === 'cost') {
      result.sort((a, b) => a.cost.length - b.cost.length)
    }

    return result
  }, [selectedCategory, activeFilters, sortBy, searchQuery])

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(filter)) {
        next.delete(filter)
      } else {
        next.add(filter)
      }
      return next
    })
  }

  return (
    <>
      <Hero onSearch={setSearchQuery} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Category Chips */}
        <div className="mb-9">
          <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Filters */}
        <div className="mb-7">
          <FilterBar 
            activeFilters={activeFilters} 
            onToggleFilter={toggleFilter}
            sortBy={sortBy}
            onSort={setSortBy}
          />
        </div>

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Restaurant Listing */}
        <section id="restaurant-section" className="mb-12">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-headline text-2xl font-extrabold">
                {searchQuery ? `Results for "${searchQuery}"` : 'Top Kitchens Near You'}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Showing {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
              </p>
              {lastUpdated && (
                <p className="mt-1 text-xs text-secondary">
                  Live backend data · refreshed at {lastUpdated}
                </p>
              )}
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="rounded-full bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-on-surface-variant">No restaurants found</p>
              <p className="mt-1 text-sm text-outline">Try adjusting your filters</p>
            </div>
          )}
        </section>

        {/* Promo Banner */}
        <PromoBanner />

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
