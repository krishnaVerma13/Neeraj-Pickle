import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomizeOrderPG() {
    const navigator = useNavigate()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
   
    const [orderText, setOrderText] = useState("");
  const [orders, setOrders] = useState([]);

  // ADD ORDER
  const handleAddOrder = () => {
    if (orderText.trim() === "") return;

    setOrders([
      ...orders,
      { text: orderText.trim(), editing: false }
    ]);

    setOrderText("");
  };
  // console.log("orders :",orders);
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Create Your Custom Order
      </h1>

      {/* INPUT BOX */}
      <div className="w-full max-w-xl bg-white shadow-lg p-4 rounded-2xl">
        <textarea
          value={orderText}
          onChange={(e) => setOrderText(e.target.value)}
          placeholder="Write your order here..."
          className="w-full h-32 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleAddOrder}
          className="mt-3 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"
        >
          Add Order
        </button>
      </div>

      {/* ORDERS LIST */}
      <div className="w-full max-w-xl mt-6 space-y-4">
        {orders.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-md rounded-xl border-l-4 border-blue-600 flex flex-col gap-3"
          >
            {/* VIEW MODE */}
            {!item.editing && (
              <p className="text-gray-800 whitespace-pre-line text-lg leading-relaxed">
                {item.text}
              </p>
            )}

            {/* EDIT MODE */}
            {item.editing && (
              <textarea
                value={item.text}
                onChange={(e) => {
                  const updated = [...orders];
                  updated[index].text = e.target.value;
                  setOrders(updated);
                }}
                className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              {!item.editing ? (
                <button
                  onClick={() => {
                    const updated = [...orders];
                    updated[index].editing = true;
                    setOrders(updated);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 active:scale-95"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => {
                    const updated = [...orders];
                    updated[index].editing = false;
                    setOrders(updated);
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95"
                >
                  Save
                </button>
              )}

              <button
                onClick={() => {
                  const updated = orders.filter((_, i) => i !== index);
                  setOrders(updated);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div>
            {orders.length >0 ? <div>
                <button
                onClick={() => {navigator('/orderForm', { state: { TextOrder : orders , Ordertype : "customize"} }) }}
                className="mt-3 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition-all"

              >
                Place Order
              </button>
            </div>:" "}
        </div>
      </div>
    </div>
  );
}

export default CustomizeOrderPG;