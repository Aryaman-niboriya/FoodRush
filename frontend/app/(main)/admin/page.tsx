'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, MoreVertical, CloudUpload } from 'lucide-react'
import { orders, chartData, restaurants } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const stats = [
  { label: 'Total Orders', value: '12,842', change: '+12%', positive: true },
  { label: 'Revenue', value: '$84.2k', change: '+8.4%', positive: true },
  { label: 'Total Users', value: '2,410', change: '+15%', positive: true },
  { label: 'Active Offers', value: '42', change: '8 expiring', positive: false },
]

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL']

export default function AdminAnalyticsPage() {
  const [chartRange, setChartRange] = useState<'1W' | '1M' | '1Y'>('1M')
  const maxValue = Math.max(...chartData)

  return (
    <div>
      {/* Stats Grid */}
      <div className="mb-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.25rem] bg-card p-5">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-widest text-on-surface-variant">
              {stat.label}
            </p>
            <p className="mt-2.5 font-headline text-3xl font-black">{stat.value}</p>
            <p className={cn(
              "mt-1.5 text-xs font-bold",
              stat.positive ? "text-secondary" : "text-destructive"
            )}>
              {stat.positive ? <TrendingUp className="mr-1 inline h-3.5 w-3.5" /> : null}
              {stat.change} {stat.positive && 'vs last month'}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid items-start gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Revenue Chart */}
        <div className="rounded-[1.25rem] bg-card p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="font-headline text-lg font-extrabold">Revenue Performance</h3>
              <p className="mt-0.5 text-xs text-on-surface-variant">Monthly fiscal breakdown</p>
            </div>
            <div className="flex gap-1.5">
              {(['1W', '1M', '1Y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setChartRange(range)
                    toast.info(`Showing ${range} data`)
                  }}
                  className={cn(
                    "rounded-full px-2.5 py-1.5 text-xs font-bold transition-colors",
                    chartRange === range
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex h-45 items-end gap-2 px-1">
            {chartData.map((value, idx) => (
              <div key={idx} className="relative flex flex-1 flex-col items-center gap-1">
                {idx === 4 && (
                  <span className="absolute -top-6 whitespace-nowrap rounded-md bg-on-surface px-1.5 py-0.5 text-[0.65rem] font-bold text-card">
                    ${value}.4k
                  </span>
                )}
                <div 
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-container transition-all duration-600 hover:brightness-110"
                  style={{ height: `${(value / maxValue) * 160}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between px-1">
            {months.map((month) => (
              <span key={month} className="text-[0.7rem] text-outline-variant">{month}</span>
            ))}
          </div>
        </div>

        {/* New Restaurant Form */}
        <div className="rounded-[1.25rem] bg-card p-6">
          <h3 className="mb-4 font-headline text-lg font-extrabold">New Restaurant</h3>
          <div 
            onClick={() => toast.info('Upload feature coming soon!')}
            className="mb-3.5 flex h-25 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-container-high text-outline-variant"
          >
            <CloudUpload className="mb-1 h-7 w-7" />
            <p className="text-xs font-bold">DRAG & DROP PHOTOGRAPHY</p>
          </div>
          <input
            type="text"
            placeholder="Venue Name (e.g. The Truffle Hound)"
            className="mb-3 w-full rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
          />
          <div className="mb-3.5 flex items-center justify-between rounded-xl bg-surface p-3.5">
            <div>
              <p className="text-sm font-bold">Instant Activation</p>
              <p className="text-[0.68rem] uppercase tracking-wide text-on-surface-variant">LIVE ON THE GRID IMMEDIATELY</p>
            </div>
            <div className="relative h-6 w-11 cursor-pointer rounded-full bg-secondary">
              <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
            </div>
          </div>
          <button 
            onClick={() => toast.success('Restaurant created successfully!')}
            className="grad-btn w-full rounded-xl py-3.5 text-sm font-extrabold uppercase tracking-wide text-on-primary transition-all"
          >
            CREATE LISTING
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="overflow-hidden rounded-[1.25rem] bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4.5">
          <h3 className="font-headline text-lg font-extrabold">Recent Transactions</h3>
          <Link href="/admin/orders" className="text-xs font-extrabold uppercase tracking-widest text-primary">
            VIEW ALL RECORDS
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Order ID</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Patron</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Venue</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Amount</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-surface last:border-b-0 hover:bg-surface/50">
                  <td className="px-4 py-3.5 text-sm font-bold">{order.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <img src={order.patronImg} alt={order.patron} className="h-7 w-7 rounded-full object-cover" />
                      <span className="text-sm">{order.patron}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">{order.venue}</td>
                  <td className="px-4 py-3.5 text-sm font-bold">{order.amount}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase",
                      order.status === 'delivered' && "bg-green-100 text-secondary",
                      order.status === 'transit' && "bg-yellow-100 text-yellow-700",
                      order.status === 'cancelled' && "bg-red-100 text-destructive",
                      order.status === 'pending' && "bg-gray-100 text-on-surface-variant"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button 
                      onClick={() => toast.info(`Opening order ${order.id}...`)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
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
