import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../service/categoryService";
import { getAllBooks } from "../service/bookService";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description?: string;
}

export default function BookListPage() {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, allBooks]);

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllBooks(), getAllCategories()])
      .then(([booksRes, catsRes]) => {
        console.log("Categories Response:", catsRes);
        booksRes.data.forEach((b: any) => {
          console.log("Book item:", b);
        });
        const books: Book[] = booksRes.data.map((b: any) => ({
          id: String(b.book_id),
          title: b.title,
          author: b.author,
          cover: b.image_url ? getImageUrl(b.image_url) : "",
          category: Array.isArray(b.categories) ? b.categories[0] : "", // ✅ Sửa tại đây
        }));

        setAllBooks(books);
        setFilteredBooks(books);

        if (Array.isArray(catsRes.data)) {
          const catList = catsRes.data.map((c: any) => c.name as string);
          setCategories(["All", ...catList]);
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let tmp = [...allBooks];
    if (selectedCategory !== "All") {
      tmp = tmp.filter((b) => b.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const l = searchTerm.trim().toLowerCase();
      tmp = tmp.filter(
        (b) =>
          b.title.toLowerCase().includes(l) ||
          b.author.toLowerCase().includes(l)
      );
    }
    setFilteredBooks(tmp);
  }, [searchTerm, selectedCategory, allBooks]);

  const getImageUrl = (url: string) =>
    url.startsWith("http") ? url : `http://localhost:3000/${url.replace(/^\//, "")}`;

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1F2E3D]">Library Books</h1>
          <nav className="text-sm text-gray-600">
            <Link to="/home" className="hover:text-[#033060]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#033060]">All Books</span>
          </nav>
        </div>
      </div>

      {/* Search & Filter */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border-2 border-gray-300 pl-12 pr-4 py-2 focus:border-[#033060] focus:ring-2 focus:ring-[#033060] transition"
                />
              </div>
            </div>

            {/* Category (giữ nguyên màu sắc & vị trí) */}
            <div className="relative w-full lg:w-1/4">
              <button
                onClick={() => setCategoryOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:border-[#033060] hover:text-[#033060] transition"
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
                        ${selectedCategory === cat
                          ? "bg-[#033060]/20 text-[#033060]"
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
            <p className="text-center text-gray-500">Loading…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : paginatedBooks.length === 0 ? (
            <p className="text-center text-gray-500">No books found.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl overflow-hidden shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="p-4 flex flex-col justify-between h-44">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F2E3D] line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#033060]">Author: {book.author}</p>
                    </div>
                    <Link
                      to={`/books/detail-book/${book.id}`}
                      className="mt-4 text-center bg-[#033060] text-white py-2 rounded-md shadow hover:bg-[#3a6b9b] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 0 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6 flex justify-center">
            <nav className="inline-flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l-md ${currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-[#033060] hover:bg-[#467DA7]/10"
                  }`}
              >
                «
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 border-t border-b ${num === currentPage
                      ? "bg-[#033060] text-white"
                      : "bg-white text-[#033060] hover:bg-[#467DA7]/10"
                    }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r-md ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-[#033060] hover:bg-[#467DA7]/10"
                  }`}
              >
                »
              </button>
            </nav>
          </div>
        </section>
      )}
    </div>
  );
}
