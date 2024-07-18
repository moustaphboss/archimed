import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import CapitalCallsSection from "./components/sections/CapitalCallsSection";
import BillsSection from "./components/sections/BillsSection";
import InvestorsSection from "./components/sections/InvestorsSection";
import { SectionKeys } from "./utils/types";

const SECTIONS: Record<SectionKeys, React.FC> = {
  CapitalCalls: CapitalCallsSection,
  Bills: BillsSection,
  Investors: InvestorsSection,
};

function App() {
  const [activeTab, setActiveTab] = useState<SectionKeys>("Investors");

  const ActiveComponent = SECTIONS[activeTab];

  return (
    <div className="App flex h-screen p-4 gap-4 font-sans">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="bg-white w-full p-8 rounded-3xl border-2 border-slate-200">
        <ActiveComponent />
      </div>
    </div>
  );
}

export default App;
