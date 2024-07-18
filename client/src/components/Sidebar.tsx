import React from "react";
import { SectionKeys } from "../utils/types";
import NavButton from "./NavButton";

const MENU: { label: string; key: SectionKeys; iconClass: string }[] = [
  { label: "Capital Calls", key: "CapitalCalls", iconClass: "fi fi-rr-money" },
  { label: "Bills", key: "Bills", iconClass: "fi fi-rr-document" },
  { label: "Investors", key: "Investors", iconClass: "fi fi-rr-user" },
];

interface SidebarProps {
  setActiveTab: (tab: SectionKeys) => void;
  activeTab: SectionKeys;
}
const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
  return (
    <div className="flex flex-col bg-black text-white w-64 h-full">
      <div className="flex flex-col items-start p-4">
        {MENU.map((item) => (
          <NavButton
            key={item.key}
            label={item.label}
            iconClass={item.iconClass}
            activeTab={activeTab}
            tabKey={item.key}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
