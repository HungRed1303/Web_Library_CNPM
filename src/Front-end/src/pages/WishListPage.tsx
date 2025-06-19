import { useEffect, useState } from "react";
import { getWishListByStudentId, deleteBookFromWishlist } from "../service/wishListService";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        // ✅ CORRECT: Only get role_id when role is "S"
        if (parsed.role === "S" && parsed.role_id) {
          return parsed.role_id;
        }
      }
    } catch {}
    return null;
}

// Helper to create full image URL (same as BooksPage.tsx)
function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  const cleanPath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
  return `http://localhost:3000/${cleanPath}`;
}

export default function WishListPage() {
  const [books, setBooks] = useState<WishBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const student_id = getStudentIdFromLocalStorage();
    if (!student_id) {
      setError("Please log in again!");
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
          image_url: getImageUrl(b.image_url || ""),
          category: b.category || "",
          note: b.note || ""
        }));
        setBooks(mapped);
        setError(null);
      })
      .catch(() => setError("Failed to load wishlist"))
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
      setError("Unable to remove book from wishlist");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1F2E3D]">Wishlist</h1>
          <nav className="text-sm text-gray-600">
            <Link to="/home" className="hover:text-[#467DA7]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#467DA7]">Wishlist</span>
          </nav>
        </div>
      </div>
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-500">You haven't saved any books to your wishlist.</p>
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
                    {/* Title, Author and Trash Button */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-grow pr-3">
                        <h3 className="text-lg font-semibold text-[#1F2E3D] group-hover:text-[#467DA7] transition-colors">
                          {book.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">Author: {book.author}</p>
                        {book.note && (
                          <p className="mt-2 text-xs text-[#467DA7] italic">Note: {book.note}</p>
                        )}
                      </div>

                      {/* Trash Button - Moved here */}
                      <div className="relative group flex-shrink-0">
                        <button
                          className="flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-[#467DA7] shadow-md hover:shadow-lg hover:border-[#033060] transition-all duration-200 disabled:opacity-50"
                          onClick={() => handleDelete(book.book_id)}
                          disabled={deletingId === book.book_id}
                          aria-label="Remove from wishlist"
                        >
                          {deletingId === book.book_id ? (
                            <div className="animate-spin h-5 w-5 border-2 border-[#467DA7] border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 size={20} stroke="#467DA7" className="transition-colors duration-200" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/books/detail-book/${book.book_id}`)}
                      className="w-full px-3 py-2 rounded bg-[#467DA7] text-white hover:bg-[#345c85] transition-colors duration-200 font-medium shadow-sm"
                    >
                      View detail
                    </button>
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