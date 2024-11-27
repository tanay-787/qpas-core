import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <ThemeProvider>
     <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
