import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreateOrderApi from "../api/AuthAPI/CreateOrderApi";
import CreateCustomizeOrderApi from "../api/AuthAPI/CreateCustomizeOrderApi";
import Swal from "sweetalert2";
import ButtonLoader from '../Component/ButtonLoader'
import html2canvas from "html2canvas";



export default function OrderFormPg() {
    const [orderResp ,setorderResp] = useState({})
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate()
    const [formData, setFormData] = useState({
        Name: "",
        phone: "",
        city: "",
        transportation: "",
        gstType: "",
        address: ""
    });

    const [FinalOrder, setFinalOrder] = useState({
        firmName: "",
        phoneNo: "",
        city: "",
        transportation: "",
        GST: "",
        address: "",
        productOrders: [],
        totalProductAmount: ""
    })
    const [localData, setLocalData] = useState(null); // Store all Order product

    //get total bill 
    const location = useLocation()
    const TotalBill = location.state?.TotalBill;
    const { TextOrder, Ordertype } = location.state;
    // console.log("order text:",TextOrder);
    // console.log("order type:",Ordertype);

    const [AllTextOrder, setAllTextOrder] = useState([]) // Store All text order


    // Fetch data from localStorage
    useEffect(() => {
        window.scrollTo(0, 0)
        const savedData = JSON.parse(localStorage.getItem("cartList"));
        // console.log(savedData);

        if (savedData) {
            setLocalData(savedData);
        }
        setAllTextOrder(TextOrder?.map((item) => item.text))
    }, []);

    // Handle Change (all input updates)
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //Take automatic screen short function
    const captureAndDownload = async () => {
        const element = document.getElementById("order-receipt");
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#ffffff",

            onclone: (clonedDoc) => {
                // 🔥 REMOVE ALL EXTERNAL CSS (Tailwind, FontAwesome)
                clonedDoc.querySelectorAll("link, style").forEach(el => el.remove());

                // 🔥 FORCE SAFE STYLES
                const clonedEl = clonedDoc.getElementById("order-receipt");
                if (clonedEl) {
                    clonedEl.style.all = "unset";
                    clonedEl.style.fontFamily = "Arial";
                    clonedEl.style.color = "#000";
                    clonedEl.style.background = "#fff";
                    clonedEl.style.padding = "16px";
                    clonedEl.style.border = "1px solid #ddd";
                    clonedEl.style.borderRadius = "8px";
                    clonedEl.style.width = "100px";
                }

                // 🔥 FORCE BODY COLOR (THIS FIXES okLCH)
                clonedDoc.body.style.background = "#ffffff";
                clonedDoc.documentElement.style.background = "#ffffff";
            }
        });

        const png = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = png;
        link.download = `order-${Date.now()}.png`;
        link.click();
    };

   


    // Handle Submit
    const handleSubmit = async (e) => {
        // if(loading) return;
        e.preventDefault();
        setLoading(true)
        // console.log("local data :", localData);
        // console.log("form data :", formData);
        // console.log("Total bill :", TotalBill);

        const lastbill = {
            firmName: formData.Name,
            phoneNo: formData.phone,
            city: formData.city,
            transportation: formData.transportation,
            GST: formData.gstType,
            address: formData.address,
            productOrders: localData,
            totalBill: TotalBill
        };
        // console.log("last bill", lastbill);

        const resp = await CreateOrderApi(lastbill);
        // console.log("responce :", resp);

        if (!resp.data) {
            return Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Something went wrong!",
            });
        }

        setorderResp(resp.data)
        setLoading(false)
         // open whatsApp on onClick
    const openWhatsApp = () => {
        console.log("order detail alert ====== :",resp.data);

        const phoneNumber = "919407391999"; // country code + number
        const message = `
        Order is Confirmed 
        Order Id : ${resp.data.orderId}
        Name : ${resp.data.firmName}
        City : ${resp.data.city}
        Transportation : ${resp.data.transportation}
        `;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        navigator('/')
    };
        
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Order Placed Successfully!",
            showConfirmButton: false,
            timer: 2000,
            width: "450px"
        }).then(() => {
            // navigator("/")
        }).then(() => {
            // console.log("order detail alert :",orderResp);

            Swal.fire({
                title: "Order Confirmed 🎉",
                html: `
    <div id="order-receipt">
      <p style="font-size:18px;font-weight:bold;text-align:center;">
        Order Confirm
      </p>
      <p>Order Id : <b>${resp.data.orderId}</b></p>
      <p>Name : <b>${resp.data.firmName}</b></p>
      <p>City : <b>${resp.data.city}</b></p>
      <p>Transportation : <b>${resp.data.transportation}</b></p>

      <button
        id="download-btn"
        style="margin-top:10px;width:100%;padding:8px;background:#22c55e;color:white;border:none;border-radius:6px;"
      >
        Download Screenshot
      </button>
      <button
        id="GoToWhatsApp"
        style="margin-top:10px;width:100%;padding:8px;background:#22c55e;color:white;border:none;border-radius:6px;"
      >
        Go to WhatsApp
      </button>
    </div>
  `,
                showConfirmButton: false,
                allowOutsideClick: false,   // 🔒 disable outside click close
                allowEscapeKey: false,      // 🔒 disable ESC key
                allowEnterKey: false,
                didOpen: () => {
                    document
                        .getElementById("download-btn")
                        .addEventListener("click", async () => {
                            await captureAndDownload(); // screenshot + download
                            // Swal.close();               // ✅ close ONLY after click

                        });
                    document.getElementById("GoToWhatsApp").addEventListener("click", ()=>{openWhatsApp() ;  Swal.close();})
                }
            });
        })
    };

    // Customize Order Handle Submit
    const customizeHandleSubmit = async (e) => {
        // if(loading) return;
        e.preventDefault();
        setLoading(true)
        // console.log("form data :", formData);
        // console.log("text Order :", AllTextOrder);

        const lastbill = {
            firmName: formData.Name,
            phoneNo: formData.phone,
            city: formData.city,
            transportation: formData.transportation,
            GST: formData.gstType,
            address: formData.address,
            textOrder: AllTextOrder,
        };
        console.log("last bill", lastbill);

        const resp = await CreateCustomizeOrderApi(lastbill);
        console.log("responce :", resp);

        if (!resp.data) {
            return Swal.fire({
                icon: "error",
                title: "Network error",
                text: "Something went wrong!",

            });
        }
        setLoading(false)
        setorderResp(resp.data)

        // open whatsApp on onClick
    const openWhatsApp = () => {
        // console.log("order detail alert ====== :",resp.data);

        const phoneNumber = "919407391999"; // country code + number
        const message = `
        Order is Confirmed 
        Order Id : ${resp.data.orderId}
        Name : ${resp.data.firmName}
        City : ${resp.data.city}
        Transportation : ${resp.data.transportation}
        `;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        navigator('/')
    };

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Order Placed Successfully!",
            showConfirmButton: false,
            timer: 2000,
            width: "450px"
        }).then(() => {
            navigator("/")
        }).then(() => {
            // console.log("order detail alert :",orderResp);
            
            Swal.fire({
                title: "Order Confirmed 🎉",
                html: `
    <div id="order-receipt">
      <p style="font-size:18px;font-weight:bold;text-align:center;">
        Order Confirm
      </p>
      <p>Order Id : <b>${resp.data.orderId}</b></p>
      <p>Name : <b>${resp.data.firmName}</b></p>
      <p>City : <b>${resp.data.city}</b></p>
      <p>Transportation : <b>${resp.data.transportation}</b></p>

      <button
        id="download-btn"
        style="margin-top:10px;width:100%;padding:8px;background:#22c55e;color:white;border:none;border-radius:6px;"
      >
        Download Screenshot
      </button>
       <button
        id="GoToWhatsApp"
        style="margin-top:10px;width:100%;padding:8px;background:#22c55e;color:white;border:none;border-radius:6px;"
      >
        Go to WhatsApp
      </button>
    </div>
  `,
                showConfirmButton: false,
                allowOutsideClick: false,   // 🔒 disable outside click close
                allowEscapeKey: false,      // 🔒 disable ESC key
                allowEnterKey: false,
                didOpen: () => {
                    document
                        .getElementById("download-btn")
                        .addEventListener("click", async () => {
                            await captureAndDownload(); // screenshot + download
                            // Swal.close();               // ✅ close ONLY after click
                        });
                    document.getElementById("GoToWhatsApp").addEventListener("click", ()=>{openWhatsApp() ;  Swal.close();})

                }
            });
        })

    };

    

    

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 md:py-20 flex justify-center">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">

                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Place Your Order
                </h2>

                <form onSubmit={Ordertype == "customize" ? customizeHandleSubmit : handleSubmit} className="space-y-4">

                    {/* Firm Name */}
                    <div>
                        <label className="block font-medium text-gray-700">Firm Name</label>
                        <input
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            placeholder="Enter firm name"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block font-medium text-gray-700">Phone Number (WhatsApp no.)</label>
                        <input
                            type="number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter WhatsApp number"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Transportation */}
                    <div>
                        <label className="block font-medium text-gray-700">Transportation</label>
                        <input
                            type="text"
                            name="transportation"
                            value={formData.transportation}
                            onChange={handleChange}
                            placeholder="Enter transportation"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>


                    {/* GST / URD */}
                    <div>
                        <label className="block font-medium text-gray-700">GST \ UID</label>
                        <input
                            type="text"
                            name="gstType"
                            value={formData.gstType}
                            onChange={handleChange}
                            placeholder="Enter GST \ UID"
                            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    {/* Address */}
                    <div>
                        <label className="block font-medium text-gray-700">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            className="w-full mt-1 p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        {loading ? <ButtonLoader color="White" /> : "Place Order"}
                    </button>

                </form>
            </div>

        </div>
    );
}
