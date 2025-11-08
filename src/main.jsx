import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/dancing-script";
import "@fontsource/bebas-neue";
import "@fontsource/sacramento";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />

    </BrowserRouter>
  </React.StrictMode>,
);
