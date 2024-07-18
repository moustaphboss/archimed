import React from "react";
import { SectionKeys } from "../utils/types";

interface NavButtonProps {
  label: string;
  iconClass: string;
  activeTab: SectionKeys;
  tabKey: SectionKeys;
  setActiveTab: (tab: SectionKeys) => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  label,
  iconClass,
  activeTab,
  tabKey,
  setActiveTab,
}) => {
  return (
    <button
      className={`flex items-center w-full mb-4 p-4 rounded-xl ${
        activeTab === tabKey ? "bg-violet-600" : "hover:bg-gray-800"
      }`}
      onClick={() => setActiveTab(tabKey)}
    >
      <i className={`${iconClass} mt-2 mr-4`}></i>
      {label}
    </button>
  );
};

export default NavButton;
