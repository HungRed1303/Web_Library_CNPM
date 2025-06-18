// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserPlus,
  BarChart2,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

/**
 * HomePage – Dashboard Links
 * Theme: Gradient background / Accent #033060 / Font Tahoma / Rounded cards / Shadow / Hover
 */

export default function HomePage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get user info from localStorage when component mounts
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        // Check fields that may contain role
        const role = userData.role || userData.role_type || userData.user_type;
        setUserRole(role);
        console.log("User data:", userData); // Debug log
        console.log("User role:", role); // Debug log
      } else {
        // If no user data, get role separately
        const roleFromStorage = localStorage.getItem("role");
        setUserRole(roleFromStorage);
        console.log("Role from storage:", roleFromStorage); // Debug log
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Fallback to role from localStorage
      const roleFromStorage = localStorage.getItem("role");
      setUserRole(roleFromStorage);
    }
  }, []);

  // Define all cards
  const allCards = [
    {
      title: "Manage Publishers",
      icon: <Users size={32} className="text-[#033060]" />,
      link: "/publishers",
      description: "Add, edit, delete publishers",
    },
    {
      title: "Manage Books",
      icon: <UserPlus size={32} className="text-[#033060]" />,
      link: "/managebooks",
      description: "Manage book information",
    },
    {
      title: "Manage Students",
      icon: <UserCheck size={32} className="text-[#033060]" />,
      link: "/students",
      description: "Add, edit, delete students",
    },
    {
      title: "Report",
      icon: <BarChart2 size={32} className="text-[#033060]" />,
      link: "/report",
      description: "View statistics & reports",
    },
    {
      title: "Settings",
      icon: <Settings size={32} className="text-[#033060]" />,
      link: "/settings",
      description: "System customization",
    },
  ];

  // Card only visible for Admin (role "A")
  const adminOnlyCard = {
    title: "Manage Librarians",
    icon: <Users size={32} className="text-[#033060]" />,
    link: "/librarians",
    description: "Add, edit, delete librarians",
  };

  // Create card list based on role
  const cards = userRole === "A" 
    ? [...allCards.slice(0, 3), adminOnlyCard, ...allCards.slice(3)]
    : allCards;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] font-[Tahoma] flex flex-col items-center py-10">
      {/* Header */}
      <header className="w-full max-w-7xl px-6 mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow">
          Library Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Select a function below to continue
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