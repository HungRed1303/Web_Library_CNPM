import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

const raw = localStorage.getItem("user");
const userData = raw ? JSON.parse(raw) : null;
const roleID = userData?.role_id;
const storedRole = userData?.role;

const Header = ({ collapsed, onToggleSidebar }: HeaderProps) => {
  const [isLogged, setIsLogged] = useState(true);
  const [role, setRole] = useState<string>(storedRole || "");
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setIsLogged(false);
    setRole("");
    localStorage.removeItem("user");
    navigate("/home");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProfileLink = () => {
    if (role === "S") return `/profile/students/${roleID}`;
    if (role === "L") return `/profile/librarians/${roleID}`;
    if (role === "A") return `/profile/admins/${roleID}`;
    return "#";
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#FEFEFE] shadow flex items-center justify-between px-6 font-[Tahoma]">
      <button
        onClick={onToggleSidebar}
        className="text-2xl text-[#467DA7] hover:text-opacity-80 transition-colors duration-150"
      >
        {collapsed ? <Menu size={28} strokeWidth={2.2} /> : <X size={28} strokeWidth={2.2} />}
      </button>

      {/* Thanh tìm kiếm đã bị xóa ở đây */}

      <div className="relative" ref={menuRef}>
        <img
          src="/public/logo_user.png"
          alt="User"
          className="w-9 h-9 rounded-full cursor-pointer ring-1 ring-[#467DA7]"
          onClick={() => setShowMenu(!showMenu)}
        />
        {showMenu && (
          <nav className="absolute right-0 mt-2 w-40 rounded bg-[#FEFEFE] shadow-lg border border-[#DDD] z-50">
            <a
              href={getProfileLink()}
              className="block px-4 py-2 text-sm text-[#467DA7] hover:bg-[#EEF5FA] transition-colors duration-150"
            >
              Profile
            </a>
            <button
              className="w-full text-left px-4 py-2 text-sm text-[#467DA7] hover:bg-[#EEF5FA] transition-colors duration-150"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-[#467DA7] hover:bg-[#EEF5FA] transition-colors duration-150"
              onClick={() => navigate("/password/change")}
            >
              Change Password
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
