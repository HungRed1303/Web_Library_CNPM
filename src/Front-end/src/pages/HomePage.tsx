// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  BarChart2,
  Book,
  Settings,
  Search,
} from "lucide-react";

/** =============================================================
 *  HomePage – Dashboard Links
 *  Matches PublisherManagementPage theme:
 *  Font      : "Poppins", fallback sans – headings 24 px bold, body 16 px
 *  Colors    : Background #FEFEFE · Accent #467DA7
 *  Layout    : Left-aligned, grid of cards with icons
 *  Styling   : Large rounded corners, subtle shadows, hover effects
 *  Requires  : lucide-react + TailwindCSS 3+ with JIT
 * ===========================================================*/

export default function HomePage() {
  const cards = [
    {
      title: "Manage Publishers",
      icon: <Users size={32} className="text-[#467DA7]" />,
      link: "/dashboard/publisher",
      description: "Thêm, sửa, xóa Publishers",
    },
    {
      title: "Manage Books",
      icon: <Book size={32} className="text-[#467DA7]" />,
      link: "/dashboard/book",
      description: "Quản lý thông tin sách",
    },
    {
      title: "Find Books",
      icon: <Search size={32} className="text-[#467DA7]" />,
      link: "/dashboard/find-book",
      description: "Tìm kiếm nhanh sách",
    },
    {
      title: "Borrow Books",
      icon: <BookOpen size={32} className="text-[#467DA7]" />,
      link: "/dashboard/borrow-book",
      description: "Kiểm soát việc mượn trả",
    },
    {
      title: "Reports",
      icon: <BarChart2 size={32} className="text-[#467DA7]" />,
      link: "/dashboard/report",
      description: "Xem thống kê & báo cáo",
    },
    {
      title: "Settings",
      icon: <Settings size={32} className="text-[#467DA7]" />,
      link: "/dashboard/setting",
      description: "Tùy chỉnh hệ thống",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FEFEFE] text-gray-900 font-[Poppins]">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold text-[#467DA7] tracking-tight">
          Welcome to Library Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Chọn chức năng bên dưới để tiếp tục
        </p>
      </header>

      {/* Card Grid */}
      <main className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ title, icon, link, description }) => (
            <Link key={title} to={link} className="group">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#467DA7]/10">
                  {icon}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-[#467DA7] transition-colors duration-200">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
