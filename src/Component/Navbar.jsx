import React, { useEffect } from "react";
import logo from "../Assets/logoImg/neerajLogo.png"
import DropdownMenu from "./DropdownMenu";
import { useNavigate } from "react-router-dom";
import getAllProductApi from "../api/AuthAPI/getAllproductApi";


function Navbar() {
    const navigator = useNavigate()

   
    return(<>
    <div className="px-3 py-2 w-full bg-gradient-to-r from-orange-400 to-amber-500 flex justify-between items-center fixed shadow-md z-50">
  <div
    onClick={() => navigator('/')}
    className="flex items-center space-x-3 cursor-pointer"
  >
    <img src={logo} className="w-8 h-8 drop-shadow-md" alt="logo" />

    <p className="text-3xl font-serif font-semibold tracking-wide 
                  bg-gradient-to-r from-blue-700 to-rose-700 
                  bg-clip-text text-transparent">
      Nakul Traders
    </p>
  </div>

  <div className="text-end">
    <button
      onClick={() => navigator('/list')}
      className="bg-gradient-to-r from-lime-400 to-green-400 
                 py-1.5 px-5 md:px-7 rounded-xl 
                 text-sm md:text-base font-semibold 
                 shadow-md hover:scale-105 hover:brightness-110 
                 transition-all duration-200"
    >
      Final List
    </button>
  </div>
</div>
    </>)
}

export default Navbar;