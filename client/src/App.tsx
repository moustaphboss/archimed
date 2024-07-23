import React from "react";
import "./App.css";
import "flowbite/dist/flowbite.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import CapitalCallsSection from "./components/sections/CapitalCallsSection";
import BillsSection from "./components/sections/BillsSection";
import InvestorsSection from "./components/sections/InvestorsSection";

function App() {
  return (
    <Router>
      <div className="App flex h-screen p-4 gap-4 font-sans">
        <Sidebar />
        <div className="bg-white w-full p-8 rounded-3xl border-2 border-slate-200 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/investors" />} />
            <Route path="/investors" element={<InvestorsSection />} />
            <Route path="/bills" element={<BillsSection />} />
            <Route path="/capital-calls" element={<CapitalCallsSection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
