import React from 'react'
export default function Modal({ open, onClose, title, children }){
if(!open) return null
return (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
<div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
<div role="dialog" aria-modal="true" className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full p-4">
<div className="flex items-center justify-between">
<h3 className="text-lg font-semibold">{title}</h3>
<button onClick={onClose} aria-label="Close modal" className="p-1 rounded-md hover:bg-gray-100">✕</button>
</div>
<div className="mt-3">{children}</div>
</div>
</div>
)
}