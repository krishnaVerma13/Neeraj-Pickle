import React from 'react'


export default function TopNavbar({ onToggleSidebar, title = 'Dashboard', onOpenProfile }){
return (
<header className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
<div className="flex items-center gap-3">
<button aria-label="Toggle sidebar" onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
<svg className="w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"/></svg>
</button>
<h1 className="text-lg font-semibold text-gray-800">{title}</h1>
</div>


<div className="flex items-center gap-3">
<div className="hidden sm:block">
<input aria-label="Search" placeholder="Search products, orders..." className="px-3 py-2 rounded-md border text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400" />
</div>
<button aria-label="Profile" onClick={onOpenProfile} className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
<span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">KV</span>
</button>
</div>
</header>
)
}