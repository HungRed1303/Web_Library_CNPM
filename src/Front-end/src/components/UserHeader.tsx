// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  BookOpen,
  CreditCard,
  Bell,
  User as UserIcon,
  Globe,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { useToast } from "../hooks/use-toast";
import { libraryCardRequestService } from "../service/libraryCardRequestService";

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);


  // State dùng để lưu thông tin user (đã đăng nhập hay chưa, tên, v.v.)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [hasLibraryCard, setHasLibraryCard] = useState(false);

  // Khi component mount, kiểm tra localStorage để xác định trạng thái login
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const userData = JSON.parse(raw);
        if (userData.isLogged) {
          setIsAuthenticated(true);
          // Nếu userData có trường name, dùng nó; nếu không, bạn thay bằng userData.role hoặc field phù hợp
          setUserName(userData.name || "");
          setHasLibraryCard(userData.hasLibraryCard || false);
        } else {
          setIsAuthenticated(false);
          setUserName(null);
          setHasLibraryCard(false);
        }
      } else {
        setIsAuthenticated(false);
        setUserName(null);
        setHasLibraryCard(false);
      }
    } catch {
      setIsAuthenticated(false);
      setUserName(null);
      setHasLibraryCard(false);
    }
  }, []);

  // Hàm đăng xuất (Logout) – xoá localStorage và redirect về login
  const handleLogout = () => {
    localStorage.removeItem("user");
    // Nếu bạn có lưu token riêng, cũng remove token ở đây
    // localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserName(null);
    setHasLibraryCard(false);
    navigate("/login");
  };

  const raw = localStorage.getItem("user");
  const userData = raw ? JSON.parse(raw) : null;
  const roleID = userData?.role_id;

  const handleViewBorrowingHistory = () => {
    navigate(`/students/borrowingHistory?studentId=${roleID}`)
  }
  const handleLibraryCardRequest = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated || hasLibraryCard || isRequesting) return;
    
    setIsRequesting(true);
    try {
      await libraryCardRequestService.requestLibraryCard(roleID);
      toast({
        title: "Success!",
        description: "Library Card Request sent!",
        className: "bg-green-600 text-white border-green-400",
      });
      setHasLibraryCard(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request library card. Please try again.",
        className: "bg-red-600 text-white border-red-400",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#FEFEFE] border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo / Home */}
        <Link
          to="/home"
          className="text-3xl font-bold text-[#467DA7] tracking-tight"
        >
          EleBrary
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm sách theo tên, tác giả, thể loại..."
              className="h-10 w-72 rounded-full border border-gray-300 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:border-[#467DA7] focus:outline-none"
            />
            <Search className="absolute left-4 top-1/2 h-5 w-5 text-gray-500 -translate-y-1/2" />
          </div>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center space-x-1 rounded-md px-3 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition focus:outline-none"
              title="Danh mục"
            >
              <span>Categories</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {categoryOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    title="Thể loại sách"
                  >
                    Thể loại sách
                  </Link>
                  <Link
                    to="/books"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    title="ALL BOOKS"
                  >
                    ALL BOOKS
                  </Link>
                  <Link
                    to="/authors"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    title="Tác giả"
                  >
                    Tác giả
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            to={isAuthenticated ? "/wishlist" : "/login"}
            className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition"
            title="Wishlist"
          >
            <Heart className="h-6 w-6" />
          </Link>

          {/* Borrowing History */}
          <button
            onClick={handleViewBorrowingHistory}
            className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition"
            title="Borrowing History"
          >
            <BookOpen className="h-6 w-6" />
            <span className="sr-only">Borrowing History</span>
          </button>

          {/* Request Library Card */}
          <button
            onClick={handleLibraryCardRequest}
            disabled={!isAuthenticated || hasLibraryCard || isRequesting}
            className="rounded-md px-3 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={hasLibraryCard ? "Request is pending!" : "Request Library Card"}
          >
            {isRequesting ? "Requesting..." : hasLibraryCard ? "Request is pending!" : "Request Library Card"}
          </button>
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition focus:outline-none"
              title="Thông báo"
            >
              <Bell className="h-6 w-6" />
              {/* Ví dụ badge */}
              <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
              </span>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-2">
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Thẻ thư viện đã được duyệt
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sách "JavaScript Cơ bản" sắp quá hạn
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sách "React nâng cao" đã quá hạn
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center space-x-1 rounded-md px-3 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition focus:outline-none"
              title="Ngôn ngữ"
            >
              <Globe className="h-5 w-5" />
              <span>VN</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {languageOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    Tiếng Việt
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    English
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right side: Profile / Login & Register */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-100 hover:border hover:border-gray-300 hover:rounded transition focus:outline-none"
                title="Tài khoản"
              >
                <UserIcon className="h-6 w-6 text-gray-700" />
                <span className="text-gray-700">
                  {userName || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-700" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to={`/student/profile/${roleID}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to="/password/reset/:token"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đổi mật khẩu
                    </Link>
                    <Link
                      to="/account-management"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Quản lý tài khoản
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-[#467DA7] px-4 py-2 text-white text-sm font-medium hover:bg-[#3a6b9b] transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-[#467DA7] px-4 py-2 text-[#467DA7] text-sm font-medium hover:bg-[#467DA7] hover:text-white transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-[#FEFEFE]">
          <div className="px-6 py-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm sách theo tên, tác giả, thể loại..."
                className="h-10 w-full rounded-full border border-gray-300 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:border-[#467DA7] focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 text-gray-500 -translate-y-1/2" />
            </div>

            {/* Categories */}
            <div>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-gray-700 hover:bg-gray-200 focus:outline-none transition"
                title="Danh mục"
              >
                <span>Danh mục</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {categoryOpen && (
                <div className="mt-2 space-y-1">
                  <Link
                    to="/categories"
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                    title="Thể loại sách"
                  >
                    Thể loại sách
                  </Link>
                  <Link
                    to="/publishers"
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                    title="Nhà xuất bản"
                  >
                    Nhà xuất bản
                  </Link>
                  <Link
                    to="/authors"
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                    title="Tác giả"
                  >
                    Tác giả
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist & History */}
            <div className="flex items-center space-x-6">
              <Link
                to={isAuthenticated ? "/wishlist" : "/login"}
                className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition"
                title="Yêu thích"
              >
                <Heart className="h-6 w-6" />
                <span className="sr-only">Wishlist</span>
              </Link>
              <button
                onClick={handleViewBorrowingHistory}
                className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition"
                title="Lịch sử mượn"
              >
                <BookOpen className="h-6 w-6" />
                <span className="sr-only">Lịch sử mượn</span>
              </button>
            </div>

            {/* Request Library Card */}
            <button
              onClick={handleLibraryCardRequest}
              disabled={!isAuthenticated || hasLibraryCard || isRequesting}
              className="block w-full rounded-lg bg-[#467DA7] px-4 py-2 text-center text-white text-sm font-medium hover:bg-[#3a6b9b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={hasLibraryCard ? "Request is pending!" : "Request Library Card"}
            >
              {isRequesting ? "Requesting..." : hasLibraryCard ? "Request is pending!" : "Request Library Card"}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-full rounded-lg bg-gray-100 px-4 py-2 text-left text-gray-700 hover:bg-gray-200 focus:outline-none transition"
                title="Thông báo"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Thông báo</span>
                  </div>
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    3
                  </span>
                </div>
              </button>
              {notificationsOpen && (
                <div className="mt-2 space-y-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Thẻ thư viện đã được duyệt
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sách "JavaScript Cơ bản" sắp quá hạn
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sách "React nâng cao" đã quá hạn
                  </Link>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none transition"
                title="Ngôn ngữ"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>VN</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>
              {languageOpen && (
                <div className="mt-2 space-y-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    Tiếng Việt
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Profile or Login/Register */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    to={`/student/profile/${roleID}`}
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    to="/ResetPasswordForm"
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đổi mật khẩu
                  </Link>
                  <Link
                    to="/account-management"
                    className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Quản lý tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="flex-1 rounded-lg bg-[#467DA7] px-4 py-2 text-center text-white text-sm font-medium hover:bg-[#3a6b9b] transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 rounded-lg border border-[#467DA7] px-4 py-2 text-center text-[#467DA7] text-sm font-medium hover:bg-[#467DA7] hover:text-white transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
