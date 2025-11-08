import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePg from "./Pages/HomePg";
import OrderList from "./Pages/OrderList";
import Navbar from "./Component/Navbar";




function App() {
  return (<>
      
     <Routes>
      <Route path="/" element={<HomePg/>}></Route>
      <Route path="/list" element={<OrderList/>}></Route>
    </Routes>
  </>);
}

export default App;
