import React from 'react'
import InfoCard from '../components/InfoCard'


export default function Dashboard({ products, orders, stats }){
const points = [10,20,18,25,22,30,28]
const max = Math.max(...points)
const svgPoints = points.map((p,i) => `${(i/(points.length-1))*100},${100-(p/max)*100}`).join(' ')


return (
<div className="space-y-4">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<InfoCard title="Products" number={stats.productCount}>Total products</InfoCard>
<InfoCard title="Pending Orders" number={stats.pending}>Orders waiting</InfoCard>
<InfoCard title="Orders Today" number={stats.todayCount}>Placed today</InfoCard>
<InfoCard title="Revenue" number={stats.revenue}>Revenue (mock)</InfoCard>
</div>


<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
<div className="bg-white rounded-lg p-4 border shadow-sm">
<div className="flex items-center justify-between"><h3 className="font-semibold">Top products</h3><button className="text-sm text-indigo-600">View all</button></div>
<ul className="mt-3 space-y-2">{products.slice(0,5).map(p => <li key={p.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50"><div><div className="font-medium">{p.name}</div><div className="text-xs text-gray-500">{p.category} • {p.sku}</div></div><div className="text-sm">₹{p.price}</div></li>)}</ul>
</div>


<div className="bg-white rounded-lg p-4 border shadow-sm">
<div className="flex items-center justify-between"><h3 className="font-semibold">Orders (recent)</h3><div className="text-xs text-gray-500">Last 7 days</div></div>
<ul className="mt-3 space-y-2">{orders.slice(0,6).map(o => <li key={o.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50"><div><div className="font-medium">{o.customer}</div><div className="text-xs text-gray-500">{o.items.length} items • {o.date}</div></div><div className="text-sm">{o.status}</div></li>)}</ul>


<div className="mt-4"><svg viewBox="0 0 100 100" className="w-full h-24"><polyline fill="none" stroke="#6366F1" strokeWidth="2" points={svgPoints} /></svg></div>
</div>
</div>
</div>
)
}