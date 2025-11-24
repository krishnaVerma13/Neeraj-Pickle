import React from 'react'


export default function Toasts({ toasts = [] }){
return (
<div className="fixed right-4 bottom-4 z-50 space-y-2">
{toasts.map(t => (
<div key={t.id} className="bg-black text-white px-4 py-2 rounded shadow">{t.msg || t.message}</div>
))}
</div>
)
}