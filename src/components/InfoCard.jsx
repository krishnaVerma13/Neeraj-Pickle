import React from 'react'
export default function InfoCard({ title, number, children }){
return (
<div className="bg-white rounded-lg p-4 shadow-sm border flex-1">
<div className="text-sm text-gray-500">{title}</div>
<div className="mt-2 text-2xl font-semibold text-gray-800">{number}</div>
<div className="mt-3 text-sm text-gray-500">{children}</div>
</div>
)
}