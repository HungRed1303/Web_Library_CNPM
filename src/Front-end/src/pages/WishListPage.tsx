import { useEffect, useState } from "react";
import { getWishListByStudentId, deleteBookFromWishlist } from "../service/wishListService";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

interface WishBook {
  book_id: number;
  title: string;
  author: string;
  image_url: string;
  category?: string;
  note?: string;
}

function getStudentIdFromLocalStorage(): number | null {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsed = JSON.parse(user);
        // ✅ ĐÚNG: Chỉ lấy role_id khi role là "S"
        if (parsed.role === "S" && parsed.role_id) {
          return parsed.role_id;
        }
      }
    } catch {}
    return null;
}

export default function WishListPage() {
  const [books, setBooks] = useState<WishBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const student_id = getStudentIdFromLocalStorage();
    if (!student_id) {
      setError("Vui lòng đăng nhập lại!");
      setLoading(false);
      return;
    }
    setLoading(true);
    
    getWishListByStudentId(student_id)
      .then((res) => {
        const mapped = (res.data || []).map((b: any) => ({
          book_id: b.book_id,
          title: b.title,
          author: b.author,
          image_url: b.image_url || "",
          category: b.category || "",
          note: b.note || ""
        }));
        setBooks(mapped);
        setError(null);
      })
      .catch(() => setError("Không tải được wishlist"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (book_id: number) => {
    const student_id = getStudentIdFromLocalStorage();
    if (!student_id) return;
    setDeletingId(book_id);
    try {
      await deleteBookFromWishlist(student_id, book_id);
      setBooks((prev) => prev.filter((b) => b.book_id !== book_id));
    } catch {
      setError("Không thể xóa sách khỏi wishlist");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1F2E3D]">Danh sách yêu thích</h1>
          <nav className="text-sm text-gray-600">
            <Link to="/home" className="hover:text-[#467DA7]">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#467DA7]">Wishlist</span>
          </nav>
        </div>
      </div>
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500">Đang tải dữ liệu…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-500">Bạn chưa lưu sách nào vào wishlist.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <div
                  key={book.book_id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {book.image_url ? (
                    <img
                      src={book.image_url}
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
                      {book.note && (
                        <p className="mt-2 text-xs text-[#467DA7] italic">Ghi chú: {book.note}</p>
                      )}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-3 mt-4">
                      <Link
                        to={`/books/${book.book_id}`}
                        className="px-3 py-1.5 rounded bg-[#467DA7] text-white hover:bg-[#345c85] transition text-base font-medium shadow"
                      >
                        Xem chi tiết
                      </Link>
                      <div className="relative group flex items-center">
                        <button
                          className="flex items-center justify-center p-1.5 bg-white rounded-full shadow-md"
                          onClick={() => handleDelete(book.book_id)}
                          disabled={deletingId === book.book_id}
                          aria-label="Xóa khỏi wishlist"
                          style={{ background: "none", border: "none", outline: "none", cursor: "pointer" }}
                        >
                          <Trash2 size={26} stroke="#222" />
                        </button>
                        <div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[999] px-3 py-1.5 rounded-xl bg-[#f3f4f6] text-xs font-medium text-[#1f2937] border border-[#d1d5db] shadow opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap"
                          style={{ minWidth: '90px' }}
                        >
                          {deletingId === book.book_id ? "Đang xóa..." : "Xóa khỏi wishlist"}
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
    </div>
  );
}