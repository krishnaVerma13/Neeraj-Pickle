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

export default function AllOrders() {
    const [loading, setLoading] = useState(false); // Login on\off
    const [AllOrders, setAllOrders] = useState() //Store all Order data
    const [ShowOrder, setShowOrder] = useState(false) // show customize data on\off
    const [OrderText, setOrderText] = useState()

    const getorder = async () => {
        setLoading(true)
        const data = await getAllOrderApi()
        console.log("all orders :", data.data);
        setAllOrders(data.data)

        const customizeData = await getAllCustomizeOrderApi()
        if (!customizeData) {

            return Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Customize data not found",

            });
        }
        setOrderText(customizeData.data)
        console.log("customize data :", customizeData.data);

        setLoading(false)
    }

    const UpdateState = async (id, state, index) => {
        try {
            console.log("updating status:", state, "id:", id, "index:", index);
            const payload = { orderStatus: state };

            const res = await updateOrderStatusApi(id, payload); // axios or fetch wrapper

            // Normalize the updated order from response (works for many response shapes)
            const updatedOrder = res?.data?.data ?? res?.data ?? res;
            console.log("api returned:", updatedOrder);

            // 1) Update state by matching id (recommended — index may be unreliable)
            setAllOrders(prev => prev.map(item => (item._id === id ? updatedOrder : item)));
        } catch (err) {
            console.error("update failed", err);
            alert("");
            Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Could not update order status. Try again.",

            });
        }
    };

    const DeleteOrder = async (id, index) => {
        console.log("id : ", id);

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
                    text: "Product has been removed .",
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

                // 🔥 Remove item from AllOrders in UI
                setAllOrders(prev => prev.filter((order) => order._id !== id));
            }
        })
    };


    // ================ Customize Order ==========================
    const custUpdateState = async (id, state, index) => {
        try {
            console.log("updating status:", state, "id:", id, "index:", index);
            const payload = { orderStatus: state };

            const res = await UpdateCustomizeOrderStateApi(id, payload); // axios or fetch wrapper

            // console.log("api returned:", res);
            // Normalize the updated order from response (works for many response shapes)
            const updatedOrder = res?.data;

            // // 1) Update state by matching id (recommended — index may be unreliable)
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
        // console.log("id : ", id);
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
                    text: "Product has been removed .",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                const deleteRes = await DeleteCustomizeOrderApi(id);
                if (!deleteRes) {
                    return alert("Something went wrong!");
                }
                // 🔥 Remove item from AllOrders in UI
                setOrderText(prev => prev.filter((order) => order._id !== id));
            }
        });
    };


    useState(() => {

        getorder()
    }, [])



    return (
        <div className="bg-white rounded shadow p-4">
            {/* <OrderTable orders={orders} /> */}
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
                                <button className='flex' onClick={() => getorder()} >
                                    refresh
                                    <HiRefresh className='text-2xl ' />
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
                                                            <dic className="flex space-x-10 ">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">City: {order.city}</p>
                                                                    <p className="text-sm text-gray-500">Phone: {order.phoneNo}</p>
                                                                </div>
                                                                <dic>
                                                                    <p className="text-sm text-gray-500">GST: {order.GST}</p>
                                                                    <p className="text-sm text-gray-500">Transportation: {order.transportation}</p>
                                                                </dic>
                                                            </dic>
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
                                                            <button className='px-2 py-1 bg-lime-300 rounded text-xs'
                                                                onClick={() => custUpdateState(order._id, "accept", index)}
                                                            >Accept</button>
                                                            <button
                                                                onClick={() => custUpdateState(order._id, "reject", index)}
                                                                className='px-2 py-1 bg-red-400 rounded text-xs'>Reject</button>
                                                            <button
                                                                onClick={() => custDeleteOrder(order._id, index)}
                                                                className='px-2 py-1 bg-red-600 rounded text-xs'>Delete</button>
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
                                                        <button
                                                            onClick={() => DownloadCustomOrderApi(order._id)}
                                                            className='rounded px-3 py-1 bg-lime-300'
                                                        >
                                                            Download
                                                        </button>
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
                                                            <dic className="flex space-x-10 ">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">City: {order.city}</p>
                                                                    <p className="text-sm text-gray-500">Phone: {order.phoneNo}</p>
                                                                </div>
                                                                <dic>
                                                                    <p className="text-sm text-gray-500">GST: {order.GST}</p>
                                                                    <p className="text-sm text-gray-500">Transportation: {order.transportation}</p>
                                                                </dic>

                                                            </dic>
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
                                                            <button className='px-2 py-1 bg-lime-300 rounded text-xs'
                                                                onClick={() => UpdateState(order._id, "accept", index)}
                                                            >Accept</button>
                                                            <button
                                                                onClick={() => UpdateState(order._id, "reject", index)}
                                                                className='px-2 py-1 bg-red-400 rounded text-xs'>Reject</button>
                                                            <button
                                                                onClick={() => DeleteOrder(order._id, index)}
                                                                className='px-2 py-1 bg-red-600 rounded text-xs'>Delete</button>
                                                        </div>
                                                    </div>
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {/* PRODUCT DETAILS */}
                                                <div className="space-y-6">
                                                    {order.productOrders.map((product) => (
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
                                                    <div>
                                                        <button
                                                            onClick={() => DownloadSingleOrderApi(order._id)}
                                                            className='rounded px-3 py-1 bg-lime-300'
                                                        >
                                                            Download
                                                        </button>
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