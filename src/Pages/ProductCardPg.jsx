import React, { useState } from "react";

// ProductCard.jsx
// Single-file React component (Tailwind CSS) to show a product with multiple
// packaging options, rates and box quantities. Non-technical-friendly UI.
// How to use: import ProductCard and pass a `product` prop or use the sample
// `sampleProduct` below. Requires Tailwind CSS in your project.

export default function ProductCard({ product = sampleProduct }) {
  const [selectedOptionId, setSelectedOptionId] = useState(
    product.packaging[0].id
  );
  const [quantities, setQuantities] = useState({}); // { optionId: qty }
  const [cart, setCart] = useState([]);

  function changeQty(optionId, delta) {
    setQuantities((q) => {
      const prev = q[optionId] || 0;
      const next = Math.max(0, prev + delta);
      return { ...q, [optionId]: next };
    });
  }

  function addToCart(optionId) {
    const qty = quantities[optionId] || 0;
    if (qty <= 0) return;
    const option = product.packaging.find((p) => p.id === optionId);
    setCart((c) => [...c, { ...option, qty }]);
    // reset qty for that option
    setQuantities((q) => ({ ...q, [optionId]: 0 }));
  }

  function removeFromCart(index) {
    setCart((c) => c.filter((_, i) => i !== index));
  }

  const selected = product.packaging.find((p) => p.id === selectedOptionId);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow p-4 md:flex md:gap-6">
        {/* Image */}
        <div className="w-full md:w-1/3 flex items-center justify-center">
          <img
            src={'/mnt/data/WhatsApp Image 2025-11-19 at 14.15.35_db269e28.jpg'}
            alt={product.name}
            className="h-40 w-40 object-contain rounded-lg"
          />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{product.subtitle}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div className="font-medium">Category</div>
              <div>{product.category}</div>
            </div>
          </div>

          {/* Packaging options - radio list */}
          <div className="mt-4">
            <h3 className="font-medium">Available packaging</h3>
            <p className="text-xs text-gray-600">Select a pack to see price</p>

            <div className="mt-3 grid gap-2">
              {product.packaging.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-shadow hover:shadow-sm
                    ${selectedOptionId === opt.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`pack-${product.id}`}
                      checked={selectedOptionId === opt.id}
                      onChange={() => setSelectedOptionId(opt.id)}
                      className="h-4 w-4 text-orange-500"
                    />

                    <div>
                      <div className="text-sm font-medium">{opt.size}</div>
                      <div className="text-xs text-gray-500">{opt.unit} • {opt.perBoxQty} per box</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">₹{opt.rate}</div>
                    <div className="text-xs text-gray-500">per {opt.unit}</div>
                  </div>
                </label>
              ))} 
            </div>
          </div>

          {/* Quick-order controls for selected option */}
          <div className="mt-4 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm">Selected:</div>
              <div className="px-3 py-2 rounded bg-gray-100 text-sm">
                {selected.size} • ₹{selected.rate}
              </div>


              <div className="ml-6 text-sm text-gray-600">Choose qty:</div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => changeQty(selected.id, -1)}
                  className="px-2 py-1 rounded border"
                  aria-label="decrease"
                >
                  -
                </button>
                <div className="min-w-[2rem] text-center">{quantities[selected.id] || 0}</div>
                <button
                  onClick={() => changeQty(selected.id, 1)}
                  className="px-2 py-1 rounded border"
                  aria-label="increase"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToCart(selected.id)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 disabled:opacity-50"
                disabled={(quantities[selected.id] || 0) <= 0}
              >
                Add to cart
              </button>

              <button
                onClick={() => {
                  // quick order 1 unit
                  setQuantities((q) => ({ ...q, [selected.id]: (q[selected.id] || 0) + 1 }));
                }}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                Quick +1
              </button>
            </div>
          </div>

          {/* Cart / Selected items summary */}
          <div className="mt-4">
            <h4 className="font-medium">Order preview</h4>
            {cart.length === 0 ? (
              <div className="text-sm text-gray-500 mt-2">No items yet. Add packaging options to cart.</div>
            ) : (
              <div className="mt-2 space-y-2">
                {cart.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{product.name} • {it.size}</div>
                      <div className="text-xs text-gray-500">{it.unit} • {it.perBoxQty} per box</div>
                      <div className="text-xs text-gray-600">Qty: {it.qty}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{it.rate * it.qty}</div>
                      <div className="mt-2 flex gap-2 justify-end">
                        <button onClick={() => removeFromCart(idx)} className="text-xs text-red-500">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-2">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-lg font-semibold">₹{cart.reduce((s, it) => s + it.rate * it.qty, 0)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Helpful notes for non-technical user */}
      <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded">
        Tip: Each packaging (100g, 200g, 1kg, 5kg...) has its own price and number of pieces that fit in a box.
        Choose the packaging you want, set quantity (how many packages), then "Add to cart". You can add multiple pack types of the same product.
      </div>
    </div>
  );
}

// -----------------
// Sample product data (replace with your real data)
// -----------------
const sampleProduct = {
  id: "mango-pickle-01",
  name: "Mango Pickle (आम अचार)",
  subtitle: "Homemade spicy mango pickle",
  category: "Pickle",
  image: "/mnt/data/WhatsApp Image 2025-11-19 at 16.03.09_cec96809.jpg",
  packaging: [
    { id: "p1", size: "100 GM", rate: 16, unit: "JAR", perBoxQty: "90" },
    { id: "p2", size: "200 GM", rate: 27, unit: "JAR", perBoxQty: "60" },
    { id: "p3", size: "500 GM", rate: 52, unit: "JAR", perBoxQty: "40" },
    { id: "p4", size: "1 KG", rate: 95, unit: "JAR", perBoxQty: "20" },
    { id: "p5", size: "5 KG", rate: 375, unit: "JAR", perBoxQty: "4" },
  ],
};
