// src/components/Sidebar.tsx
"use client";

import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  ListChecks,
  BarChart2,
  Settings,
} from "lucide-react";

interface SidebarProps {
  /** collapsed = true  → desktop đã ẩn hẳn (width=0) */
  /** collapsed = false → desktop mở rộng (width=240px) */
  collapsed: boolean;
  /** mobileOpen = true  → trên mobile (screen<1024) sidebar slide-in */
  /** mobileOpen = false → sidebar slide-out */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navItems = [
  { icon: <Home size={20} />, label: "Dashboard", href: "/home" },
  { icon: <Search size={20} />, label: "Find Book", href: "/find-book" },
  { icon: <BookOpen size={20} />, label: "Borrow Book", href: "/borrow-book" },
  { icon: <ListChecks size={20} />, label: "Wishlist", href: "/wishlist" },
  { icon: <BarChart2 size={20} />, label: "Reports", href: "/reports" },
  { icon: <BarChart2 size={20} />, label: "Book", href: "/book" },
  { icon: <BarChart2 size={20} />, label: "Publisher", href: "/publishers" },
  { icon: <BarChart2 size={20} />, label: "Category", href: "/category" },
  { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
];

export default function Sidebar({
  collapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Đóng sidebar khi click ra ngoài (chỉ mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileOpen &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileOpen, setMobileOpen]);

  /**
   * Tính width:
   *  - Nếu collapsed = true và mobileOpen = false → width = 0
   *  - Trong mọi trường hợp còn lại → width = 240px (w-60)
   */
  const widthClass = collapsed && !mobileOpen ? "w-0" : "w-60";

  /**
   * Tính translate-x:
   *  - Trên mobile (screen<1024):
   *       + mobileOpen=true → translate-x-0
   *       + mobileOpen=false → translate-x-[-100%] (ẩn)
   *  - Trên desktop (screen>=1024):
   *       + luôn translate-x-0 (desktop dùng width để ẩn)
   */
  const translateClass =
    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0";

  return (
    <aside
      ref={ref}
      className={`
        ${widthClass}
        ${translateClass}
        flex-shrink-0
        flex h-full flex-col
        bg-[#244055] text-[#FEFEFE]
        transition-all duration-300 ease-in-out
        overflow-hidden
        fixed top-0 left-0 z-40
        lg:relative lg:top-auto lg:left-auto lg:h-screen
      `}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-[#2E4F6E]">
        {!collapsed && (
          <img
            src="/public/logo.png" // Thay bằng đường dẫn thật
            alt="Logo"
            className="h-16 w-auto"
          />
        )}
      </div>

      {/* Dòng user */}
      <div
        className={`
          flex items-center px-4 py-4 transition-opacity duration-300
          ${collapsed ? "opacity-0" : "opacity-100"}
        `}
      >
        {!collapsed && (
          <>
            <img
              src="/public/logo_user.png" // Thay bằng đường dẫn thật
              alt="User avatar"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-[#FEFEFE]"
            />
            <div className="ml-3">
              <p className="truncate text-sm font-semibold">John Doe</p>
              <p className="truncate text-xs text-[#D0E1F9]">Librarian</p>
            </div>
          </>
        )}
      </div>

      {/* Nav Items */}
      <ul className="flex-1 space-y-1 overflow-y-auto px-0 py-2 scrollbar-thin scrollbar-thumb-[#2E4F6E] scrollbar-track-transparent">
        {navItems.map(({ icon, label, href }) => {
          const isActive = location.pathname === href;
          const activeStyle = isActive
            ? "border-l-4 border-[#FEFEFE] bg-[#2E4F6E]"
            : "hover:bg-[#2E4F6E]";

          return (
            <li
              key={label}
              className={`
                relative flex h-10 px-4 cursor-pointer items-center
                transition-colors duration-200 justify-start
                ${activeStyle}
              `}
            >
              {/* Link phủ kín toàn bộ <li> */}
              <Link to={href} className="absolute inset-0 z-10" />

              <span className="z-20 flex-shrink-0">{icon}</span>
              <span className="z-20 ml-3 truncate text-sm leading-none">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
