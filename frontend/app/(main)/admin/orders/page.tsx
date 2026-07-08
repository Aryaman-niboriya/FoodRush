'use client'

import { orders } from '@/lib/data'
import { cn } from '@/lib/utils'

const allOrders = [
  ...orders,
  { id: '#ORD-2836', patron: 'Lisa Wong', patronImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=80', venue: 'Margherita Lab', amount: '$27.90', status: 'delivered' as const },
  { id: '#ORD-2835', patron: 'David Kim', patronImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=80', venue: 'Cantina Oro', amount: '$41.50', status: 'transit' as const },
]

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-headline text-2xl font-extrabold">All Orders</h2>
        <input
          type="text"
          placeholder="Search orders..."
          className="rounded-xl border border-surface-container-high bg-card px-4 py-2.5 text-sm outline-none focus:border-primary/50"
        />
      </div>

      <div className="overflow-hidden rounded-[1.25rem] bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Order ID</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Patron</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Venue</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Items</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Amount</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Time</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr key={order.id} className="border-b border-surface last:border-b-0 hover:bg-surface/50">
                  <td className="px-4 py-3.5 text-sm font-bold">{order.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <img src={order.patronImg} alt={order.patron} className="h-6.5 w-6.5 rounded-full object-cover" />
                      <span className="text-sm">{order.patron}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">{order.venue}</td>
                  <td className="px-4 py-3.5 text-xs text-on-surface-variant">2-3 items</td>
                  <td className="px-4 py-3.5 text-sm font-bold">{order.amount}</td>
                  <td className="px-4 py-3.5 text-xs text-on-surface-variant">{Math.floor(Math.random() * 55 + 5)}m ago</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
