// Lightweight wrappers around static data — replace later with real API calls.
import { products as staticProducts } from '../data/mockData'
let products = [...staticProducts]


export async function listProducts() {
return Promise.resolve([...products])
}
export async function getProduct(id) {
return Promise.resolve(products.find(p => p.id === id))
}
export async function createProduct(payload) {
const newP = { ...payload, id: 'p' + Date.now() }
products = [newP, ...products]
return Promise.resolve(newP)
}
export async function updateProduct(id, payload) {
products = products.map(p => p.id === id ? { ...p, ...payload } : p)
return Promise.resolve(products.find(p => p.id === id))
}
export async function deleteProduct(id) {
products = products.filter(p => p.id !== id)
return Promise.resolve(true)
}