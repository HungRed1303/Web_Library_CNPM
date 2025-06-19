import { useState, useEffect } from "react";
import { Search, ChevronDown, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { addBookToWishlist, getWishListByStudentId, deleteBookFromWishlist } from "../service/wishListService";
import React from "react";
import { getAllBooks } from "../service/bookService";
import { getAllCategories } from "../service/categoryService";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description?: string;
}

export default function BookListPage() {
  const navigate = useNavigate();
  
  // State lưu tất cả sách lấy từ DB
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // State cho wishlist
  const [wishlistStatus, setWishlistStatus] = useState<string | null>(null);
  const [wishlistBookIds, setWishlistBookIds] = useState<number[]>([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<number | null>(null);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const userData = getUserData();
  const roleID = userData?.role_id;

  // Helper lấy student_id từ localStorage
  function getStudentIdFromLocalStorage(): number | null {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.role_id) return parsed.role_id;
      }
    } catch {}
    return null;
  }

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, allBooks]);

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch sách và danh mục từ database khi component mount
  useEffect(() => {
    setLoading(true);
    const student_id = getStudentIdFromLocalStorage();
    
    Promise.all([
      getAllBooks(),
      getAllCategories(),
      student_id ? getWishListByStudentId(Number(student_id)) : Promise.resolve({ data: [] })
    ])
      .then(([booksRes, catsRes, wishlistRes]) => {
        console.log("Categories Response:", catsRes);
        
        // Xử lý sách
        const books: Book[] = booksRes.data.map((b: any) => {
          console.log("Book item:", b);
          return {
            id: String(b.book_id),
            title: b.title,
            author: b.author,
            cover: b.image_url ? getImageUrl(b.image_url) : "",
            category: Array.isArray(b.categories) ? b.categories[0] : "",
          };
        });

        setAllBooks(books);
        setFilteredBooks(books);

        // Xử lý danh mục - support both formats
        let catList: string[] = [];
        if (Array.isArray(catsRes.data)) {
          // Check if it's array of objects with name property or array of strings
          catList = catsRes.data.map((c: any) => 
            typeof c === 'object' && c.name ? c.name : String(c)
          );
        }
        setCategories(["All", ...catList]);

        // Lấy danh sách book_id đã wishlist
        setWishlistBookIds((wishlistRes.data || []).map((w: any) => Number(w.book_id)));
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setError("Failed to load data");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter books based on search and category
  useEffect(() => {
    let tmp = [...allBooks];
    
    if (selectedCategory !== "All") {
      tmp = tmp.filter((b) => b.category === selectedCategory);
    }
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.trim().toLowerCase();
      tmp = tmp.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.author.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredBooks(tmp);
  }, [searchTerm, selectedCategory, allBooks]);

  const getImageUrl = (url: string) =>
    url.startsWith("http") ? url : `http://localhost:3000/${url.replace(/^\//, "")}`;

  // Hàm xử lý thêm/xóa wishlist
  const handleToggleWishlist = async (bookId: string) => {
    const student_id = getStudentIdFromLocalStorage();
    if (!student_id) {
      setWishlistStatus("Please login to use wishlist feature!");
      setTimeout(() => setWishlistStatus(null), 3000);
      return;
    }

    const numBookId = Number(bookId);
    setWishlistLoadingId(numBookId);

    try {
      if (wishlistBookIds.includes(numBookId)) {
        // Remove from wishlist
        await deleteBookFromWishlist(Number(student_id), numBookId);
        setWishlistBookIds((prev) => prev.filter((id) => id !== numBookId));
      } else {
        // Add to wishlist
        await addBookToWishlist({
          student_id: Number(student_id),
          book_id: numBookId
        });
        setWishlistBookIds((prev) => [...prev, numBookId]);
      }
      
      setTimeout(() => setWishlistStatus(null), 3000);
    } catch (err: any) {
      console.error("Wishlist error:", err);
      if (err?.message?.includes("already") || err?.message?.includes("409")) {
        setWishlistStatus("Book already in wishlist!");
      } else {
        setWishlistStatus("Error: " + (err?.message || "Unable to update wishlist"));
      }
      setTimeout(() => setWishlistStatus(null), 3000);
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      {/* Thông báo trạng thái wishlist */}
      {wishlistStatus && (
        <div className="fixed top-20 right-8 z-50 bg-white border border-[#467DA7] text-[#467DA7] px-4 py-2 rounded shadow-lg animate-fade-in">
          {wishlistStatus}
          <button 
            className="ml-2 text-gray-400 hover:text-gray-600" 
            onClick={() => setWishlistStatus(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1F2E3D]">Library Books</h1>
          <nav className="text-sm text-gray-600">
            <Link to="/home" className="hover:text-[#033060] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#033060]">All Books</span>
          </nav>
        </div>
      </div>

      {/* Search & Filter */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border-2 border-gray-300 pl-12 pr-4 py-2 focus:border-[#033060] focus:ring-2 focus:ring-[#033060] transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative w-full lg:w-1/4">
              <button
                onClick={() => setCategoryOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:border-[#033060] hover:text-[#033060] transition-all duration-200"
              >
                <span>{selectedCategory}</span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    categoryOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {categoryOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm transition-colors duration-150
                        ${selectedCategory === cat
                          ? "bg-[#033060]/20 text-[#033060] font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Book Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#033060]"></div>
              <span className="ml-3 text-gray-600">Loading books...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-[#033060] text-white rounded hover:bg-[#467DA7] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : paginatedBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books found.</p>
              {(searchTerm || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-[#033060] hover:text-[#467DA7] transition-colors underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} books
              </div>
              
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="relative flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    {/* Book Cover */}
                    <div className="relative overflow-hidden">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      {/* Title, Author and Wishlist Button */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-grow pr-3">
                          <h3 className="text-lg font-semibold text-[#1F2E3D] line-clamp-2 mb-2">
                            {book.title}
                          </h3>
                          <p className="text-sm text-[#033060]">
                            Author: {book.author}
                          </p>
                        </div>

                        {/* Wishlist Button - Moved here */}
                        <div className="relative group flex-shrink-0">
                          <button
                            className="flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-[#467DA7] shadow-md hover:shadow-lg hover:border-[#033060] transition-all duration-200 disabled:opacity-50"
                            onClick={() => handleToggleWishlist(book.id)}
                            disabled={wishlistLoadingId === Number(book.id)}
                          >
                            {wishlistLoadingId === Number(book.id) ? (
                              <div className="animate-spin h-5 w-5 border-2 border-[#467DA7] border-t-transparent rounded-full" />
                            ) : (
                              <Heart
                                size={20}
                                fill={wishlistBookIds.includes(Number(book.id)) ? "#e63946" : "none"}
                                stroke={wishlistBookIds.includes(Number(book.id)) ? "#e63946" : "#467DA7"}
                                className="transition-colors duration-200"
                              />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <button
                        className="w-full px-3 py-2 rounded bg-[#467DA7] text-white hover:bg-[#345c85] transition-colors duration-200 font-medium shadow-sm"
                        onClick={() => navigate(`/books/detail-book/${book.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-8 bg-white border-t border-gray-200">
          <div className="container mx-auto px-6 flex justify-center">
            <nav className="inline-flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-l-md transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-[#033060] hover:bg-[#467DA7]/10 border border-gray-300"
                }`}
              >
                Previous
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-2 border-t border-b transition-colors duration-200 ${
                    num === currentPage
                      ? "bg-[#033060] text-white border-[#033060]"
                      : "bg-white text-[#033060] hover:bg-[#467DA7]/10 border-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-r-md transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-[#033060] hover:bg-[#467DA7]/10 border border-gray-300"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </section>
      )}
    </div>
  );
}