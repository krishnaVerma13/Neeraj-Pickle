import React, { useState } from 'react'
export default function AllProducts({ products, onEdit, onDelete }){
const [search, setSearch] = useState('')
console.log(products);

const list = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
return (
<div className="bg-white rounded shadow p-4">
<div className="flex items-center justify-between"><h2 className="font-semibold">All Products</h2><div className="flex items-center gap-2"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" className="px-2 py-1 border rounded"/></div></div>
<div className="mt-3 overflow-x-auto">
<table className="w-full text-left"><thead><tr className="text-sm text-gray-500"><th className="p-2">Name</th><th className="p-2">SKU</th><th className="p-2">Price</th><th className="p-2">Stock</th><th className="p-2">Category</th><th className="p-2">Actions</th></tr></thead>
<tbody>{list.map(p => (<tr key={p.id} className="border-t hover:bg-gray-50"><td className="p-2">{p.name}</td><td className="p-2">{p.sku}</td><td className="p-2">₹{p.price}</td><td className="p-2">{p.stock}</td><td className="p-2">{p.category}</td><td className="p-2"><div className="flex gap-2"><button onClick={()=>onEdit(p)} className="px-2 py-1 text-sm border rounded">Edit</button><button onClick={()=>onDelete(p.id)} className="px-2 py-1 text-sm border rounded">Delete</button></div></td></tr>))}</tbody>
</table>
</div>
</div>
)
}