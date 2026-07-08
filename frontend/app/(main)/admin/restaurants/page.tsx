'use client'

import { Plus } from 'lucide-react'
import { restaurants } from '@/lib/data'
import { toast } from 'sonner'

// Static order counts to avoid hydration mismatch
const orderCounts: Record<string, number> = {
  'omakase': 432,
  'truffle': 287,
  'verde': 156,
  'napoli': 523,
  'sakura': 345,
  'prime': 612,
  'levain': 189,
  'cantina': 98,
}

export default function AdminRestaurantsPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-headline text-2xl font-extrabold">Manage Restaurants</h2>
        <button 
          onClick={() => toast.info('Opening restaurant editor...')}
          className="grad-btn flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-on-primary transition-all"
        >
          <Plus className="h-4.5 w-4.5" /> New Listing
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Restaurant</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Cuisine</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Rating</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Orders</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((rest) => (
                <tr key={rest.id} className="border-b border-surface last:border-b-0 hover:bg-surface/50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img src={rest.img} alt={rest.name} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="text-sm font-bold">{rest.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-on-surface-variant">{rest.cuisine.split('•')[0].trim()}</td>
                  <td className="px-4 py-3.5 text-sm font-bold">★ {rest.rating}</td>
                  <td className="px-4 py-3.5 text-sm">{orderCounts[rest.id] || 0}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[0.7rem] font-bold uppercase text-secondary">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => toast.info(`Editing ${rest.name}...`)}
                        className="rounded-lg border border-surface-container-high bg-card px-2.5 py-1.5 text-xs font-bold"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toast.info(`${rest.name} paused`)}
                        className="rounded-lg bg-surface-container-low px-2.5 py-1.5 text-xs font-bold text-on-surface-variant"
                      >
                        Pause
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
