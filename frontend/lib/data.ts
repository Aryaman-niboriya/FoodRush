// Types
export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  time: string
  deliveryFee: number
  cost: string
  img: string
  tag: string
  tagColor: string
  cat: string
  veg: boolean
  minOrder: number
}

export interface MenuItem {
  id: number
  name: string
  desc: string
  price: number
  restId: string
  cat: string
  type: 'veg' | 'nonveg'
  img: string
}

export interface CartItem extends MenuItem {
  qty: number
}

export interface Review {
  id: string
  name: string
  rating: number
  date: string
  text: string
  img: string
}

export interface Order {
  id: string
  patron: string
  patronImg: string
  venue: string
  amount: string
  status: 'delivered' | 'transit' | 'cancelled' | 'pending'
}

// Static Data
export const restaurants: Restaurant[] = [
  { id: 'omakase', name: 'Omonoia Sushi Bar', cuisine: 'Japanese Omakase • Premium', rating: 4.9, time: '35-45', deliveryFee: 0, cost: '$$$$', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', tag: 'MICHELIN', tagColor: '#006a2d', cat: 'michelin', veg: false, minOrder: 50 },
  { id: 'truffle', name: 'The Truffle Hound', cuisine: 'French • Fine Dining', rating: 4.8, time: '40-50', deliveryFee: 0, cost: '$$$$', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', tag: 'FEATURED', tagColor: '#b61323', cat: 'french', veg: false, minOrder: 60 },
  { id: 'verde', name: 'Verde & Vine', cuisine: 'Plant-Based • Organic', rating: 4.7, time: '25-35', deliveryFee: 2.99, cost: '$$', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', tag: 'VEGAN', tagColor: '#006a2d', cat: 'vegan', veg: true, minOrder: 20 },
  { id: 'napoli', name: 'Napoli DOC', cuisine: 'Italian • Neapolitan Pizza', rating: 4.6, time: '20-30', deliveryFee: 1.99, cost: '$$', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', tag: 'POPULAR', tagColor: '#b61323', cat: 'italian', veg: false, minOrder: 15 },
  { id: 'sakura', name: 'Sakura Garden', cuisine: 'Japanese • Ramen • Sushi', rating: 4.5, time: '30-40', deliveryFee: 0, cost: '$$$', img: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&q=80', tag: 'TOP RATED', tagColor: '#0057bd', cat: 'japanese', veg: false, minOrder: 25 },
  { id: 'prime', name: 'Prime Cut Burgers', cuisine: 'American • Gourmet Burgers', rating: 4.4, time: '15-25', deliveryFee: 0, cost: '$$', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', tag: 'FAST', tagColor: '#f59e0b', cat: 'burger', veg: false, minOrder: 12 },
  { id: 'levain', name: 'Le Pain Levain', cuisine: 'French Bakery • Pastries', rating: 4.8, time: '20-30', deliveryFee: 2.49, cost: '$$', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', tag: 'ARTISAN', tagColor: '#856404', cat: 'bakery', veg: true, minOrder: 15 },
  { id: 'cantina', name: 'Cantina Oro', cuisine: 'Mexican • Modern Tacos', rating: 4.3, time: '25-35', deliveryFee: 1.99, cost: '$$', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80', tag: 'NEW', tagColor: '#b61323', cat: 'all', veg: false, minOrder: 18 },
]

export const menuItems: MenuItem[] = [
  // Omakase
  { id: 1, name: 'Truffle Wagyu Nigiri', desc: 'A5 Japanese Wagyu with black truffle shavings and gold leaf', price: 28, restId: 'omakase', cat: 'Mains', type: 'nonveg', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=120&q=80' },
  { id: 2, name: 'Charred Octopus', desc: 'Spanish octopus with chimichurri and crispy potatoes', price: 22, restId: 'omakase', cat: 'Starters', type: 'nonveg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&q=80' },
  { id: 3, name: 'Uni Pasta', desc: 'Fresh sea urchin with house-made tagliatelle', price: 36, restId: 'omakase', cat: 'Mains', type: 'nonveg', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=120&q=80' },
  { id: 4, name: 'Miso Black Cod', desc: 'Saikyo miso marinated Chilean sea bass', price: 42, restId: 'omakase', cat: 'Mains', type: 'nonveg', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&q=80' },
  { id: 5, name: 'Edamame Hummus', desc: 'Creamy edamame with sesame and nori chips', price: 12, restId: 'omakase', cat: 'Starters', type: 'veg', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=80' },
  { id: 6, name: 'Matcha Tiramisu', desc: 'Japanese-Italian fusion dessert with ceremonial grade matcha', price: 14, restId: 'omakase', cat: 'Desserts', type: 'veg', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=120&q=80' },
  
  // Truffle Hound
  { id: 7, name: 'Foie Gras Terrine', desc: 'Classic French preparation with brioche and fig jam', price: 32, restId: 'truffle', cat: 'Starters', type: 'nonveg', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&q=80' },
  { id: 8, name: 'Duck Confit', desc: 'Slow-cooked duck leg with cassoulet beans', price: 38, restId: 'truffle', cat: 'Mains', type: 'nonveg', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&q=80' },
  { id: 9, name: 'Beef Bourguignon', desc: 'Braised beef in red wine with pearl onions', price: 34, restId: 'truffle', cat: 'Mains', type: 'nonveg', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80' },
  { id: 10, name: 'Crème Brûlée', desc: 'Vanilla bean custard with caramelized sugar', price: 12, restId: 'truffle', cat: 'Desserts', type: 'veg', img: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=120&q=80' },
  
  // Verde & Vine
  { id: 11, name: 'Avocado Buddha Bowl', desc: 'Quinoa, roasted vegetables, tahini dressing', price: 16, restId: 'verde', cat: 'Mains', type: 'veg', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&q=80' },
  { id: 12, name: 'Mushroom Risotto', desc: 'Arborio rice with wild mushrooms and truffle oil', price: 18, restId: 'verde', cat: 'Mains', type: 'veg', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=120&q=80' },
  { id: 13, name: 'Kale Caesar', desc: 'Organic kale with vegan caesar dressing', price: 14, restId: 'verde', cat: 'Starters', type: 'veg', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&q=80' },
  
  // Napoli DOC
  { id: 14, name: 'Margherita DOC', desc: 'San Marzano tomatoes, buffalo mozzarella, basil', price: 18, restId: 'napoli', cat: 'Pizza', type: 'veg', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&q=80' },
  { id: 15, name: 'Diavola', desc: 'Spicy salami, mozzarella, chili oil', price: 22, restId: 'napoli', cat: 'Pizza', type: 'nonveg', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&q=80' },
  { id: 16, name: 'Tiramisu', desc: 'Classic Italian dessert with espresso and mascarpone', price: 10, restId: 'napoli', cat: 'Desserts', type: 'veg', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=120&q=80' },
  
  // Prime Cut Burgers
  { id: 17, name: 'Double Truffle Burger', desc: 'Double beef patty, truffle aioli, aged cheddar', price: 24, restId: 'prime', cat: 'Burgers', type: 'nonveg', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&q=80' },
  { id: 18, name: 'Classic Smash', desc: 'Smashed patty, American cheese, special sauce', price: 16, restId: 'prime', cat: 'Burgers', type: 'nonveg', img: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=120&q=80' },
  { id: 19, name: 'Truffle Fries', desc: 'Hand-cut fries with truffle oil and parmesan', price: 8, restId: 'prime', cat: 'Sides', type: 'veg', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=120&q=80' },
  
  // Le Pain Levain
  { id: 20, name: 'Croissant', desc: 'Buttery, flaky French pastry', price: 5, restId: 'levain', cat: 'Pastries', type: 'veg', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=80' },
  { id: 21, name: 'Pain au Chocolat', desc: 'Chocolate-filled croissant', price: 6, restId: 'levain', cat: 'Pastries', type: 'veg', img: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=120&q=80' },
  { id: 22, name: 'Sourdough Loaf', desc: 'Artisan sourdough bread', price: 8, restId: 'levain', cat: 'Breads', type: 'veg', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&q=80' },
  
  // Sakura Garden
  { id: 23, name: 'Tonkotsu Ramen', desc: 'Rich pork broth with chashu and soft egg', price: 18, restId: 'sakura', cat: 'Ramen', type: 'nonveg', img: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=120&q=80' },
  { id: 24, name: 'Veggie Ramen', desc: 'Miso broth with tofu and seasonal vegetables', price: 16, restId: 'sakura', cat: 'Ramen', type: 'veg', img: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=120&q=80' },
  { id: 25, name: 'Gyoza', desc: 'Pan-fried pork dumplings', price: 10, restId: 'sakura', cat: 'Starters', type: 'nonveg', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=120&q=80' },
  
  // Cantina Oro
  { id: 26, name: 'Carnitas Tacos', desc: 'Slow-cooked pork with pineapple salsa', price: 14, restId: 'cantina', cat: 'Tacos', type: 'nonveg', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=80' },
  { id: 27, name: 'Veggie Burrito', desc: 'Black beans, rice, guacamole, pico de gallo', price: 12, restId: 'cantina', cat: 'Burritos', type: 'veg', img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=120&q=80' },
  { id: 28, name: 'Churros', desc: 'Cinnamon sugar churros with chocolate sauce', price: 8, restId: 'cantina', cat: 'Desserts', type: 'veg', img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=120&q=80' },
]

export const reviews: Review[] = [
  { id: '1', name: 'Sarah M.', rating: 5, date: 'March 2024', text: "Absolutely phenomenal experience. The Wagyu was unlike anything I've tasted before — perfectly cooked and beautifully presented.", img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80' },
  { id: '2', name: 'James L.', rating: 4, date: 'February 2024', text: 'The omakase set was exquisite. Each course told a story. Delivery was surprisingly fast and packaging was excellent.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80' },
  { id: '3', name: 'Priya K.', rating: 5, date: 'January 2024', text: "Best sushi delivery I've had in the city. The fish was incredibly fresh and the presentation was restaurant-level quality.", img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80' },
]

export const orders: Order[] = [
  { id: '#ORD-2840', patron: 'Michael Chen', patronImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80', venue: 'Omonoia Sushi Bar', amount: '$128.00', status: 'delivered' },
  { id: '#ORD-2839', patron: 'Emma Wilson', patronImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80', venue: 'The Truffle Hound', amount: '$85.50', status: 'transit' },
  { id: '#ORD-2838', patron: 'James Rodriguez', patronImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80', venue: 'Verde & Vine', amount: '$42.00', status: 'delivered' },
  { id: '#ORD-2837', patron: 'Sophie Anderson', patronImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80', venue: 'Prime Cut Burgers', amount: '$36.90', status: 'cancelled' },
]

export const chartData = [42, 58, 45, 62, 78, 65, 72]

export const categories = [
  { id: 'all', label: 'All Cuisines' },
  { id: 'michelin', label: 'Michelin Star' },
  { id: 'italian', label: 'Italian' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'french', label: 'French Bistro' },
  { id: 'bakery', label: 'Artisan Bakery' },
  { id: 'vegan', label: 'Vegan Gourmet' },
  { id: 'burger', label: 'Burgers' },
]
