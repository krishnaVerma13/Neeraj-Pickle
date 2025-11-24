import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OrderList from "./Pages/OrderList";
import Navbar from "./Component/Navbar";
import LayoutPg from "./Pages/LayoutPg";
import ProductsPg from "./Pages/ProductsPg";
import Footer from "./Component/Footer";
import ProductCard from "./Pages/ProductCardPg";
import AdminApp from "./AdminApp";




function App() {
  return (<>
      <Navbar/>
     <Routes>
      <Route path="/" element={<LayoutPg/>}></Route>
      <Route path="/list" element={<OrderList/>}></Route>
      <Route path="/products" element={<ProductsPg/>}></Route>
      <Route path="/card" element={<ProductCard/>}></Route>
      <Route path="/admin" element={<AdminApp/>}></Route>

     
    </Routes>
    <Footer/>
  </>);
}

export default App;
