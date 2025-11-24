import { orders as staticOrders } from '../data/mockData'
let orders = [...staticOrders]


export async function listOrders() {
return Promise.resolve([...orders])
}
export async function updateOrderStatus(id, status) {
orders = orders.map(o => o.id === id ? { ...o, status } : o)
return Promise.resolve(orders.find(o => o.id === id))
}