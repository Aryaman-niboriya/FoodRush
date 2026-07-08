'use client'

import { cn } from '@/lib/utils'
import { categories } from '@/lib/data'

interface CategoryChipsProps {
  selected: string
  onSelect: (id: string) => void
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const getCategoryIcon = (id: string) => {
    const icons: Record<string, string> = {
      michelin: '✦',
      italian: '🍝',
      japanese: '🍣',
      french: '🥐',
      bakery: '🥨',
      vegan: '🌿',
      burger: '🍔',
    }
    return icons[id] || ''
  }

  return (
    <div className="scrollbar-hide flex gap-2.5 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "chip whitespace-nowrap rounded-full px-5 py-2 text-[0.85rem] font-semibold transition-all",
            selected === cat.id 
              ? "bg-primary text-on-primary" 
              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
          )}
        >
          {getCategoryIcon(cat.id)} {cat.label}
        </button>
      ))}
    </div>
  )
}
