'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export function FeaturedCollections() {
  return (
    <section className="mb-13">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-headline text-2xl font-extrabold">Featured Collections</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Hand-picked selections for every mood</p>
        </div>
        <button 
          onClick={() => toast.info('Viewing all collections...')}
          className="flex items-center gap-1 text-sm font-bold text-primary"
        >
          View all <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-3">
        {/* Large Card */}
        <Link 
          href="/restaurant/omakase"
          className="group relative col-span-1 overflow-hidden rounded-[1.25rem] md:col-span-2"
        >
          <img 
            src="https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=80" 
            alt="Omakase Experience"
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/15 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.65rem] font-extrabold uppercase text-on-secondary">
              TOP RATED
            </span>
            <span className="rounded-full bg-primary px-2.5 py-1 text-[0.65rem] font-extrabold uppercase text-on-primary">
              LIMITED TIME
            </span>
          </div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="font-headline text-2xl font-black text-white">The Omakase Experience</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Authentic Edomae-style sushi in temperature-controlled sustainable packaging.
            </p>
          </div>
        </Link>

        {/* Small Card */}
        <Link 
          href="/restaurant/levain"
          className="group relative overflow-hidden rounded-[1.25rem]"
        >
          <img 
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80" 
            alt="Midnight Indulgence"
            className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <h3 className="font-headline text-xl font-extrabold text-white">Midnight Indulgence</h3>
            <p className="mt-1 text-xs text-white/72">
              {"Artisan patisserie from the city's finest pastry chefs."}
            </p>
          </div>
        </Link>
      </div>
    </section>
  )
}
