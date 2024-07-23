import { SectionKeys } from "../utils/types";

interface NavButtonProps {
  label: string;
  iconClass: string;
  activeTab: string;
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
    <div
      className={`flex items-center w-full mb-4 space-x-4 px-4 py-3 rounded-xl ${
        activeTab === tabKey
          ? "bg-violet-600"
          : "bg-transparent hover:bg-neutral-900"
      } rounded-lg`}
    >
      <i className={iconClass}></i>
      <span>{label}</span>
    </div>
  );
};

export default NavButton;
