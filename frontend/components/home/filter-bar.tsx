'use client'

import { Star, Zap, Tag, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FilterType = 'rating' | 'fast' | 'free' | 'veg'
export type SortType = 'popular' | 'rating' | 'time' | 'cost'

interface FilterBarProps {
  activeFilters: Set<FilterType>
  onToggleFilter: (filter: FilterType) => void
  sortBy: SortType
  onSort: (sort: SortType) => void
}

export function FilterBar({ activeFilters, onToggleFilter, sortBy, onSort }: FilterBarProps) {
  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'rating', label: '4.5+ Rating', icon: <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> },
    { id: 'fast', label: 'Fast Delivery', icon: <Zap className="h-3.5 w-3.5" /> },
    { id: 'free', label: 'Free Delivery', icon: <Tag className="h-3.5 w-3.5" /> },
    { id: 'veg', label: 'Pure Veg', icon: <Leaf className="h-3.5 w-3.5" /> },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onToggleFilter(filter.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-bold transition-all",
              activeFilters.has(filter.id)
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant/30 bg-card text-on-surface hover:bg-surface-container-low"
            )}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-on-surface-variant">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSort(e.target.value as SortType)}
          className="cursor-pointer rounded-full border border-outline-variant/30 bg-card px-3 py-2 text-xs font-bold outline-none"
        >
          <option value="popular">Popular</option>
          <option value="rating">Rating</option>
          <option value="time">Delivery Time</option>
          <option value="cost">Cost</option>
        </select>
      </div>
    </div>
  )
}
