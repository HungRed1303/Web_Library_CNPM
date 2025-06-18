// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  BookOpen,
  CreditCard,
  User as UserIcon,
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
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  // State to store user info (logged in or not, name, etc.)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [hasLibraryCard, setHasLibraryCard] = useState(false);

  // On mount, check localStorage for login status
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const userData = JSON.parse(raw);
        if (userData.isLogged) {
          setIsAuthenticated(true);
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

  // Logout function – remove localStorage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("user");
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
          className="text-3xl font-bold text-[#033060] tracking-tight"
        >
          EleBrary
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search books by title, author, genre..."
              className="h-10 w-72 rounded-full border border-gray-300 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:border-[#033060] focus:outline-none font-medium"
            />
            <Search className="absolute left-4 top-1/2 h-5 w-5 text-gray-500 -translate-y-1/2" />
          </div>

            {/* ALL BOOKS Link */}
            <Link
            to="/books"
            className="rounded-md px-3 py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-[#467DA7] hover:border hover:border-gray-300 hover:rounded transition"
            title="ALL BOOKS"
            >
            ALL BOOKS
            </Link>

          {/* Wishlist */}
          <Link
            to={isAuthenticated ? "/wishlist" : "/login"}
            className="relative rounded-md p-2 text-gray-800 hover:bg-gray-100 hover:text-[#033060] hover:border hover:border-gray-300 hover:rounded transition"
            title="Wishlist"
          >
            <Heart className="h-6 w-6" />
          </Link>

          {/* Borrowing History */}
          <Link
            to={isAuthenticated ? `/students/borrowingHistory?studentId=${roleID}` : "/login"}
            className="relative rounded-md p-2 text-gray-800 hover:bg-gray-100 hover:text-[#033060] hover:border hover:border-gray-300 hover:rounded transition"
            title="Borrowing History"
          >
            <BookOpen className="h-6 w-6" />
            <span className="sr-only">Borrowing History</span>
          </Link>
          
          {/* Request Library Card */}
          <button
            onClick={handleLibraryCardRequest}
            disabled={!isAuthenticated || hasLibraryCard || isRequesting}
            className="rounded-md px-4 py-2 text-base font-bold text-gray-800 hover:bg-gray-100 hover:text-[#033060] hover:border hover:border-gray-300 hover:rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={hasLibraryCard ? "Request is pending!" : "Request Library Card"}
          >
            {isRequesting ? "Requesting..." : hasLibraryCard ? "Request is pending!" : "Request Library Card"}
          </button>
        </nav>

        {/* Right side: Profile / Login & Register */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-gray-100 hover:border hover:border-gray-300 hover:rounded transition focus:outline-none"
                title="Account"
              >
                <UserIcon className="h-6 w-6 text-gray-800" />
                <span className="text-gray-800 font-bold">
                  {userName || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-800" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to={`/student/profile/${roleID}`}
                      className="block px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                    >
                      Profile
                    </Link>
                    <Link
                      onClick ={() => navigate("/password/change")}
                      to="/password/change"
                      className="block px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-[#033060] px-5 py-2 text-white text-base font-bold hover:bg-[#3a6b9b] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg border-2 border-[#033060] px-5 py-2 text-[#033060] text-base font-bold hover:bg-[#033060] hover:text-white transition-colors"
              >
                Register
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
            <X className="h-6 w-6 text-gray-800" />
          ) : (
            <Menu className="h-6 w-6 text-gray-800" />
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
                placeholder="Search books by title, author, genre..."
                className="h-10 w-full rounded-full border border-gray-300 pl-12 pr-4 text-gray-700 placeholder-gray-400 focus:border-[#033060] focus:outline-none font-medium"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 text-gray-500 -translate-y-1/2" />
            </div>

            {/* Categories */}
            <div>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-gray-800 font-bold hover:bg-gray-200 focus:outline-none transition"
                title="Categories"
              >
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {categoryOpen && (
                <div className="mt-2 space-y-1">
                  <Link
                    to="/categories"
                    className="block rounded-lg px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                    title="Book Genres"
                  >
                    Book Genres
                  </Link>
                  <Link
                    to="/books"
                    className="block rounded-lg px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                    title="All Books"
                  >
                    All Books
                  </Link>
                  <Link
                    to="/authors"
                    className="block rounded-lg px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                    title="Authors"
                  >
                    Authors
                  </Link>
                </div>
              )}
            </div>

            {/* Wishlist & History */}
            <div className="flex items-center space-x-6">
              <Link
                to={isAuthenticated ? "/wishlist" : "/login"}
                className="relative rounded-md p-2 text-gray-800 hover:bg-gray-100 hover:text-[#033060] hover:border hover:border-gray-300 hover:rounded transition"
                title="Wishlist"
              >
                <Heart className="h-6 w-6" />
                <span className="sr-only">Wishlist</span>
              </Link>
              <button
                onClick={handleViewBorrowingHistory}
                className="relative rounded-md p-2 text-gray-800 hover:bg-gray-100 hover:text-[#033060] hover:border hover:border-gray-300 hover:rounded transition"
                title="Borrowing History"
              >
                <BookOpen className="h-6 w-6" />
                <span className="sr-only">Borrowing History</span>
              </button>
            </div>

            {/* Request Library Card */}
            <button
              onClick={handleLibraryCardRequest}
              disabled={!isAuthenticated || hasLibraryCard || isRequesting}
              className="block w-full rounded-lg bg-[#033060] px-4 py-3 text-center text-white text-base font-bold hover:bg-[#3a6b9b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={hasLibraryCard ? "Request is pending!" : "Request Library Card"}
            >
              {isRequesting ? "Requesting..." : hasLibraryCard ? "Request is pending!" : "Request Library Card"}
            </button>

            {/* Profile or Login/Register */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    to={`/student/profile/${roleID}`}
                    className="block rounded-lg px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => navigate("/password/change")}
                    className="block rounded-lg px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-4 py-2 text-left text-gray-800 font-semibold hover:bg-gray-100 hover:text-[#033060]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="flex-1 rounded-lg bg-[#033060] px-4 py-3 text-center text-white text-base font-bold hover:bg-[#3a6b9b] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 rounded-lg border-2 border-[#033060] px-4 py-3 text-center text-[#033060] text-base font-bold hover:bg-[#033060] hover:text-white transition-colors"
                  >
                    Register
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