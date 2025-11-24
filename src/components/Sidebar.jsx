import React from 'react'


export default function Sidebar({ collapsed, onNavigate, active, onClose }){
const nav = [
{ id: 'dashboard', label: 'Dashboard' },
{ id: 'products_all', label: 'All Products' },
{ id: 'products_add', label: 'Add Product' },
{ id: 'orders_all', label: 'All Orders' },
{ id: 'orders_manage', label: 'Manage Orders' },
]


return (
<aside className={`bg-white border-r w-64 ${collapsed ? 'hidden lg:block' : 'block'} lg:block`} aria-label="Sidebar">
<div className="p-4 flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-8 h-8 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold">YT</div>
<div className="hidden md:block">
<div className="font-semibold">Your Tiffin</div>
<div className="text-xs text-gray-500">Admin</div>
</div>
</div>
<button aria-label="Close sidebar" onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded-md">✕</button>
</div>


<nav className="px-2 py-3">
{nav.map(i => (
<button key={i.id} onClick={() => onNavigate(i.id)} className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 ${active === i.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}>
{i.label}
</button>
))}
</nav>
</aside>
)
}