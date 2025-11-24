import React from 'react'
export default function ManageOrders({ orderId, orders, onChangeStatus }){
const order = orders.find(o => o.id === orderId)
if(!order) return <div>Order not found</div>
return (
<div className="space-y-3">
<div><div className="text-sm text-gray-500">Order ID</div><div className="font-medium">{order.id}</div></div>
<div><div className="text-sm text-gray-500">Customer</div><div className="font-medium">{order.customer}</div></div>
<div><div className="text-sm text-gray-500">Status</div><div className="flex items-center gap-2 mt-1"><div className="font-medium">{order.status}</div><select defaultValue={order.status} onChange={e=>onChangeStatus(orderId, e.target.value)} className="px-2 py-1 border rounded"><option>Pending</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></div></div>
<div><div className="text-sm text-gray-500">Items</div><ul className="mt-1 space-y-1">{order.items.map((it, idx) => <li key={idx} className="text-sm">{it.productId} x {it.qty}</li>)}</ul></div>
</div>
)
}