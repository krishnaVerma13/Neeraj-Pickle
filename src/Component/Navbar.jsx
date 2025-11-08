import React from "react";
import logo from "../Assets/logoImg/neerajLogo.png"
import DropdownMenu from "./DropdownMenu";
import { useNavigate } from "react-router-dom";


function Navbar() {
    const navigator = useNavigate()
    return(<>
     <div className="p-3 w-full bg-amber-500 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={logo} className="w-8 h-8" alt="logo" />
        </div>
    
        {/* Dropdown (Centered for Mobile) */}
        <div className="text-center flex-1 flex justify-center">
          <DropdownMenu />
        </div>
    
        <div className="text-end">
          <button
          onClick={()=> navigator('/list')} className="bg-lime-400 py-1 px-4 md:px-6 rounded-xl text-sm md:text-base font-semibold hover:bg-lime-500 transition">
            Final List
          </button>
        </div>
      </div>
    </>)
}

export default Navbar;