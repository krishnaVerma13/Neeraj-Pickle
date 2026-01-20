import React from 'react'
import InfoCard from '../../components/InfoCard'
import { ShoppingCart, Package, TrendingUp, Clock, AlertCircle, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import getAllProductApi from '../../api/AuthAPI/getAllproductApi';
import getAllOrderApi from '../../api/AuthAPI/getAllOrderApi';
import getAllCustomizeOrderApi from "../../api/AuthAPI/getAllCustomizeOrderApi"




export default function Dashboard() {

    // State for pending orders filter
    const [pendingFilter, setPendingFilter] = React.useState('today'); // 'today' or 'alltime'

    // Here we fatch Product data through useQuery and store data in cache 
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["product"],
        queryFn: getAllProductApi,
        staleTime: 20 * 60 * 1000, // 20 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    // here we fatch Order 
    const { data: orderData, isLoading: orderDataLoading, error: orderError, refetch: orderRefetch } = useQuery({
        queryKey: ["order"],
        queryFn: getAllOrderApi,
        staleTime: 20 * 60 * 1000, // 20 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })
    
    const { data: custOrderData, isLoading: custOrderDataLoading, error: custOrderError, refetch: custOrderRefetch } = useQuery({
        queryKey: ["customOrder"],
        queryFn: getAllCustomizeOrderApi,
        staleTime: 20 * 60 * 1000, // 20 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    // Helper function to calculate daily order stats
    function getDailyOrderStats(orders, targetDate) {
        if (!orders || !Array.isArray(orders)) return {
            totalOrders: 0,
            totalRevenue: 0,
            ordersByStatus: {},
            orders: []
        };

        // Default to current date (today) if no date provided
        const filterDate = targetDate ? new Date(targetDate) : new Date();

        // Set time to start of day for accurate comparison
        filterDate.setHours(0, 0, 0, 0);

        // Filter orders for the specified date
        const dailyOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === filterDate.getTime();
        });

        // Calculate total revenue for the day
        const totalRevenue = dailyOrders.reduce((sum, order) => {
            return sum + (order.totalBill || 0);
        }, 0);

        // Count total orders
        const totalOrders = dailyOrders.length;

        // Group by order status
        const ordersByStatus = dailyOrders.reduce((acc, order) => {
            const status = order.orderStatus || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return {
            date: filterDate.toISOString().split('T')[0],
            orders: dailyOrders,
            totalOrders,
            totalRevenue,
            ordersByStatus,
            averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
        };
    }

    // Calculate today's stats for regular orders only (custom orders don't have amounts)
    const todayOrderStats = getDailyOrderStats(orderData?.data);
    
    // Count today's custom orders (they're text-based, no totalBill)
    const getTodayCustomOrders = () => {
        if (!custOrderData?.data || !Array.isArray(custOrderData.data)) return { count: 0, pending: 0 };
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayCustom = custOrderData.data.filter(order => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === today.getTime();
        });
        
        const pending = todayCustom.filter(order => order.orderStatus === 'pending').length;
        
        return { count: todayCustom.length, pending };
    };
    
    const todayCustomOrderStats = getTodayCustomOrders();

    // Calculate pending orders based on filter
    const getPendingOrders = () => {
        if (pendingFilter === 'today') {
            // Today's pending orders only
            return (todayOrderStats.ordersByStatus?.pending || 0) + todayCustomOrderStats.pending;
        } else {
            // All time pending orders
            const allRegularPending = (orderData?.data || []).filter(order => order.orderStatus === 'pending').length;
            const allCustomPending = (custOrderData?.data || []).filter(order => order.orderStatus === 'pending').length;
            return allRegularPending + allCustomPending;
        }
    };

    // Combine stats
    const stats = {
        totalProducts: data?.data?.length || "....",
        ordersToday: todayOrderStats.totalOrders || '....',
        customOrdersToday: todayCustomOrderStats.count || 0,
        revenue: todayOrderStats.totalRevenue || '....',
        pendingOrders: getPendingOrders()
    };

    // Get combined recent orders from both regular and custom orders
    const getRecentOrders = () => {
        const regularOrders = orderData?.data || [];
        const customOrders = custOrderData?.data || [];
        
        // Combine and map both order types
        const allOrders = [
            ...regularOrders.map(order => ({
                id: order.orderId,
                customer: order.firmName,
                items: order.productOrders?.length || 0,
                amount: order.totalBill,
                status: order.orderStatus,
                type: 'standard',
                createdAt: order.createdAt
            })),
            ...customOrders.map(order => ({
                id: order.orderId,
                customer: order.firmName,
                items: 'Custom',
                amount: null, // Custom orders don't have amounts
                status: order.orderStatus,
                type: 'custom',
                createdAt: order.createdAt
            }))
        ];

        // Sort by createdAt (most recent first)
        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Get top 4 recent orders and calculate time ago
        return allOrders.slice(0, 4).map(order => {
            const timeAgo = getTimeAgo(order.createdAt);
            return { ...order, time: timeAgo };
        });
    };

    // Helper function to calculate time ago
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const createdAt = new Date(dateString);
        const diffMs = now - createdAt;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    };

    const recentOrders = getRecentOrders();

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            <div className="min-h-screen bg-gray-50">

                {/* Main Content */}
                <main className="p-6 max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                        <p className="text-gray-600">Welcome back! Here's your store overview</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Products</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalProducts}</h3>
                                </div>
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Package className="text-blue-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Orders Today</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.ordersToday}</h3>
                                    <p className="text-xs text-green-600 mt-1 font-medium">+{stats.customOrdersToday} custom</p>
                                </div>
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="text-green-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Revenue</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-2">₹{stats.revenue}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Today</p>
                                </div>
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="text-orange-600" size={28} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600 font-medium">Pending</p>
                                        <select 
                                            value={pendingFilter}
                                            onChange={(e) => setPendingFilter(e.target.value)}
                                            className="text-xs bg-gray-100 border-0 rounded-md px-2 py-1 focus:ring-2 focus:ring-yellow-400 outline-none cursor-pointer"
                                        >
                                            <option value="today">Today</option>
                                            <option value="alltime">All Time</option>
                                        </select>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingOrders}</h3>
                                    <p className="text-xs text-yellow-600 mt-1 font-medium">Action needed</p>
                                </div>
                                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex space-y-2 items-center justify-center">
                                    <Clock className="text-yellow-600" size={28} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders & Low Stock */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-md">
                            <div className="p-6 border-b">
                                <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-bold text-gray-800">{order.id}</span>
                                                        {order.type === 'custom' && (
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                                                Custom
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                                                    <p className="text-xs text-gray-500">{order.time}</p>
                                                </div>
                                                <div className="text-right mr-4">
                                                    <p className="text-sm text-gray-600">{order.items} {order.type === 'standard' && 'items'}</p>
                                                    {order.amount !== null ? (
                                                        <p className="text-lg font-bold text-gray-800">₹{order.amount}</p>
                                                    ) : (
                                                        <p className="text-sm text-purple-600 font-semibold">Text Order</p>
                                                    )}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No recent orders
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}