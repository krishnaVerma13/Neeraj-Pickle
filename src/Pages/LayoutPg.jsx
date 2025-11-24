import React from "react";
import Navbar from "../Component/Navbar";
import pro2 from "../assets/productImg/Aachar2.png"
import pro3 from "../assets/productImg/spices.png"
import pro4 from "../assets/productImg/pasta.png"
import pro5 from "../assets/productImg/Murabba.png"
import pro6 from "../assets/productImg/ketchup.png"
import { useNavigate } from "react-router-dom";



function LayoutPg(){
    const navigator = useNavigate()
    return(<>
    <div>
       
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 justify-items-center">
            
              <div className="w-[160px] sm:w-[180px] h-56 p-3 bg-cyan-100 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
              onClick={()=> navigator('/products')}
              >
                <div className="h-4/5 w-full rounded-2xl overflow-hidden">
                  <img src={pro2} className="w-full h-full object-cover rounded-xl" alt="product" />
                </div>
                <div className="flex-1 flex items-center justify-center mt-2">
                 <p className="text-base font-semibold font-serif truncate">Achar (अचार)</p>
                 </div>
              </div>
              <div className="w-[160px] sm:w-[180px] h-56 p-3 bg-cyan-100 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
              onClick={()=> navigator('/products')}>
                <div className="h-4/5 w-full rounded-2xl overflow-hidden">
                  <img src={pro3} className="w-full h-full object-cover rounded-xl" alt="product" />
                </div>
                <div className="flex-1 flex items-center justify-center mt-2">
                 <p className="text-base font-semibold font-serif truncate">Spices (मसाले)</p>
                 </div>
              </div>
              <div className="w-[160px] sm:w-[180px] h-56 p-3 bg-cyan-100 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
              onClick={()=> navigator('/products')}>
                <div className="h-4/5 w-full rounded-2xl overflow-hidden">
                  <img src={pro5} className="w-full h-full object-cover rounded-xl" alt="product" />
                </div>
                <div className="flex-1 flex items-center justify-center mt-2">
                 <p className="text-base font-semibold font-serif truncate">Murabba (मुरब्बा)</p>
                 </div>
              </div>
              <div className="w-[160px] sm:w-[180px] h-56 p-3 bg-cyan-100 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
              onClick={()=> navigator('/products')}>
                <div className="h-4/5 w-full rounded-2xl overflow-hidden">
                  <img src={pro4} className="w-full h-full object-cover rounded-xl" alt="product" />
                </div>
                <div className="flex-1 flex items-center justify-center mt-2">
                 <p className="text-base font-semibold font-serif truncate">Pasta (पास्ता)</p>
                 </div>
              </div>
              <div className="w-[160px] sm:w-[180px] h-56 p-3 bg-cyan-100 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
              onClick={()=> navigator('/products')}>
                <div className="h-4/5 w-full rounded-2xl overflow-hidden">
                  <img src={pro6} className="w-full h-full object-cover rounded-xl" alt="product" />
                </div>
                <div className="flex-1 flex items-center justify-center mt-2">
                 <p className="text-base font-semibold font-serif truncate">Ketchup (केचप)</p>
                 </div>
              </div>
          
          </div>

          <div className="">

          </div>
    </div>
    </>)
}

export default LayoutPg ;