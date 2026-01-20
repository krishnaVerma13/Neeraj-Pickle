import React, { useEffect, useMemo, useState } from 'react'
import Toasts from './components/Toasts'
import Dashboard from './Pages/admin/Dashboard'
import AddProduct from './Pages/admin/products/AddProduct'
import AllProducts from './Pages/admin/products/AllProducts'
import AllOrders from './Pages/admin/orders/AllOrders'
import ManageOrders from './Pages/admin/orders/ManageOrders'


// static data imports
import { products as staticProducts, orders as staticOrders } from './data/mockData'
import Sidebar from './components/Sidebar'
import TopNavbar from './components/TopNavbar'
import Modal from './components/Modal'
import getAllProductApi from './api/AuthAPI/getAllproductApi'


export default function AdminApp() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [active, setActive] = useState('dashboard')
    const [products, setProducts] = ([...staticProducts])
    const [orders, setOrders] = useState([...staticOrders])
    const [modal, setModal] = useState({ open: false, title: '', content: null })
    const [toasts, setToasts] = useState([])
    // const [AllProductData, setAllProductData] = useState()


    useEffect(() => {
        
    }, [])


    const stats = useMemo(() => ({
        productCount: products.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        todayCount: orders.filter(o => o.date === new Date().toISOString().slice(0, 10)).length,
        revenue: orders.reduce((s, o) => s + o.total, 0)
    }), [products, orders])


    const navigate = (id) => { setActive(id); setSidebarOpen(false) }


    const pushToast = (msg) => {
        const id = Date.now().toString()
        setToasts(t => [...t, { id, msg }])
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
    }



    const changeOrderStatus = (id, status) => {
        setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
        pushToast(`Order ${id} -> ${status}`);
    }


    function renderContent() {
        if (active === 'dashboard') return <Dashboard /> //AllProductData={AllProductData?.length}
        if (active === 'products_add') return <AddProduct />
        if (active === 'products_all') return <AllProducts  /> //AllProductData={AllProductData}
        if (active === 'orders_all' || active === 'orders_manage') return <AllOrders  />
        return <div>Not Found</div>
    }


    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className={`fixed inset-y-0 left-0 z-40 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
                <Sidebar collapsed={false} onNavigate={navigate} active={active} onClose={() => setSidebarOpen(false)} />
            </div>


            <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
                <TopNavbar onToggleSidebar={() => setSidebarOpen(s => !s)} title={active.includes('products') ? 'Products' : active.includes('orders') ? 'Orders' : 'Dashboard'} onOpenProfile={() => pushToast('Profile clicked')} />
                <main className="p-4">{renderContent()}</main>
            </div>


            <Modal open={modal.open} title={modal.title} onClose={() => setModal({ open: false })}>{modal.content}</Modal>


            {/* <Toasts toasts={toasts} /> */}
        </div>
    )
}