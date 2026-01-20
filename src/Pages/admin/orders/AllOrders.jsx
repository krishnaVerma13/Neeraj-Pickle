import React, { useState } from 'react'
import OrderTable from '../../../components/OrderTable'
import getAllOrderApi from '../../../api/AuthAPI/getAllOrderApi'
import { HiRefresh } from "react-icons/hi";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Loader from '../../../Component/Loader';
import getAllCustomizeOrderApi from '../../../api/AuthAPI/getAllCustomizeOrderApi';
import updateOrderStatusApi from '../../../api/AuthAPI/UpdateOrderStatusApi';
import DeleteOrderAPi from '../../../api/AuthAPI/DeleteOrderApi';
import UpdateCustomizeOrderStateApi from "../../../api/AuthAPI/UpdateCustomizeOrderStateApi"
import DeleteCustomizeOrderApi from '../../../api/AuthAPI/DeleteCustomizeOrderApi'
import DownloadSingleOrderApi from '../../../api/AuthAPI/DownloadSingleOrderApi';
import DownloadCustomOrderApi from '../../../api/AuthAPI/DownloadCustomOrderApi';

import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';

import {  useEffect } from 'react';

export default function AllOrders() {
    const [loading, setLoading] = useState(false);
    const [AllOrders, setAllOrders] = useState([]);
    const [ShowOrder, setShowOrder] = useState(false);
    const [OrderText, setOrderText] = useState([]);

    const { data: orderData, isLoading: orderDataLoading, error: orderError, refetch: orderRefetch } = useQuery({
        queryKey: ["order"],
        queryFn: getAllOrderApi,
        staleTime: 20 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });
    
    const { data: custOrderData, isLoading: custOrderDataLoading, error: custOrderError, refetch: custOrderRefetch } = useQuery({
        queryKey: ["customOrder"],
        queryFn: getAllCustomizeOrderApi,
        staleTime: 20 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    const getorder = async () => {
        setLoading(true);
        
        const orderdata = await orderData;
        const customizeData = await custOrderData;

        if (!orderData || !customizeData) {
            setLoading(false);
            return Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Customize data not found",
            });
        }
        setAllOrders(orderdata.data);
        setOrderText(customizeData.data);
        setLoading(false);
    };

    const handleRefresh = async () => {
        setLoading(true);
        try {
            if (ShowOrder) {
                await custOrderRefetch();
            } else {
                await orderRefetch();
            }
        } catch (error) {
            console.error("Refresh failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const UpdateState = async (id, state, index) => {
        try {
            const payload = { orderStatus: state };
            const res = await updateOrderStatusApi(id, payload);
            const updatedOrder = res?.data?.data ?? res?.data ?? res;
            setAllOrders(prev => prev.map(item => (item._id === id ? updatedOrder : item)));
        } catch (err) {
            console.error("update failed", err);
            Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Could not update order status. Try again.",
            });
        }
    };

    const DeleteOrder = async (id, index) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Remove!",
                    text: "Product has been removed.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                const deleteRes = await DeleteOrderAPi(id);
                if (!deleteRes) {
                    return Swal.fire({
                        icon: "error",
                        title: "Network error",
                        text: "Something went wrong!",
                    });
                }
                setAllOrders(prev => prev.filter((order) => order._id !== id));
            }
        });
    };

    const custUpdateState = async (id, state, index) => {
        try {
            const payload = { orderStatus: state };
            const res = await UpdateCustomizeOrderStateApi(id, payload);
            const updatedOrder = res?.data;
            setOrderText(prev => prev.map(item => (item._id === id ? updatedOrder : item)));
        } catch (err) {
            console.error("update failed", err);
            Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Could not update order status. Try again.",
            });
        }
    };

    const custDeleteOrder = async (id, index) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Remove!",
                    text: "Product has been removed.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                const deleteRes = await DeleteCustomizeOrderApi(id);
                if (!deleteRes) {
                    return alert("Something went wrong!");
                }
                setOrderText(prev => prev.filter((order) => order._id !== id));
            }
        });
    };

    // Fixed: Changed useState to useEffect
    useEffect(() => {
        getorder();
    }, []);

    // Update data when refetch completes
    useEffect(() => {
        if (orderData?.data) {
            setAllOrders(orderData.data);
        }
    }, [orderData]);

    useEffect(() => {
        if (custOrderData?.data) {
            setOrderText(custOrderData.data);
        }
    }, [custOrderData]);

    return (
        <div className="bg-white rounded shadow p-4">
            {loading && <Loader />}
            {!loading && (
                <div>
                    <div>
                        <div className='flex text-nowrap'>
                            <div className='flex items-center text-3xl font-bold text-sky-700 px-3'>
                                <p>{!ShowOrder ? "#Detail Orders" : "#Customize Order"}</p>
                            </div>
                            <div className='w-full flex justify-end py-3 space-x-3'>
                                <button
                                    onClick={() => setShowOrder(!ShowOrder)}
                                    className='bg-sky-400 px-3 py-1 rounded'>
                                    {ShowOrder ? "Detail Orders" : "Customize Order"}
                                </button>
                                <button 
                                    className='flex items-center gap-1' 
                                    onClick={handleRefresh}
                                >
                                    Refresh
                                    <HiRefresh className='text-2xl' />
                                </button>
                            </div>
                        </div>
                   
                        {ShowOrder ? <div>
                            {/* ------------------- Text Order List ----------- */}
                            {OrderText?.slice().reverse().map((order, index) => {
                                return (<>
                                    <div key={index}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1-content"
                                                id="panel1-header"
                                            >
                                                <Typography component="span">
                                                    {/* HEADER */}
                                                    <div className="flex w-full  justify-between items-start border-b pb-4 mb-4 space-x-10">
                                                        <div>
                                                            <h2 className="text-2xl font-bold text-gray-800">{order.firmName}</h2>
                                                            <div className="flex space-x-10 ">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">City: {order.city}</p>
                                                                    <p className="text-sm text-gray-500">Phone: {order.phoneNo}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500">GST: {order.GST}</p>
                                                                    <p className="text-sm text-gray-500">Transportation: {order.transportation}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className='underline text-lg'>Order Id: <span className='font-semibold underline'>{order.orderId}</span></p>

                                                            </div>
                                                        </div>
                                                        <div className="text-right flex items-end h-20">
                                                            <div>
                                                                <span
                                                                    className={`px-3 py-1 rounded-lg text-sm font-semibold text-white
                                                                         ${order.orderStatus === "pending" ? "bg-yellow-600" :
                                                                            order.orderStatus === "accept" ? "bg-green-600" : "bg-red-600"
                                                                        }`}
                                                                >
                                                                    {order.orderStatus?.toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='md:space-x-2 space-y-2 w-full md:space-y-0 md:flex justify-end'>
                                                            <div
                                                                role="button"
                                                                tabIndex={0}
                                                                className='px-2 py-1 bg-lime-300 rounded text-xs'
                                                                onClick={(e) => { e.stopPropagation(); custUpdateState(order._id, "accept", index) }}
                                                            >Accept
                                                            </div>
                                                            <div
                                                                role="button"
                                                                tabIndex={0}
                                                                onClick={(e) => { e.stopPropagation(); custUpdateState(order._id, "reject", index) }}
                                                                className='px-2 py-1 bg-red-400 rounded text-xs'>Reject</div>
                                                            <div
                                                                role="button"
                                                                tabIndex={0}
                                                                onClick={(e) => { e.stopPropagation(); custDeleteOrder(order._id, index) }}
                                                                className='px-2 py-1 bg-red-600 rounded text-xs'>Delete</div>
                                                        </div>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {/* PRODUCT DETAILS */}
                                                <div className="space-y-2">
                                                    {order.textOrder.map((product, ind) => (
                                                        <div
                                                            key={ind}
                                                            className="border rounded-lg p-4 shadow-sm bg-gray-50"
                                                        >
                                                            <div className="flex gap-4 items-center">
                                                                {product}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div>
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={(e) => { e.stopPropagation(); DownloadCustomOrderApi(order._id) }}
                                                            className='rounded px-3 py-1 bg-lime-300'
                                                        >
                                                            Download
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>


                                    </div>
                                </>)
                            })}
                        </div> : <div>
                            {/* ------------ Deatild Order List ---------------- */}
                            {AllOrders?.slice().reverse().map((order, index) => {
                                return (<>
                                    <div key={index}>
                                        <Accordion>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1-content"
                                                id="panel1-header"
                                            >
                                                <Typography component="span">
                                                    {/* HEADER */}
                                                    <div className="flex w-full  justify-between items-start border-b pb-4 mb-4 space-x-10">
                                                        <div>
                                                            <h2 className="text-2xl font-bold text-gray-800">{order.firmName}</h2>
                                                            <div className="flex space-x-10 ">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">City: {order.city}</p>
                                                                    <p className="text-sm text-gray-500">Phone: {order.phoneNo}</p>
                                                                </div>
                                                            <div>
                                                                    <p className="text-sm text-gray-500">GST: {order.GST}</p>
                                                                    <p className="text-sm text-gray-500">Transportation: {order.transportation}</p>
                                                                </div>

                                                            </div>
                                                            <div>
                                                                <p className='underline text-lg'>Order Id: <span className='font-semibold underline'>{order.orderId}</span></p>
                                                            </div>
                                                        </div>



                                                        <div className="text-right flex items-end h-20">
                                                            <div>
                                                                <span
                                                                    className={`px-3 py-1 rounded-lg text-sm font-semibold text-white ${order.orderStatus === "pending"
                                                                        ? "bg-yellow-600"
                                                                        : order.orderStatus === "accept"
                                                                            ? "bg-green-600"
                                                                            : "bg-red-600"
                                                                        }`}
                                                                >
                                                                    {order.orderStatus.toUpperCase()}
                                                                </span>

                                                                <p className="font-bold text-base md:text-xl text-gray-800 mt-2">
                                                                    <span className='text-nowrap'>Total Bill:</span> ₹{order.totalBill}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='md:space-x-2 space-y-2 w-full md:space-y-0 md:flex justify-end'>
                                                            <div
                                                                role="button"
                                                                tabIndex={0}
                                                                className='px-2 py-1 bg-lime-300 rounded text-xs'
                                                                onClick={(e) => { e.stopPropagation(); UpdateState(order._id, "accept", index) }}
                                                            >Accept
                                                            </div>
                                                            <div
                                                                role="button"
                                                                tabIndex={0}
                                                                onClick={(e) => { e.stopPropagation(); UpdateState(order._id, "reject", index) }}
                                                                className='px-2 py-1 bg-red-400 rounded text-xs'>Reject</div>
                                                            <div
                                                                role="button"
                                                                tabIndex={0}
                                                                onClick={(e) => { e.stopPropagation(); DeleteOrder(order._id, index) }}
                                                                className='px-2 py-1 bg-red-600 rounded text-xs'>Delete</div>
                                                        </div>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {/* PRODUCT DETAILS */}
                                                <div className="space-y-6">
                                                    {order.productOrders.length == 0 ? <div> <p className='text-3xl'>User Not add product ??</p></div> :
                                                        <div>
                                                            {order?.productOrders?.map((product) => (
                                                                <div
                                                                    key={product._id}
                                                                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
                                                                >

                                                                    <div className="flex gap-4 items-center">
                                                                        {/* <img
                                                    src={product.image}
                                                    alt=""
                                                    className="w-20 h-20 rounded-lg border object-cover"
                                                    /> */}

                                                                        <div>
                                                                            <h3 className="text-2xl font-semibold text-gray-700">
                                                                                {product.name}
                                                                            </h3>

                                                                        </div>

                                                                        <div className="ml-auto text-right">
                                                                            <p className="font-semibold text-lg text-gray-700">
                                                                                Subtotal: ₹{product.totalPrice}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* PACKAGING TABLE */}
                                                                    <table className="w-full mt-4 text-sm border rounded-lg overflow-hidden">
                                                                        <thead className="bg-gray-200 text-gray-700">
                                                                            <tr>
                                                                                <th className="p-2 border">Qty</th>
                                                                                <th className="p-2 border">Price</th>
                                                                                <th className="p-2 border">Unit</th>
                                                                                <th className="p-2 border">Order Qty</th>
                                                                                <th className="p-2 border">Total</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody>
                                                                            {product.packaging.map((pk, index) => (
                                                                                <tr key={index} className="text-center bg-white">
                                                                                    <td className="p-2 border">{pk.productQuentity}</td>
                                                                                    <td className="p-2 border">₹{pk.unitPrice}</td>
                                                                                    <td className="p-2 border">{pk.orderUnit}</td>
                                                                                    <td className="p-2 border">{pk.orderQuentity}</td>
                                                                                    <td className="p-2 border font-semibold">₹{pk.orderPrice}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>

                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                    <div>
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={(e) => { e.stopPropagation(); DownloadSingleOrderApi(order._id) }}
                                                            className='rounded px-3 py-1 bg-lime-300'
                                                        >
                                                            Download
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>

                                    </div>
                                </>)
                            })}
                        </div>}



                    </div>
                </div>
            )}

        </div >
    )
}