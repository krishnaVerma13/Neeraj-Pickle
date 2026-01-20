import React, { useEffect, useState } from "react";
import pro2 from '../Assets/productImg/Aachar2.png'
import { API_URL } from "../api/NwConfig";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";
import Swal from "sweetalert2";

function OrderList() {
    const [loading, setLoading] = useState(false);

    const navigator = useNavigate()
    const [OrderPL, setOrderPL] = useState([])
    const [TotalBill, setTotalBill] = useState(0)
    const [DetailCard, setDetailCard] = useState("close") // open and close modal
    const [productdetail, setProductDetail] = useState({}) // take product detail for modal

    const [OrderPD, setOrderPD] = useState(
        {
            name: "",
            packeging: [
                {
                    productQuentity: '',
                    price: '',
                    orderUnit: '',
                    orderQuentity: '',
                    orderPrice: ''
                }
            ],
            totalProductAmount: "" //this is the sum of all packeging orderPrice 
        }
    );

    const handleAddToList = () => {
        const productToStore = {
            productId: productdetail.productId,
            name: productdetail.name,
            image: productdetail.image,
            packaging: [],
            totalPrice: productdetail.totalProductAmount
        };

        // pick only rows with quantity > 0
        productdetail.packaging.forEach(p => {
            if (p.orderQuentity && Number(p.orderQuentity) > 0) {
                productToStore.packaging.push({
                    productQuentity: p.productQuentity,
                    orderUnit: p.orderUnit,
                    unitPrice: p.unitPrice,
                    orderQuentity: p.orderQuentity,
                    orderPrice: p.orderPrice
                });
            }
        });

        // Get old data
        let existing = JSON.parse(localStorage.getItem("cartList")) || [];

        // Check if product already exists
        const index = existing.findIndex(item => item.productId === productdetail.productId);

        if (index !== -1) {
            existing[index] = productToStore; // update
        } else {
            existing.push(productToStore); // add
        }

        // Save back to localStorage
        localStorage.setItem("cartList", JSON.stringify(existing));

        // console.log("Saved Product:", productToStore);
        console.log("Updated Cart:");
        getOrderList();
        setDetailCard("close");
    };

    // packaging form change
    const handlePackegChange = (index, e) => {
        const { name, value } = e.target;

        setProductDetail(prev => {
            // copy packaging array
            const updatedPack = [...prev.packaging];

            // get current product safely from prev
            const product = updatedPack[index];

            // update field
            const updatedProduct = {
                ...product,
                [name]: value
            };

            // calculate orderPrice using updated values
            const unitPrice = Number(updatedProduct.unitPrice || 0);
            const orderQuantity = Number(updatedProduct.orderQuentity || 0);

            updatedProduct.orderPrice = unitPrice * orderQuantity;

            updatedPack[index] = updatedProduct;

            // calculate total
            const total = updatedPack.reduce(
                (sum, p) => sum + Number(p.orderPrice || 0),
                0
            );

            return {
                ...prev,
                packaging: updatedPack, // ✅ fixed typo
                totalProductAmount: total
            };
        });
    };


    const removeFromList = (id) => {
        // get old data

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Remove!",
                    text: "Product has been removed .",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });

                // console.log("id :", id);

                const stored = JSON.parse(localStorage.getItem("cartList")) || [];
                // console.log("card list store :", stored);

                // filter out the item
                const updated = stored.filter(item => item.productId !== id);
                console.log("update store ");

                // save updated data back
                localStorage.setItem("cartList", JSON.stringify(updated));

                // update state also (so UI updates immediately)
                setOrderPL(updated);
                //calculate update bill
                calculatebill(updated)
            }
        });

    };

    const calculatebill = (data) => {
        const bill = data?.reduce((acc, curr) => acc + Number(curr.totalPrice || 0), 0);
        //  console.log("bill",bill);
        setTotalBill(bill)
    }
    const getOrderList = () => {
        setLoading(true)
        const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
        // console.log(cartList);
        setOrderPL(cartList)
        calculatebill(cartList)
        setLoading(false)

    }

    useEffect(() => {
        window.scrollTo(0, 0);

        getOrderList();
    }, [])

    // console.log("-----", OrderPL || "no");
    // console.log("product detail", productdetail || "no");
    // console.log("++", TotalBill);

    return (
        <>
            <div className="w-full p-2 py-20 ">
                {loading && <Loader />}
                {!loading && (<div>
                        {OrderPL?.length > 0 ? <div>
                    <div className=" md:flex md:justify-center md:flex-col space-y-3 mx-auto">
                        {OrderPL?.map((item, index) => {

                            return (<>
                                < div
                                key={index}
                                className="w-full md:w-2/3 flex flex-col md:flex-row bg-slate-100 rounded-lg overflow-hidden shadow-md border border-gray-200">
                                    {/* Right Table Section */}
                                    <div 
                                    // key={index} 
                                    className="w-full   bg-lime-50 p-2">

                                        {/* ------- Image and Button ---------------- */}
                                        <div className="flex">
                                            <div>
                                                <img
                                                    src={item?.image.url || pro2}
                                                    // src={pro2}
                                                    alt="product"
                                                    className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
                                                />
                                                <div className="flex justify-end space-x-2 mt-3">
                                                    <button
                                                        onClick={() => { removeFromList(item.productId) }}
                                                        className="bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => { setDetailCard("open"); setProductDetail(item); }}
                                                        className="bg-lime-500 text-white text-xs px-2 py-1 rounded-md hover:bg-lime-600">
                                                        Update
                                                    </button>
                                                </div>
                                            </div>

                                            {/* -------------- Name and Table ------------ */}
                                            <div className="overflow-x-auto w-full px-1 space-y-1 ">
                                                <div className="flex">
                                                    <div>
                                                        <div className="">
                                                            <p className="whitespace-nowrap">{item.name}</p>

                                                        </div>
                                                    </div>
                                                    <div className="w-full flex justify-end items-end ">
                                                        <p className=" ">Total: <span className="text-lime-700 font-bold ">Rs.{item.totalPrice}</span> </p>
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
                                                        {item.packaging.map((i, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-t hover:bg-gray-100 transition duration-200"
                                                            >
                                                                <td className="py-1 px-1">{i.productQuentity}</td>
                                                                <td className="py-1 px-1">{i.unitPrice}</td>
                                                                <td className="py-1 px-1">{i.orderQuentity}</td>
                                                                <td className="py-1 px-1">{i.orderPrice}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </>)
                        })}

                    </div>
                    <div className="m-2 md:m-5">
                        <p className="text-3xl font-serif  ">Total bill : Rs. {TotalBill || "Loading.."}</p>
                            <p>( परिवहन शुल्क अंतिम बिल में जोड़ा जाएगा। )</p>
                        <p>Transportation cost will be added to the final bill</p> 
                    </div>
                    </div> 
                    :
                    <div className="flex justify-center items-center w-full h-full">
                        <div className="text-center">
                    <h1 className="text-xl font-semibold">Order Product not found</h1>    
                        <p onClick={()=> navigator('/')} className="text-lg underline hover:cursor-pointer hover:font-semibold text-blue-600">Add to list Product</p>
                        </div>
                    </div>}

                    <div className="w-full flex justify-center py-10">
                       {TotalBill == 0 ? 
                        <button
                            onClick={() => navigator('/')}
                            className="bg-sky-600 text-white font-semibold py-3 w-3/4 rounded-lg">
                            Goto Home page 
                        </button>
                        :
                        <button
                            onClick={() => navigator('/orderForm', { state: { TotalBill: TotalBill } })}
                            className="bg-sky-600 text-white font-semibold py-3 w-3/4 rounded-lg">
                            Order
                        </button>
                        }
                    </div>

                    {DetailCard === "open" && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                            <div className="bg-white w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[85vh] rounded-xl overflow-y-auto relative p-4">
                                <button
                                    onClick={() => setDetailCard("close")}
                                    className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-black"
                                >
                                    ✕
                                </button>

                                <img src={pro2} className="w-full h-48 object-cover rounded-lg mb-4" alt="product" />
                                <h2 className="text-xl font-bold mb-3">{productdetail?.name}</h2>

                                {/* Quantity Options */}
                                <div className="space-y-3">
                                    {productdetail?.packaging.map((item, i) => (
                                        <label
                                            key={i}
                                            className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pinter transition-shadow hover:shadow-sm
                                       'border-orange-400 bg-orange-50`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="text-sm font-medium" >{item?.productQuentity}</div>
                                                    <div className="text-xs text-gray-500">{item?.orderUnit} • {item?.orderQuentity} per box</div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-sm font-semibold">₹{item?.unitPrice}</div>
                                                <div className="text-xs text-gray-500">per {item?.orderUnit}</div>
                                            </div>
                                            <div className="text-right flex">
                                                <div className="text-sm font-semibold">
                                                    <input
                                                        type="number"
                                                        name="orderQuentity"
                                                        value={item?.orderQuentity || ""}
                                                        onChange={(e) => handlePackegChange(i, e)}
                                                        className="w-14 rounded border border-gray-300 px-1 py-1 
                                             focus:outline-none focus:ring-0 focus:border-transparent "
                                                    />
                                                </div>
                                                <div className="text-sm font-semibold">
                                                    {item.orderUnit}

                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                    <p>Total price: <span className="text-lime-700 font-bold ">Rs.{productdetail?.totalPrice}</span> </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-center space-x-4 mt-6">
                                    <button
                                        onClick={() => setDetailCard("close")}
                                        className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleAddToList()}
                                        className="px-4 py-2 text-white bg-lime-600 hover:bg-lime-700 rounded-xl font-semibold"
                                    >
                                        Update Order
                                    </button>

                                </div>
                            </div>
                        </div>
                    )}
                </div>)}
            </div>


        </>
    )
}

export default OrderList;