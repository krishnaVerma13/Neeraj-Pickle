import React, { useEffect } from "react";
import murabba from "../Assets/layoutImg/Cmurabba.png"
import papad from "../Assets/layoutImg/Cpapad.png"
import ricePapad from "../Assets/layoutImg/CricePapad.png"
// import impFryms from "../Assets/layoutImg/CimportedFryms.png"
// import figurFryms from "../Assets/layoutImg/Cfigurfryms.png"
import pasta from "../Assets/layoutImg/Cpasta.png"
import neeraj from "../Assets/productImg/neerajDemo.png"
import allPro from "../Assets/productImg/NeerajLogoBg.png";
import seasonal from "../Assets/productImg/SeasonalImg.jpeg";
import Frypapad from "../Assets/productImg/FryPapadImg.png";
import impFryms from "../Assets/productImg/ImportantFryms.jpg";
import figureFry from "../Assets/productImg/FigureFryums.jpeg";
import achar from "../Assets/productImg/AcharImg.jpeg";
import { useNavigate } from "react-router-dom";



function LayoutPg(){
    const navigator = useNavigate()

    const productCategories = [
  { id: 1, category:"achar" ,name: "Achar (अचार)", image: achar },
  { id: 2, category:"murabba & candy" , name: "Murabba & Candy", image: murabba },
  { id: 3, category:"papad" , name: "Papad", image: papad },
  { id: 4, category:"rice papad" , name: "Rice Papad", image: ricePapad },
  { id: 5, category:"fry papad" , name: "Fry Papad", image: Frypapad },
  { id: 6, category:"imported fryums" , name: "Imported Fryums", image: impFryms },
  { id: 7, category:"figure fryums" , name: "Figure Fryums", image: figureFry },
  { id: 8, category:"noodles" , name: "Pasta & Noodles", image: pasta },
  { id: 9, category:"other" , name: "Others", image: neeraj },
  { id: 10, category:"seasonal" , name: "Seasonal", image: seasonal },
  { id: 11, category:"" , name: "All products", image: allPro }
];

useEffect(()=>{
  window.scrollTo(0,0);
},[])
    return(<>
   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 justify-items-center py-20">
  {productCategories.map((item) => (
    <div
      key={item.id}
      className="w-[160px] sm:w-[180px] h-56 p-3 bg-sky-200 hover:bg-white rounded-2xl hover:shadow-2xl hover:underline duration-300 cursor-pointer flex flex-col"
      onClick={() => navigator("/products",{state :{category : item.category}})}
    >
      <div className="h-4/5 w-full rounded-2xl overflow-hidden">
        <img
          src={item.image}
          className="w-full h-full object-cover rounded-xl"
          alt={item.name}
        />
      </div>

      <div className="flex-1 flex items-center justify-center mt-2">
        <p className="text-base font-semibold font-serif truncate">
          {item.name}
        </p>
      </div>
    </div>
  ))}
</div>

    </>)
}

export default LayoutPg ;