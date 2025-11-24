import React, { useState } from 'react'
export default function AddProduct({ onCreate }){
const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '', category: '', description: '' })
const valid = form.name && form.sku && form.price && Number(form.price)>0
const [saving, setSaving] = useState(false)
const submit = async (e) => { e.preventDefault(); if(!valid) return; setSaving(true); await onCreate({ ...form, price: Number(form.price), stock: Number(form.stock||0) }); setSaving(false); setForm({ name:'',sku:'',price:'',stock:'',category:'',description:'' }) }


return (
<div className="max-w-2xl bg-white p-4 rounded shadow">
<h2 className="text-lg font-semibold">Add Product</h2>
<form className="mt-3 space-y-3" onSubmit={submit}>
<div><label className="block text-sm">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full mt-1 p-2 border rounded"/></div>
<div className="grid grid-cols-2 gap-2"><div><label className="block text-sm">SKU</label><input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="w-full mt-1 p-2 border rounded"/></div><div><label className="block text-sm">Price</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full mt-1 p-2 border rounded"/></div></div>
<div><label className="block text-sm">Stock</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="w-full mt-1 p-2 border rounded"/></div>
<div><label className="block text-sm">Category</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full mt-1 p-2 border rounded"/></div>
<div><label className="block text-sm">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full mt-1 p-2 border rounded"/></div>
<div className="flex gap-2"><button disabled={!valid||saving} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">{saving? 'Saving...':'Save'}</button><button type="reset" onClick={()=>setForm({ name:'',sku:'',price:'',stock:'',category:'',description:'' })} className="px-4 py-2 border rounded">Reset</button></div>
</form>
</div>
)
}