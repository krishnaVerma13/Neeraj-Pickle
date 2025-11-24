import React, { useEffect, useMemo, useState } from 'react'
import Toasts from './components/Toasts'
import Dashboard from './pages/Dashboard'
import AddProduct from './pages/products/AddProduct'
import AllProducts from './pages/products/AllProducts'
import AllOrders from './pages/orders/AllOrders'
import ManageOrders from './pages/orders/ManageOrders'


// static data imports
import { products as staticProducts, orders as staticOrders } from './data/mockData'
import Sidebar from './components/Sidebar'
import TopNavbar from './components/TopNavbar'
import Modal from './components/Modal'


export default function AdminApp(){
const [sidebarOpen, setSidebarOpen] = useState(false)
const [active, setActive] = useState('products_all')
const [products, setProducts] = ([...staticProducts])
const [orders, setOrders] = useState([...staticOrders])
const [modal, setModal] = useState({ open: false, title: '', content: null })
const [toasts, setToasts] = useState([])


useEffect(()=>{
// placeholder: later call API to load
},[])


const stats = useMemo(()=>({
productCount: products.length,
pending: orders.filter(o => o.status === 'Pending').length,
todayCount: orders.filter(o => o.date === new Date().toISOString().slice(0,10)).length,
revenue: orders.reduce((s,o)=>s+o.total, 0)
}), [products, orders])


const navigate = (id) => { setActive(id); setSidebarOpen(false) }


const pushToast = (msg) => {
const id = Date.now().toString()
setToasts(t => [...t, { id, msg }])
setTimeout(()=> setToasts(t => t.filter(x => x.id !== id)), 3000)
}


// CRUD helpers (static-data based)
const createProduct = (payload) => { const newP = { ...payload, id: 'p'+Date.now() }; setProducts(p=>[newP,...p]); pushToast('Product created'); }
const updateProduct = (id, payload) => { setProducts(p=>p.map(x=> x.id===id?{...x,...payload}:x)); pushToast('Product updated'); }
const deleteProduct = (id) => { if(!confirm('Delete product?')) return; setProducts(p=>p.filter(x => x.id !== id)); pushToast('Product deleted'); }


const changeOrderStatus = (id, status) => { setOrders(o=> o.map(x => x.id===id?{...x, status}:x)); pushToast(`Order ${id} -> ${status}`); }


function renderContent(){
if(active === 'dashboard') return <Dashboard products={products} orders={orders} stats={stats} />
if(active === 'products_add') return <AddProduct onCreate={createProduct} />
if(active === 'products_all') return <AllProducts products={products} onEdit={(p)=> setModal({ open: true, title: 'Edit Product', content: <div><h3 className="font-semibold">Edit</h3><pre>{JSON.stringify(p,null,2)}</pre></div> })} onDelete={deleteProduct} />
if(active === 'orders_all' || active === 'orders_manage') return <AllOrders orders={orders} onManage={(id)=> setModal({ open: true, title: `Manage ${id}`, content: <ManageOrders orderId={id} orders={orders} onChangeStatus={changeOrderStatus} /> })} />
return <div>Not Found</div>
}


return (
<div className="min-h-screen bg-gray-50 flex">
<div className={`fixed inset-y-0 left-0 z-40 ${sidebarOpen? 'block' : 'hidden'} lg:block`}>
<Sidebar collapsed={false} onNavigate={navigate} active={active} onClose={()=> setSidebarOpen(false)} />
</div>


<div className="flex-1 flex flex-col min-h-screen lg:pl-64">
<TopNavbar onToggleSidebar={()=> setSidebarOpen(s => !s)} title={active.includes('products')? 'Products' : active.includes('orders')? 'Orders' : 'Dashboard'} onOpenProfile={()=> pushToast('Profile clicked')} />
<main className="p-4">{ renderContent() }</main>
</div>


<Modal open={modal.open} title={modal.title} onClose={()=> setModal({ open: false })}>{modal.content}</Modal>


<Toasts toasts={toasts} />
</div>
)
}