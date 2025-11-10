import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePg from "./Pages/HomePg";
import OrderList from "./Pages/OrderList";
import Navbar from "./Component/Navbar";
import LayoutPg from "./Pages/LayoutPg";




function App() {
  return (<>
      
     <Routes>
      <Route path="/" element={<HomePg/>}></Route>
      <Route path="/list" element={<OrderList/>}></Route>
      <Route path="/layout" element={<LayoutPg/>}></Route>
    </Routes>
  </>);
}

export default App;
