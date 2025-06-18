// src/pages/BookListPage.tsx
import { useState, useEffect } from "react";
import { Search, ChevronDown, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { addBookToWishlist, getWishListByStudentId, deleteBookFromWishlist } from "../service/wishListService";
import React from "react";
import { getAllBooks } from "../service/bookService";
import { getAllCategories } from "../service/categoryService";


// Giả định Service trả về mảng Book với các trường phù hợp: id, title, author, cover, category
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

  // State cho filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);

  // State cho wishlist modal
  const [wishlistStatus, setWishlistStatus] = useState<string | null>(null);
  const [wishlistBookIds, setWishlistBookIds] = useState<number[]>([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<number | null>(null);

  const raw = localStorage.getItem("user");
  const userData = raw ? JSON.parse(raw) : null;
  const roleID = userData?.role_id;
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
        // Xử lý sách
        const books: Book[] = booksRes.data.map((b: any) => ({
          id: String(b.book_id),
          title: b.title,
          author: b.author,
          cover: b.image_url ? getImageUrl(b.image_url) : "",
          category: b.category || "",
          description: b.description || "",
        }));
        setAllBooks(books);
        setFilteredBooks(books);
        // Xử lý danh mục
        const catList: string[] = Array.isArray(catsRes.data)
          ? catsRes.data.map((c: any) => String(c))
          : [];
        setCategories(["Tất cả", ...catList]);
        // Lấy danh sách book_id đã wishlist
        setWishlistBookIds((wishlistRes.data || []).map((w: any) => Number(w.book_id)));
      })
      .catch(() => setError("Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  // Mỗi khi searchTerm hoặc selectedCategory hoặc allBooks thay đổi, lọc lại
  useEffect(() => {
    let temp = [...allBooks];
    if (selectedCategory !== "Tất cả") {
      temp = temp.filter((b) => b.category === selectedCategory);
    }
    if (searchTerm.trim() !== "") {
      const lower = searchTerm.trim().toLowerCase();
      temp = temp.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower)
      );
    }
    setFilteredBooks(temp);
  }, [searchTerm, selectedCategory, allBooks]);

  // Helper để tạo URL ảnh đầy đủ
  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    const cleanPath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
    return `http://localhost:3000/${cleanPath}`;
  };

  // Helper lấy student_id từ localStorage
  function getStudentIdFromLocalStorage(): number | null {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        // Ưu tiên lấy student_id, nếu không có thì lấy user_id nếu role là Student
        if (parsed.student_id) return parsed.student_id;
        if ((parsed.role === "S" || parsed.role === "Student") && parsed.user_id) return parsed.user_id;
      }
    } catch {}
    return null;
  }

  // Hàm xử lý thêm vào wishlist
  const handleToggleWishlist = async (bookId: string) => {
    const student_id = roleID;
    if (!student_id) {
      setWishlistStatus("Vui lòng đăng xuất và đăng nhập lại để sử dụng tính năng wishlist!");
      return;
    }
    const numBookId = Number(bookId);
    setWishlistLoadingId(numBookId);
    if (wishlistBookIds.includes(numBookId)) {
      // Đã lưu, bấm để xóa
      try {
        await deleteBookFromWishlist(Number(student_id), numBookId);
        setWishlistBookIds((prev) => prev.filter((id) => id !== numBookId));
        setWishlistStatus("Đã xóa khỏi wishlist!");
      } catch (err: any) {
        setWishlistStatus("Lỗi: " + (err?.message || "Không thể xóa khỏi wishlist"));
      } finally {
        setWishlistLoadingId(null);
      }
    } else {
      // Chưa lưu, bấm để thêm
      try {
        // Kiểm tra lại phía client để tránh gửi trùng
        if (wishlistBookIds.includes(numBookId)) {
          setWishlistStatus("Sách đã có trong wishlist!");
          setWishlistLoadingId(null);
          return;
        }
        await addBookToWishlist({
          student_id: Number(student_id),
          book_id: numBookId
        });
        setWishlistBookIds((prev) => [...prev, numBookId]);
        setWishlistStatus("Đã thêm vào wishlist!");
      } catch (err: any) {
        // Nếu lỗi do trùng (409), báo rõ
        if (err?.message?.includes("already") || err?.message?.includes("409")) {
          setWishlistStatus("Sách đã có trong wishlist!");
        } else {
          setWishlistStatus("Lỗi: " + (err?.message || "Không thể thêm vào wishlist"));
        }
      } finally {
        setWishlistLoadingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      {/* Thông báo trạng thái wishlist */}
      {wishlistStatus && (
        <div className="fixed top-20 right-8 z-50 bg-white border border-[#467DA7] text-[#467DA7] px-4 py-2 rounded shadow">
          {wishlistStatus}
          <button className="ml-2 text-gray-400" onClick={() => setWishlistStatus(null)}>×</button>
        </div>
      )}

      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1F2E3D]">Thư viện sách</h1>
          <nav className="text-sm text-gray-600">
            <Link to="/home" className="hover:text-[#467DA7]">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#467DA7]">Tất cả sách</span>
          </nav>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#467DA7]">
                <button className="px-4 text-gray-500">
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full lg:w-1/4">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:border-[#467DA7] hover:text-[#467DA7] transition"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {categoryOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm transition
                        ${
                          selectedCategory === cat
                            ? "bg-[#467DA7]/10 text-[#467DA7]"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
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
        <div className="container mx-auto px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500">Đang tải dữ liệu…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredBooks.length === 0 ? (
            <p className="text-center text-gray-500">Không tìm thấy sách phù hợp.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="relative flex flex-col bg-white rounded-lg shadow-md pt-4 px-4 pb-2 h-full"
                  style={{ minHeight: "240px" }}
                >
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-64 w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F2E3D] group-hover:text-[#467DA7] transition-colors">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">— {book.author}</p>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-3 mt-2">
                      <button
                        className="px-3 py-1.5 rounded bg-[#467DA7] text-white hover:bg-[#345c85] transition text-base font-medium shadow"
                        onClick={() => navigate(`/books/${book.id}`)}
                      >
                        Xem chi tiết
                      </button>
                      <div className="relative group flex items-center">
                        <button
                          className="flex items-center justify-center p-1.5 bg-white rounded-full shadow-md"
                          onClick={() => handleToggleWishlist(book.id)}
                          disabled={wishlistLoadingId === Number(book.id)}
                          aria-label={wishlistBookIds.includes(Number(book.id)) ? "Đã lưu" : "Thêm vào wishlist"}
                          style={{ background: "none", border: "none", outline: "none", cursor: "pointer" }}
                        >
                          <Heart
                            size={26}
                            fill={wishlistBookIds.includes(Number(book.id)) ? "#e63946" : "none"}
                            stroke={wishlistBookIds.includes(Number(book.id)) ? "#e63946" : "#467DA7"}
                          />
                        </button>
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[999] px-3 py-1.5 rounded-xl bg-[#f3f4f6] text-xs font-medium text-[#1f2937] border border-[#d1d5db] shadow opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap"
                          style={{ minWidth: '90px' }}
                        >
                          {wishlistBookIds.includes(Number(book.id)) ? "Đã lưu" : "Thêm vào wishlist"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination (Ví dụ đơn giản) */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 lg:px-8 flex justify-center">
          <nav className="inline-flex -space-x-px rounded-md shadow-sm">
            <button
              className="px-3 py-2 ml-0 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"
              disabled
            >
              «
            </button>
            <button className="px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
              1
            </button>
            <button className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
              »
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
}