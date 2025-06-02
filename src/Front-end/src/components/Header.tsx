// src/components/Header.tsx
import { Menu, X } from "lucide-react";

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const Header = ({ collapsed, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-[#FEFEFE] shadow flex items-center justify-between px-6 font-[Tahoma]">
      <button
        onClick={onToggleSidebar}
        className="text-2xl text-[#467DA7] hover:text-opacity-80 transition-colors duration-150"
      >
        {collapsed ? <Menu size={28} strokeWidth={2.2} /> : <X size={28} strokeWidth={2.2} />}
      </button>

      <div className="flex-1 max-w-xs mx-6">
        <input
          type="text"
          placeholder="Search books..."
          className="
            w-full px-4 py-2 border border-[#467DA7] rounded
            focus:outline-none focus:ring-2 focus:ring-[#467DA7]
            text-sm text-[#467DA7] placeholder:text-[#999]
            transition-colors duration-150
          "
        />
      </div>

      <div className="relative group">
        <img
          src="/public/logo_user.png" // Thay bằng đường dẫn thật
          alt="User"
          className="w-9 h-9 rounded-full cursor-pointer ring-1 ring-[#467DA7]"
        />
        <nav className="absolute right-0 mt-2 hidden w-40 rounded bg-[#FEFEFE] shadow-lg border border-[#DDD] group-hover:block">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-[#467DA7] hover:bg-[#EEF5FA] transition-colors duration-150"
          >
            Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-[#467DA7] hover:bg-[#EEF5FA] transition-colors duration-150"
          >
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
