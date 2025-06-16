// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserPlus,
  BarChart2,
  Settings,
} from "lucide-react";

/**
 * HomePage – Dashboard Links
 * Theme: Gradient background / Accent #033060 / Font Tahoma / Rounded cards / Shadow / Hover
 */

export default function HomePage() {
  const cards = [
    {
      title: "Manage Publishers",
      icon: <Users size={32} className="text-[#033060]" />,
      link: "/publishers",
      description: "Thêm, sửa, xóa Publishers",
    },
    {
      title: "Manage Books",
      icon: <UserPlus size={32} className="text-[#033060]" />,
      link: "/managebooks",
      description: "Quản lý thông tin sách",
    },
    {
      title: "Manage Students",
      icon: <UserCheck size={32} className="text-[#033060]" />,
      link: "/students",
      description: "Thêm, sửa, xóa sinh viên",
    },
    {
      title: "Manage Librarians",
      icon: <Users size={32} className="text-[#033060]" />,
      link: "/librarians",
      description: "Thêm, sửa, xóa thủ thư",
    },
    {
      title: "Report",
      icon: <BarChart2 size={32} className="text-[#033060]" />,
      link: "/report",
      description: "Xem thống kê & báo cáo",
    },
    {
      title: "Settings",
      icon: <Settings size={32} className="text-[#033060]" />,
      link: "/settings",
      description: "Tùy chỉnh hệ thống",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] font-[Tahoma] flex flex-col items-center py-10">
      {/* Header */}
      <header className="w-full max-w-7xl px-6 mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow">
          Library Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Chọn chức năng bên dưới để tiếp tục
        </p>
      </header>

      {/* Card Grid */}
      <main className="w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map(({ title, icon, link, description }) => (
            <Link key={title} to={link} className="group">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-transparent group-hover:border-[#033060]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#033060]/10">
                  {icon}
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-[#033060] group-hover:text-[#021c3a] transition-colors duration-200">
                  {title}
                </h2>
                <p className="mt-2 text-base text-gray-700">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
