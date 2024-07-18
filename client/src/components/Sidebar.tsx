import React from "react";
import { SectionKeys } from "../utils/types";
import NavButton from "./NavButton";

const MENU: { label: string; key: SectionKeys; iconClass: string }[] = [
  { label: "Investors", key: "Investors", iconClass: "fi fi-rr-user text-2xl" },
  { label: "Bills", key: "Bills", iconClass: "fi fi-rr-document text-2xl" },
  {
    label: "Capital Calls",
    key: "CapitalCalls",
    iconClass: "fi fi-rr-money text-2xl",
  },
];

interface SidebarProps {
  setActiveTab: (tab: SectionKeys) => void;
  activeTab: SectionKeys;
}
const Sidebar: React.FC<SidebarProps> = ({ setActiveTab, activeTab }) => {
  return (
    <div className="flex flex-col bg-black text-white w-80 h-full rounded-3xl">
      <div className="flex flex-col items-start p-4 mt-28">
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
