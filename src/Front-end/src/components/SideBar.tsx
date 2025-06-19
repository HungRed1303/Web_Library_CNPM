// src/components/Sidebar.tsx
"use client";

import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ListChecks,
  Book,
  Users,
  User,
  UserCheck,
  CheckSquare,
  RotateCw,
  BarChart2,
  Settings,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Lấy user từ localStorage
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const roleMap: Record<string, string> = { A: "Admin", L: "Librarian", S: "Student" };
  const userRole = user?.role;
  const displayName = user?.name || "User";
  const displayRole = roleMap[userRole] || "Unknown";

  // Base nav items
  const baseNavItems = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/dashboard" },
    { icon: <Book size={20} />, label: "Manage Books", href: "/managebooks" },
    { icon: <ListChecks size={20} />, label: "Categories", href: "/categories" },
    { icon: <Users size={20} />, label: "Publishers", href: "/publishers" },
    { icon: <User size={20} />, label: "Students", href: "/students" },
    { icon: <UserCheck size={20} />, label: "Approve Library Cards", href: "/approve-request-library-card" },
    { icon: <CheckSquare size={20} />, label: "Approve Book Requests", href: "/approve-book-request" },
    { icon: <RotateCw size={20} />, label: "Return Book", href: "/return-book" },
    { icon: <BarChart2 size={20} />, label: "Report", href: "/report" },
  ];

  // Admin-only
  const adminOnlyItem = { icon: <Users size={20} />, label: "Librarians", href: "/librarians" };

  // Build navItems
  const navItems =
    userRole === "A"
      ? [...baseNavItems.slice(0, 5), adminOnlyItem, ...baseNavItems.slice(5)]
      : baseNavItems;

  // Đóng sidebar khi click ngoài (mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileOpen, setMobileOpen]);

  const widthClass = collapsed && !mobileOpen ? "w-0" : "w-60";
  const translateClass = mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0";

  return (
    <aside
      ref={ref}
      className={`
        ${widthClass} ${translateClass}
        fixed top-0 left-0 z-40 flex h-full flex-col
        bg-[#244055] text-[#FEFEFE]
        transition-all duration-300 ease-in-out
        overflow-hidden
        lg:relative lg:h-screen
      `}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-[#2E4F6E]">
        {!collapsed && <img src="/public/logo.png" alt="Logo" className="h-16 w-auto" />}
      </div>

      {/* User info */}
      <div className={`flex items-center px-4 py-4 transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
        {!collapsed && (
          <>
            <img src="/public/logo_user.png" alt="User avatar" className="h-8 w-8 rounded-full ring-2 ring-[#FEFEFE]" />
            <div className="ml-3">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-[#D0E1F9]">{displayRole}</p>
            </div>
          </>
        )}
      </div>

      {/* Nav Items */}
      <ul className="flex-1 space-y-1 overflow-y-auto px-0 py-2">
        {navItems.map(({ icon, label, href }) => {
          const isActive = location.pathname === href;
          const linkClass = `
            flex items-center h-10 px-4 transition-colors duration-200
            ${isActive ? "border-l-4 border-[#FEFEFE] bg-[#2E4F6E]" : "hover:bg-[#2E4F6E]"}
          `;
          return (
            <li key={label}>
              <Link to={href} className={linkClass}>
                <span>{icon}</span>
                <span className="ml-3 truncate text-sm">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
