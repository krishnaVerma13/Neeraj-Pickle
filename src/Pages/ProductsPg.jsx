import React, { useEffect, useState } from "react";
import pro1 from "../Assets/productImg/Aachar.png"
import pro2 from "../Assets/productImg/Aachar2.png"
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import getAllProductApi from "../api/AuthAPI/getAllproductApi";

const ProductsPg = () => {
  const navigator = useNavigate()
  const [DetailCard, setDetailCard] = useState("close") // open and close modal
  const [productdetail, setProductDetail] = useState({}) // take product detail for modal
  const [AllProductData, setAllProductData] = useState([]) //take all products data
  const [CalcuPrice, setCalcuPrice] = useState()
  // console.log("all product :", AllProductData);
  const { state } = useLocation();
  // console.log("category name :", state);

  //surch
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(state.category);

  //surch funcition 
  const filteredData = AllProductData?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter
      ? item.category.toLowerCase() === categoryFilter.toLowerCase()
      : true; // no filter → show all

    return matchesSearch && matchesCategory;
  });

  // -------------------------------------------
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



  // packaging form change
 const handlePackegChange = (index, e) => {
  const { name, value } = e.target;
console.log(name, " : ", value);


  setOrderPD(prev => {
    // copy current packaging array
    const updatedPack = [...prev.packeging];

    // get product detail for this index
    const product = productdetail.packeging[index];

    // calculate orderPrice 
    // orderPrice = price * orderQuentity
    let orderQuentity = name === "orderQuentity" ? value : updatedPack[index].orderQuentity;
    let price = updatedPack[index].orderUnit === "BOX" ? product.bpPrice : product.price;
    let orderPrice = orderQuentity ? price * orderQuentity : 0;

    updatedPack[index] = {
      ...updatedPack[index],
      [name]: value,
      productQuentity: product.productQuentity,
      price: price,
      orderPrice: orderPrice
    };

    // total sum of all orderPrice
    const total = updatedPack.reduce((sum, p) => sum + Number(p.orderPrice || 0), 0);

    return {
      ...prev,
      packeging: updatedPack,
      totalProductAmount: total
    };
  });
};


  useEffect(() => {
    async function getallproduct() {
      const alldata = await getAllProductApi()
      console.log("all product data :", alldata.data);
      if (!alldata) (
        alert('product data not get !!')
      )
      setAllProductData(alldata.data)
    }
    getallproduct();
  }, [])

  const handleAddToList = () => {
  const productToStore = {
    productId: productdetail._id,
    name: productdetail.name,
    image: productdetail.image,
    packaging: [],
    totalPrice: OrderPD.totalProductAmount
  };

  OrderPD.packeging.forEach((p) => {
    if (p.orderQuentity && Number(p.orderQuentity) > 0) {
      productToStore.packaging.push({
        productQuentity: p.productQuentity,
        orderUnit: p.orderUnit,
        unitPrice: p.price,
        orderQuentity: p.orderQuentity,
        orderPrice: p.orderPrice
      });
    }
  });

  let existing = JSON.parse(localStorage.getItem("cartList")) || [];

  // ----- UPDATE instead of adding duplicate -----
  const index = existing.findIndex(p => p.productId === productdetail._id);

  if (index !== -1) {
    existing[index] = productToStore; // replace existing
  } else {
    existing.push(productToStore); // add new
  }

  localStorage.setItem("cartList", JSON.stringify(existing));

  alert("Product list updated!");
  console.log("Stored product:", productToStore);
  console.log("Updated cart list:", existing);
  setDetailCard("close");
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col ">
      <div className="w-full overflow-scroll text-nowrap h-10 bg-sky-300 fixed mt-12 flex space-x-4 items-center px-5">
        <p onClick={() => setCategoryFilter('achar')} className="font-semibold hover:underline" >Achar |</p>
        <p onClick={() => setCategoryFilter('noodels')} className="font-semibold hover:underline" >noodels |</p>
        <p onClick={() => setCategoryFilter('figur fryms')} className="font-semibold hover:underline" >figur fryms |</p>
        <p onClick={() => setCategoryFilter('imported fryms')} className="font-semibold hover:underline" >imported fryms |</p>
        <p onClick={() => setCategoryFilter('fry papard')} className="font-semibold hover:underline" >fry papard |</p>
        <p onClick={() => setCategoryFilter('rice papard')} className="font-semibold hover:underline" >rice papard |</p>
        <p onClick={() => setCategoryFilter('papard')} className="font-semibold hover:underline" >papard |</p>
        <p onClick={() => setCategoryFilter('murabba & candy')} className="font-semibold hover:underline" >murabba & candy |</p>
        <p onClick={() => setCategoryFilter('other')} className="font-semibold hover:underline" >Other |</p>
        <p onClick={() => setCategoryFilter('')} className="font-semibold hover:underline" >All Product |</p>
      </div>

      {/* -------- Product Card Section ------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 justify-items-center py-28">
        {filteredData.map((value, i) => (
          <div
            key={i}
            onClick={() => {
  setDetailCard("open");
  setProductDetail(value);

  // ------- Step 1: Read cart list -------
  const existingCart = JSON.parse(localStorage.getItem("cartList")) || [];
  const existingProduct = existingCart.find(p => p.productId === value._id);

  // ------- Step 2: If product already exists → prefill values -------
  if (existingProduct) {
    setOrderPD({
      name: value.name,
      packeging: value.packeging.map((p, i) => {
        const saved = existingProduct.packaging[i]; // try match index-based

        return {
          productQuentity: p.productQuentity,
          price: saved ? saved.unitPrice : p.price,
          orderUnit: saved ? saved.orderUnit : p.OrderUnit,
          orderQuentity: saved ? saved.orderQuentity : "",
          orderPrice: saved ? saved.orderPrice : 0
        };
      }),
      totalProductAmount: existingProduct.totalPrice
    });
  }

  // ------- Step 3: If new product → fresh defaults -------
  else {
    setOrderPD({
      name: value.name,
      packeging: value.packeging.map((p) => ({
        productQuentity: p.productQuentity,
        price: p.price,
        orderUnit: p.OrderUnit,
        orderQuentity: "",
        orderPrice: 0
      })),
      totalProductAmount: 0
    });
  }
}}

            className="w-[160px] sm:w-[180px] h-56 p-3 bg-slate-200 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
          >
            <div className="h-2/3 w-full rounded-2xl overflow-hidden">
              <img src={pro2} className="w-full h-full object-cover rounded-xl" alt="product" />
            </div>
            <div className="flex-1 flex flex-col justify-between mt-2">
              <div>
                <p className="text-base font-semibold truncate">{value.name}</p>
                <p className="text-sm font-light">{value.packeging[0].productQuentity}...</p>
              </div>
              <p className="text-right text-base font-bold text-[#32CD32]">Rs.{value.packeging[0].price}</p>
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
            <h2 className="text-xl font-bold mb-3">{productdetail.name}</h2>

            {/* Quantity Options */}
            <div className="space-y-3">
              {productdetail.packeging.map((item, i) => (
                <label
                  key={i}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pinter transition-shadow hover:shadow-sm
                   'border-orange-400 bg-orange-50`}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm font-medium" >{item.productQuentity}</div>
                      <div className="text-xs text-gray-500">{item.OrderUnit} • {item.bigPackagSize} per box</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold">₹{item.price}</div>
                    <div className="text-xs text-gray-500">per {item.OrderUnit}</div>
                  </div>
                  <div className="text-right flex">
                    <div className="text-sm font-semibold">
                      <input
                        type="number"
                        name="orderQuentity"
                        value={OrderPD.packeging[i]?.orderQuentity || ""}
                        onChange={(e) => handlePackegChange(i, e)}
                        className="w-14 rounded border border-gray-300 px-1 py-1 
                         focus:outline-none focus:ring-0 focus:border-transparent "
                      />
                    </div>
                    <div className="text-sm font-semibold">
                      <select
                        name="orderUnit"
                        value={OrderPD.packeging[i]?.orderUnit || ""}
                        onChange={(e) => handlePackegChange(i, e)}
                        defaultValue={item.OrderUnit}
                        className="w-14 py-1 border rounded bg-white"
                        required

                      >
                        <option value={item.OrderUnit}>{item.OrderUnit}</option>
                        <option value="BOX">BOX</option>
                      </select>
                    </div>
                  </div>
                </label>
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
              <button
  onClick={handleAddToList}
  className="px-4 py-2 text-white bg-lime-600 hover:bg-lime-700 rounded-xl font-semibold"
>
  Add to List
</button>

            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default ProductsPg;
