'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, text: string) => void
}

export function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (!text.trim()) {
      toast.error('Please write your review')
      return
    }
    onSubmit(rating, text)
    setRating(0)
    setText('')
    onClose()
  }

  const handleClose = () => {
    setRating(0)
    setText('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        className={cn(
          "w-full max-w-md overflow-hidden rounded-3xl bg-card transition-transform",
          isOpen ? "scale-100" : "scale-95"
        )}
      >
        <div className="p-7">
          <div className="mb-1 flex items-start justify-between">
            <div>
              <h3 className="font-headline text-xl font-extrabold">Write a Review</h3>
              <p className="mt-1 text-sm text-on-surface-variant">Share your experience</p>
            </div>
            <button 
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Rating */}
          <div className="mb-5 mt-6">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Rating</p>
            <div className="flex gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={cn(
                    "transition-colors",
                    star <= rating ? "text-amber-500" : "text-surface-container-high"
                  )}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Your Review</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              className="w-full resize-none rounded-xl border border-surface-container-high bg-transparent p-3.5 text-sm outline-none transition-colors focus:border-primary/50"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl border border-surface-container-high bg-card py-3.5 font-bold transition-colors hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="grad-btn flex-1 rounded-xl py-3.5 font-bold text-on-primary transition-all"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
