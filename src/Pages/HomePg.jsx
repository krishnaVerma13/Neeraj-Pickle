import React, { useState } from "react";
import pro1 from "../Assets/productImg/Aachar.png"
import pro2 from "../Assets/productImg/Aachar2.png"
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";

const HomePg = () => {
    const navigator = useNavigate()
    const [DetailCard, setDetailCard] = useState("close")
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
  {/* --------- Navbar ---------- */}
 <Navbar/>

  {/* -------- Product Card Section ------------- */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 justify-items-center">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        onClick={() => setDetailCard("open")}
        className="w-[160px] sm:w-[180px] h-56 p-3 bg-slate-200 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
      >
        <div className="h-2/3 w-full rounded-2xl overflow-hidden">
          <img src={pro2} className="w-full h-full object-cover rounded-xl" alt="product" />
        </div>
        <div className="flex-1 flex flex-col justify-between mt-2">
          <div>
            <p className="text-base font-semibold truncate">Aachar (अचार)</p>
            <p className="text-sm font-light">200gm, 500gm...</p>
          </div>
          <p className="text-right text-base font-bold text-[#32CD32]">Rs.120</p>
        </div>
      </div>
    ))}
  </div>

  {/* -------- Product Detail Card (Popup) -------- */}
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
        <h2 className="text-xl font-bold mb-3">Aachar (अचार)</h2>

        {/* Quantity Options */}
        <div className="space-y-3">
          {[
            { size: "200gm", price: "Rs.90" },
            { size: "500gm", price: "Rs.150" },
            { size: "1kg", price: "Rs.290" },
          ].map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-center text-sm sm:text-base">
              <p>{item.size}</p>
              <p>{item.price}</p>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  className="w-14 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-lime-500"
                />
                <span>kg</span>
              </div>
            </div>
          ))}
          <p>Total price: <span className="text-lime-700 font-bold ">Rs.500</span> </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => setDetailCard("close")}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-white bg-lime-600 hover:bg-lime-700 rounded-xl font-semibold">
            Add to List
          </button>
        </div>
      </div>
    </div>
  )}
</div>

    );
};

export default HomePg;
