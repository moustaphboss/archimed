import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SectionKeys } from "../utils/types";
import NavButton from "./NavButton";

const MENU: { label: string; path: string; iconClass: string }[] = [
  {
    label: "Investors",
    path: "/investors",
    iconClass: "fi fi-rr-user text-2xl mt-1",
  },
  {
    label: "Bills",
    path: "/bills",
    iconClass: "fi fi-rr-document text-2xl mt-1",
  },
  {
    label: "Capital Calls",
    path: "/capital-calls",
    iconClass: "fi fi-rr-money text-2xl mt-1",
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col bg-black text-white w-80 h-full rounded-3xl">
      <div className="flex flex-col items-start p-4 mt-28">
        {MENU.map((item) => (
          <Link to={item.path} key={item.path} className="w-full">
            <NavButton
              label={item.label}
              iconClass={item.iconClass}
              activeTab={location.pathname === item.path ? item.path : ""}
              tabKey={item.path as SectionKeys}
              setActiveTab={() => {}}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
