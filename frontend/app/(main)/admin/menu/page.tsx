'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { menuItems as initialMenuItems, restaurants, type MenuItem } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [modalOpen, setModalOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    restId: '',
    cat: 'Mains',
    type: 'veg' as 'veg' | 'nonveg',
    desc: '',
  })

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.restId) {
      toast.error('Please fill all required fields')
      return
    }

    const item: MenuItem = {
      id: menuItems.length + 1,
      name: newItem.name,
      desc: newItem.desc || 'Freshly prepared dish',
      price: parseFloat(newItem.price),
      restId: newItem.restId,
      cat: newItem.cat,
      type: newItem.type,
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80',
    }

    setMenuItems([...menuItems, item])
    setModalOpen(false)
    setNewItem({ name: '', price: '', restId: '', cat: 'Mains', type: 'veg', desc: '' })
    toast.success(`"${newItem.name}" added to menu!`)
  }

  const handleDeleteItem = (id: number) => {
    const item = menuItems.find(m => m.id === id)
    setMenuItems(menuItems.filter(m => m.id !== id))
    toast.success(`"${item?.name}" removed from menu`)
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-headline text-2xl font-extrabold">Menu Items</h2>
        <button 
          onClick={() => setModalOpen(true)}
          className="grad-btn flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-on-primary transition-all"
        >
          <Plus className="h-4.5 w-4.5" /> Add Item
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Item</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Restaurant</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Price</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Type</th>
                <th className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => {
                const rest = restaurants.find(r => r.id === item.restId)
                return (
                  <tr key={item.id} className="border-b border-surface last:border-b-0 hover:bg-surface/50">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={item.img} alt={item.name} className="h-9 w-9 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="max-w-40 truncate text-xs text-on-surface-variant">{item.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm">{rest?.name || item.restId}</td>
                    <td className="px-4 py-3.5 text-sm">{item.cat}</td>
                    <td className="px-4 py-3.5 text-sm font-bold">${item.price}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "flex h-2.5 w-2.5 items-center justify-center rounded-full border-2",
                          item.type === 'veg' ? "border-secondary" : "border-destructive"
                        )}>
                          <span className={cn(
                            "h-1 w-1 rounded-full",
                            item.type === 'veg' ? "bg-secondary" : "bg-destructive"
                          )} />
                        </span>
                        <span className="text-xs">{item.type === 'veg' ? 'Veg' : 'Non-Veg'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => toast.info('Editing item...')}
                          className="rounded-lg border border-surface-container-high bg-card px-2.5 py-1.5 text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-primary"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="w-full max-w-md rounded-3xl bg-card p-7">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-headline text-xl font-extrabold">Add Menu Item</h3>
              <button onClick={() => setModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-3.5">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
              />
              <select
                value={newItem.restId}
                onChange={(e) => setNewItem({ ...newItem, restId: e.target.value })}
                className="w-full rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
              >
                <option value="">Select Restaurant</option>
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={newItem.cat}
                  onChange={(e) => setNewItem({ ...newItem, cat: e.target.value })}
                  className="rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
                >
                  <option value="Starters">Starters</option>
                  <option value="Mains">Mains</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Sides">Sides</option>
                </select>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'veg' | 'nonveg' })}
                  className="rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
                >
                  <option value="veg">Veg</option>
                  <option value="nonveg">Non-Veg</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={newItem.desc}
                onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-xl border border-surface-container-high bg-transparent p-3 text-sm outline-none focus:border-primary/50"
              />
            </div>

            <button
              onClick={handleAddItem}
              className="grad-btn mt-5 w-full rounded-xl py-3.5 font-bold text-on-primary transition-all"
            >
              Add Item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
