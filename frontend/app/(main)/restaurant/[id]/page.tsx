'use client'

import { useState, useMemo, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, Bike, Plus, Minus } from 'lucide-react'
import { restaurants, menuItems, reviews as initialReviews, type Review } from '@/lib/data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ReviewModal } from '@/components/restaurant/review-modal'

type TabType = 'menu' | 'reviews' | 'photos'

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const restaurant = restaurants.find(r => r.id === id) || restaurants[0]
  const items = menuItems.filter(m => m.restId === id)
  const categories = [...new Set(items.map(i => i.cat))]
  
  const [activeTab, setActiveTab] = useState<TabType>('menu')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [vegOnly, setVegOnly] = useState(false)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  
  const { cart, addToCart, updateQuantity } = useCart()

  const filteredItems = useMemo(() => {
    let result = items
    if (selectedCategory !== 'all') {
      result = result.filter(i => i.cat === selectedCategory)
    }
    if (vegOnly) {
      result = result.filter(i => i.type === 'veg')
    }
    return result
  }, [items, selectedCategory, vegOnly])

  const featuredItem = filteredItems.find(i => i.cat === 'Mains') || filteredItems[0]
  const groupedItems = useMemo(() => {
    const nonFeatured = filteredItems.filter(i => !featuredItem || i.id !== featuredItem.id)
    const grouped: Record<string, typeof items> = {}
    nonFeatured.forEach(item => {
      if (!grouped[item.cat]) grouped[item.cat] = []
      grouped[item.cat].push(item)
    })
    return grouped
  }, [filteredItems, featuredItem])

  const getItemQuantity = (itemId: number) => cart.find(c => c.id === itemId)?.qty || 0

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart(item)
    toast.success(`${item.name} added to cart`)
  }

  const handleAddReview = (rating: number, text: string) => {
    const newReview: Review = {
      id: String(Date.now()),
      name: 'You',
      rating,
      date: 'Just now',
      text,
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&q=80'
    }
    setReviews([newReview, ...reviews])
    toast.success('Review submitted! Thank you')
  }

  const photoUrls = [
    'photo-1504674900247', 'photo-1565299624946', 'photo-1553621042-f6e147245754', 
    'photo-1568901346375', 'photo-1540420773420', 'photo-1512621776951', 
    'photo-1574071318508', 'photo-1573080496219'
  ]

  return (
    <>
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={restaurant.img} 
          alt={restaurant.name}
          className="h-full w-full object-cover brightness-[0.62]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 to-transparent" />
        <Link 
          href="/"
          className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-black/35 px-3.5 py-2 text-sm font-bold text-white backdrop-blur-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="absolute bottom-6 left-7">
          <span 
            className="mb-2.5 inline-block rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase text-white"
            style={{ backgroundColor: restaurant.tagColor }}
          >
            {restaurant.tag}
          </span>
          <h1 className="font-headline text-3xl font-black leading-tight text-white">{restaurant.name}</h1>
          <p className="mt-1 text-sm text-white/75">{restaurant.cuisine}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Info Bar */}
        <div className="relative z-10 -mt-6 mb-0 flex flex-wrap items-center gap-6 rounded-[1.25rem] bg-card p-5 shadow-lg">
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="font-extrabold text-on-surface">{restaurant.rating}</span> rating
          </div>
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
            <Clock className="h-4 w-4" /> {restaurant.time} min
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Bike className="h-4 w-4 text-on-surface-variant" />
            <span className={cn("font-bold", restaurant.deliveryFee === 0 ? "text-secondary" : "text-on-surface-variant")}>
              {restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="text-sm text-on-surface-variant">
            Min. order <strong>${restaurant.minOrder}</strong>
          </div>
          <button 
            onClick={() => setReviewModalOpen(true)}
            className="ml-auto rounded-full border-2 border-primary bg-transparent px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
          >
            Write Review
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-7 flex gap-0 border-b border-border pt-1">
          {(['menu', 'reviews', 'photos'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4.5 py-4 text-sm font-bold capitalize transition-colors border-b-2",
                activeTab === tab 
                  ? "text-primary border-primary" 
                  : "text-on-surface-variant border-transparent hover:text-on-surface"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Menu Items */}
            <div>
              {/* Category Filter */}
              <div className="mb-6 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "chip rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                    selectedCategory === 'all' 
                      ? "bg-primary text-on-primary" 
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  )}
                >
                  All Dishes
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "chip rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                      selectedCategory === cat 
                        ? "bg-primary text-on-primary" 
                        : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                    )}
                  >
                    {cat}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface-variant">Veg Only</span>
                  <button
                    onClick={() => setVegOnly(!vegOnly)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      vegOnly ? "bg-secondary" : "bg-surface-container-high"
                    )}
                  >
                    <span 
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                        vegOnly ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Featured Item */}
              {featuredItem && (
                <div className="mb-6 flex flex-wrap gap-5 rounded-[1.25rem] bg-surface-container-low p-5">
                  <div className="relative flex-shrink-0">
                    <span className="absolute -top-2 left-2 z-10 rounded-full bg-primary px-2 py-0.5 text-[0.6rem] font-extrabold uppercase text-white">
                      {"CHEF'S CHOICE"}
                    </span>
                    <img 
                      src={featuredItem.img} 
                      alt={featuredItem.name}
                      className="h-38 w-40 rounded-2xl object-cover"
                    />
                  </div>
                  <div className="min-w-45 flex-1">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className={cn(
                        "flex h-3 w-3 items-center justify-center rounded-full border-2",
                        featuredItem.type === 'veg' ? "border-secondary" : "border-destructive"
                      )}>
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          featuredItem.type === 'veg' ? "bg-secondary" : "bg-destructive"
                        )} />
                      </span>
                      <h3 className="font-headline text-xl font-black">
                        {featuredItem.name} <span className="text-primary">${featuredItem.price}</span>
                      </h3>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">{featuredItem.desc}</p>
                    <button 
                      onClick={() => handleAddToCart(featuredItem)}
                      className="grad-btn rounded-xl px-6 py-3 text-sm font-bold text-on-primary transition-all"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Items List */}
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="mb-2">
                  <p className="border-t border-border py-3 text-[0.68rem] font-extrabold uppercase tracking-widest text-outline-variant">
                    {category}
                  </p>
                  {categoryItems.map(item => {
                    const qty = getItemQuantity(item.id)
                    return (
                      <div key={item.id} className="flex items-center gap-4 border-b border-surface py-4">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-1.5">
                            <span className={cn(
                              "flex h-2.5 w-2.5 items-center justify-center rounded-full border-2",
                              item.type === 'veg' ? "border-secondary" : "border-destructive"
                            )}>
                              <span className={cn(
                                "h-1 w-1 rounded-full",
                                item.type === 'veg' ? "bg-secondary" : "bg-destructive"
                              )} />
                            </span>
                            <p className="text-sm font-bold text-on-surface">{item.name}</p>
                          </div>
                          <p className="mb-2 text-xs leading-relaxed text-on-surface-variant">{item.desc}</p>
                          <p className="text-base font-extrabold text-on-surface">${item.price}</p>
                        </div>
                        <div className="flex flex-shrink-0 flex-col items-center gap-2">
                          <img 
                            src={item.img} 
                            alt={item.name}
                            className="h-18 w-20 rounded-xl object-cover"
                          />
                          {qty > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-5 text-center text-sm font-extrabold">{qty}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-dim"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="flex items-center gap-1 rounded-full border-2 border-primary bg-white px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Inline Cart */}
            <div className="sticky top-20 hidden h-fit overflow-hidden rounded-[1.25rem] border border-outline-variant/15 bg-card lg:block">
              <div className="flex items-center justify-between border-b border-border px-5 py-4.5">
                <h3 className="font-headline font-extrabold">Your Order</h3>
                {cart.length > 0 && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[0.7rem] font-extrabold text-on-primary">
                    {cart.reduce((s, c) => s + c.qty, 0)} items
                  </span>
                )}
              </div>
              <div className="min-h-20 px-4 py-4">
                {cart.length === 0 ? (
                  <p className="py-6 text-center text-sm text-outline-variant">Add items to your order</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {cart.slice(0, 4).map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-on-surface">{item.qty}x {item.name}</span>
                        <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    {cart.length > 4 && (
                      <p className="text-xs text-on-surface-variant">+ {cart.length - 4} more items</p>
                    )}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-border px-4 py-4">
                  <div className="mb-3.5 flex justify-between text-sm font-bold">
                    <span>Subtotal</span>
                    <span>${cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2)}</span>
                  </div>
                  <Link 
                    href="/checkout"
                    className="grad-btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-extrabold text-on-primary transition-all"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-headline text-xl font-extrabold">Guest Reviews</h3>
              <button 
                onClick={() => setReviewModalOpen(true)}
                className="grad-btn rounded-full px-5 py-2.5 text-sm font-bold text-on-primary transition-all"
              >
                Write a Review
              </button>
            </div>
            <div className="flex flex-col">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-surface py-5">
                  <div className="mb-2.5 flex items-center gap-3">
                    <img 
                      src={review.img} 
                      alt={review.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold">{review.name}</p>
                      <p className="text-xs text-on-surface-variant">{review.date}</p>
                    </div>
                    <div className="ml-auto rounded-lg bg-surface px-2.5 py-1 text-xs font-extrabold">
                      ★ {review.rating}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div>
            <h3 className="mb-5 font-headline text-xl font-extrabold">Photos</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {photoUrls.map((photo, idx) => (
                <div key={idx} className="aspect-square cursor-pointer overflow-hidden rounded-xl">
                  <img 
                    src={`https://images.unsplash.com/${photo}?w=300&q=80`}
                    alt="Food"
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-15" />
      </div>

      <ReviewModal 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleAddReview}
      />
    </>
  )
}
