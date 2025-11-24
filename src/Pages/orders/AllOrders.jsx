import React, { useState } from 'react'
export default function AllOrders({ orders, onManage }){
const [filter, setFilter] = useState('All')
const filtered = orders.filter(o => filter === 'All' ? true : o.status === filter)
const statuses = ['All','Pending','Shipped','Delivered','Cancelled']


return (
<div className="bg-white rounded shadow p-4">
<div className="flex items-center justify-between"><h2 className="font-semibold">Orders</h2><div className="flex items-center gap-2"><select value={filter} onChange={e=>setFilter(e.target.value)} className="px-2 py-1 border rounded">{statuses.map(s=> <option key={s} value={s}>{s}</option>)}</select></div></div>
<div className="mt-3 overflow-x-auto">
<table className="w-full text-left"><thead><tr className="text-sm text-gray-500"><th className="p-2">Order ID</th><th className="p-2">Customer</th><th className="p-2">Items</th><th className="p-2">Total</th><th className="p-2">Status</th><th className="p-2">Date</th><th className="p-2">Actions</th></tr></thead>
<tbody>{filtered.map(o => (<tr key={o.id} className="border-t hover:bg-gray-50"><td className="p-2">{o.id}</td><td className="p-2">{o.customer}</td><td className="p-2">{o.items.length}</td><td className="p-2">₹{o.total}</td><td className="p-2">{o.status}</td><td className="p-2">{o.date}</td><td className="p-2"><div className="flex gap-2"><button onClick={()=>onManage(o.id)} className="px-2 py-1 border rounded">Manage</button></div></td></tr>))}</tbody>
</table>
</div>
</div>
)
}