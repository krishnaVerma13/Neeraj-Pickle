export const products = [
{ id: 'p1', name: 'Homestyle Paneer', sku: 'HP-001', price: 249, stock: 12, category: 'Paneer', description: 'Fresh homemade paneer.' },
{ id: 'p2', name: 'Mixed Veg Tiffin', sku: 'MV-002', price: 149, stock: 25, category: 'Veg', description: 'Seasonal veggies, home-cooked.' },
{ id: 'p3', name: 'Chicken Curry', sku: 'CC-003', price: 279, stock: 8, category: 'Non-Veg', description: 'Spicy and tender.' },
]


export const orders = [
{ id: 'o1', customer: 'Ravi Sharma', items: [{ productId: 'p2', qty: 2 }], total: 298, status: 'Pending', date: '2025-11-18' },
{ id: 'o2', customer: 'Anita Singh', items: [{ productId: 'p1', qty: 1 }, { productId: 'p3', qty: 1 }], total: 528, status: 'Shipped', date: '2025-11-19' },
{ id: 'o3', customer: 'Rahul Joshi', items: [{ productId: 'p3', qty: 2 }], total: 558, status: 'Delivered', date: '2025-11-10' },
]