import React from "react";
import Navbar from "../Component/Navbar";
import pro2 from "../Assets/productImg/Aachar2.png"
import pro3 from "../Assets/productImg/spices.png"
import pro4 from "../Assets/productImg/pasta.png"
import pro5 from "../Assets/productImg/Murabba.png"
import pro6 from "../Assets/productImg/ketchup.png"
import { useNavigate } from "react-router-dom";



function LayoutPg(){
    const navigator = useNavigate()

    const productCategories = [
  { id: 1, category:"achar" ,name: "Achar (अचार)", image: pro2 },
  { id: 2, category:"murabba & candy" , name: "Murabba & Candy", image: pro3 },
  { id: 3, category:"papard" , name: "Papard", image: pro5 },
  { id: 4, category:"rice papard" , name: "Rice Papard", image: pro4 },
  { id: 5, category:"fry papard" , name: "Fry Papard", image: pro6 },
  { id: 6, category:"imported fryms" , name: "Imported Fryms", image: pro6 },
  { id: 7, category:"figur fryms" , name: "Figur Fryms", image: pro6 },
  { id: 8, category:"noodels" , name: "Noodels", image: pro6 },
  { id: 9, category:"other" , name: "Others", image: pro6 },
  { id: 10, category:"" , name: "All product", image: pro6 }
];
    return(<>
   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 justify-items-center py-20">
  {productCategories.map((item) => (
    <div
      key={item.id}
      className="w-[160px] sm:w-[180px] h-56 p-3 bg-cyan-100 hover:bg-white rounded-2xl hover:shadow-2xl duration-300 cursor-pointer flex flex-col"
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