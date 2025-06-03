// src/components/UserLayout.tsx
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import Footer from "./Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen w-full bg-[#FEFEFE] font-[Poppins] text-gray-900">
      <UserHeader />

      {/* <Outlet /> sẽ là nơi các route con (ví dụ /home, /login, /register, …) được render */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
