import React, { useState } from "react";
import pro2 from '../Assets/productImg/Aachar2.png'

function OrderList() {
    const [Detail , setDetail] = useState()
    const productData = [
        { weight: "200gm", price: "Rs.80", quantity: "10kg", amount: "Rs.1500" },
        { weight: "500gm", price: "Rs.140", quantity: "5kg", amount: "Rs.700" },
        { weight: "1kg", price: "Rs.250", quantity: "2kg", amount: "Rs.500" },
    ];
    return (
        <>
            <div className="w-full p-2 py-20 ">
                <div className=" md:flex md:justify-center md:flex-col space-y-3 mx-auto">

                    <div className="w-full md:w-2/3 flex flex-col md:flex-row bg-slate-100 rounded-lg overflow-hidden shadow-md border border-gray-200">
                        {/* Right Table Section */}
                        <div className="w-full   bg-lime-50 p-2">

                            {/* ------- Image and Button ---------------- */}
                            <div className="flex">
                                <div>
                                    <img
                                        src={pro2}
                                        alt="product"
                                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
                                    />
                                    <div className="flex justify-end space-x-2 mt-3">
                                        <button className="bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600">
                                            Cancel
                                        </button>
                                        <button className="bg-lime-500 text-white text-xs px-2 py-1 rounded-md hover:bg-lime-600">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                {/* -------------- Name and Table ------------ */}
                                <div className="overflow-x-auto w-full px-1 space-y-1 ">
                                    <div className="flex">
                                        <div>
                                            <div className="">
                                                <p className="whitespace-nowrap">Achar (अचार)</p>

                                            </div>
                                        </div>
                                        <div className="w-full flex justify-end items-end ">
                                            <p className=" ">Total: <span className="text-lime-700 font-bold ">Rs.2700</span> </p>
                                        </div>

                                    </div>
                                    <table className="w-full border-gray-300 rounded-md">
                                        {/* Table Header */}
                                        <thead className="bg-cyan-900 text-white text-xs">
                                            <tr>
                                                <th className="py-1 px-1 text-left">Weight</th>
                                                <th className="py-1 px-1 text-left">Price</th>
                                                <th className="py-1 px-1 text-left">Qty</th>
                                                <th className="py-1 px-1 text-left">Amt</th>
                                            </tr>
                                        </thead>

                                        {/* Table Body */}
                                        <tbody className="bg-transparent text-gray-700 text-xs">
                                            {[
                                                { weight: "200gm", price: "Rs.80", quantity: "10kg", amount: "Rs.1500" },
                                                { weight: "500gm", price: "Rs.140", quantity: "5kg", amount: "Rs.700" },
                                                { weight: "1kg", price: "Rs.250", quantity: "2kg", amount: "Rs.500" },
                                            ].map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-t hover:bg-gray-100 transition duration-200"
                                                >
                                                    <td className="py-1 px-1">{item.weight}</td>
                                                    <td className="py-1 px-1">{item.price}</td>
                                                    <td className="py-1 px-1">{item.quantity}</td>
                                                    <td className="py-1 px-1">{item.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col md:flex-row bg-slate-100 rounded-lg overflow-hidden shadow-md border border-gray-200">
                        {/* Right Table Section */}
                        <div className="w-full   bg-lime-50 p-2">

                            {/* ------- Image and Button ---------------- */}
                            <div className="flex">
                                <div>
                                    <img
                                        src={pro2}
                                        alt="product"
                                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
                                    />
                                    <div className="flex justify-end space-x-2 mt-3">
                                        <button className="bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600">
                                            Cancel
                                        </button>
                                        <button className="bg-lime-500 text-white text-xs px-2 py-1 rounded-md hover:bg-lime-600">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                {/* -------------- Name and Table ------------ */}
                                <div className="overflow-x-auto w-full px-1 space-y-1 ">
                                    <div className="flex">
                                        <div>
                                            <div className="">
                                                <p className="whitespace-nowrap">Achar (अचार)</p>

                                            </div>
                                        </div>
                                        <div className="w-full flex justify-end items-end ">
                                            <p className=" ">Total: <span className="text-lime-700 font-bold ">Rs.2700</span> </p>
                                        </div>

                                    </div>
                                    <table className="w-full border-gray-300 rounded-md">
                                        {/* Table Header */}
                                        <thead className="bg-cyan-900 text-white text-xs">
                                            <tr>
                                                <th className="py-1 px-1 text-left">Weight</th>
                                                <th className="py-1 px-1 text-left">Price</th>
                                                <th className="py-1 px-1 text-left">Qty</th>
                                                <th className="py-1 px-1 text-left">Amt</th>
                                            </tr>
                                        </thead>

                                        {/* Table Body */}
                                        <tbody className="bg-transparent text-gray-700 text-xs">
                                            {[
                                                { weight: "200gm", price: "Rs.80", quantity: "10kg", amount: "Rs.1500" },
                                                { weight: "500gm", price: "Rs.140", quantity: "5kg", amount: "Rs.700" },
                                                { weight: "1kg", price: "Rs.250", quantity: "2kg", amount: "Rs.500" },
                                            ].map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-t hover:bg-gray-100 transition duration-200"
                                                >
                                                    <td className="py-1 px-1">{item.weight}</td>
                                                    <td className="py-1 px-1">{item.price}</td>
                                                    <td className="py-1 px-1">{item.quantity}</td>
                                                    <td className="py-1 px-1">{item.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col md:flex-row bg-slate-100 rounded-lg overflow-hidden shadow-md border border-gray-200">
                        {/* Right Table Section */}
                        <div className="w-full   bg-lime-50 p-2">

                            {/* ------- Image and Button ---------------- */}
                            <div className="flex">
                                <div>
                                    <img
                                        src={pro2}
                                        alt="product"
                                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
                                    />
                                    <div className="flex justify-end space-x-2 mt-3">
                                        <button className="bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600">
                                            Cancel
                                        </button>
                                        <button className="bg-lime-500 text-white text-xs px-2 py-1 rounded-md hover:bg-lime-600">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                {/* -------------- Name and Table ------------ */}
                                <div className="overflow-x-auto w-full px-1 space-y-1 ">
                                    <div className="flex">
                                        <div>
                                            <div className="">
                                                <p className="whitespace-nowrap">Achar (अचार)</p>

                                            </div>
                                        </div>
                                        <div className="w-full flex justify-end items-end ">
                                            <p className=" ">Total: <span className="text-lime-700 font-bold ">Rs.2700</span> </p>
                                        </div>

                                    </div>
                                    <table className="w-full border-gray-300 rounded-md">
                                        {/* Table Header */}
                                        <thead className="bg-cyan-900 text-white text-xs">
                                            <tr>
                                                <th className="py-1 px-1 text-left">Weight</th>
                                                <th className="py-1 px-1 text-left">Price</th>
                                                <th className="py-1 px-1 text-left">Qty</th>
                                                <th className="py-1 px-1 text-left">Amt</th>
                                            </tr>
                                        </thead>

                                        {/* Table Body */}
                                        <tbody className="bg-transparent text-gray-700 text-xs">
                                            {[
                                                { weight: "200gm", price: "Rs.80", quantity: "10kg", amount: "Rs.1500" },
                                                { weight: "500gm", price: "Rs.140", quantity: "5kg", amount: "Rs.700" },
                                                { weight: "1kg", price: "Rs.250", quantity: "2kg", amount: "Rs.500" },
                                            ].map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-t hover:bg-gray-100 transition duration-200"
                                                >
                                                    <td className="py-1 px-1">{item.weight}</td>
                                                    <td className="py-1 px-1">{item.price}</td>
                                                    <td className="py-1 px-1">{item.quantity}</td>
                                                    <td className="py-1 px-1">{item.amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-3xl md:m-5 m-2">Total bill : Rs.8100</p>
                </div>
                <div className="w-full flex justify-center py-10">
                    <button className="bg-sky-600 text-white font-semibold py-3 w-3/4 rounded-lg">
                        Order
                    </button>
                </div>
            </div>


        </>
    )
}

export default OrderList;