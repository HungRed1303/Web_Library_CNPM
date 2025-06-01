// src/components/MainLayout.tsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = () => {
  // collapsed = true → desktop ẩn sidebar; false → desktop show sidebar
  const [collapsed, setCollapsed] = useState<boolean>(true);
  // mobileOpen = true → mobile (<1024px) show sidebar; false → ẩn
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Khi resize lên >=1024px, tự động reset mobileOpen = false
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  // Toggle sidebar:
  // - Nếu screen < 1024: toggle mobileOpen (slide trên mobile)
  // - Nếu screen >=1024: toggle collapsed (ẩn/hện desktop)
  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F8F8] text-[#333]">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/** Content wrapper (flex-1) **/}
      <div className="flex flex-1 flex-col min-h-0">
        <Header collapsed={collapsed} onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1 overflow-y-auto min-h-0">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
