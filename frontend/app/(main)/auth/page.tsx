'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AuthPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleSendOtp = () => {
    if (!phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    setOtpSent(true)
    toast.success('OTP sent to your phone!')
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {
    const otpValue = otp.join('')
    if (otpValue.length !== 4) {
      toast.error('Please enter the complete OTP')
      return
    }
    toast.success('Welcome to FoodRush!')
    router.push('/')
  }

  const handleResendOtp = () => {
    toast.success('OTP resent!')
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden">
      {/* Background */}
      <img 
        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80" 
        alt="Background"
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover brightness-[0.55] blur-sm"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/35 to-black/50" />

      {/* Form */}
      <div className="relative z-10 mx-4 w-full max-w-md">
        <div className="glass rounded-[2rem] border border-outline-variant/15 p-9 shadow-2xl">
          <div className="mb-7 text-center">
            <p className="mb-3.5 font-headline text-2xl font-black italic text-primary">FoodRush</p>
            <h1 className="font-headline text-2xl font-extrabold text-on-surface">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-on-surface-variant">Enter your details to taste the extraordinary.</p>
          </div>

          {/* Phone Input */}
          <div className="mb-5">
            <label className="mb-2 block text-[0.68rem] font-extrabold uppercase tracking-widest text-on-surface-variant">
              Phone Number
            </label>
            <div className="flex items-center gap-2.5 rounded-xl bg-card p-3">
              <Phone className="h-5 w-5 text-outline" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent text-base font-medium outline-none placeholder:text-outline"
              />
            </div>
          </div>

          {/* OTP Section */}
          {otpSent && (
            <div className="mb-6">
              <div className="mb-2.5 flex items-center justify-between">
                <label className="text-[0.68rem] font-extrabold uppercase tracking-widest text-on-surface-variant">
                  OTP Code
                </label>
                <button 
                  onClick={handleResendOtp}
                  className="text-[0.7rem] font-extrabold uppercase tracking-wide text-primary"
                >
                  Resend Code
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-15 rounded-2xl bg-card text-center text-xl font-bold outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={otpSent ? handleVerify : handleSendOtp}
            className="grad-btn flex w-full items-center justify-center gap-2 rounded-xl py-4 font-headline font-extrabold text-on-primary transition-all"
          >
            {otpSent ? 'Verify & Sign In' : 'Send OTP'}
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Terms */}
          <p className="mt-4 text-center text-xs leading-relaxed text-on-surface-variant">
            By continuing, you agree to our{' '}
            <span className="font-semibold text-on-surface">Terms of Service</span> and{' '}
            <span className="font-semibold text-on-surface">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
