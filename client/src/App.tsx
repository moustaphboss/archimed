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
  const [activeTab, setActiveTab] = useState<SectionKeys>("Bills");

  const ActiveComponent = SECTIONS[activeTab];

  return (
    <div className="App flex h-screen">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <ActiveComponent />
    </div>
  );
}

export default App;
