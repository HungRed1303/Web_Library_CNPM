// src/pages/BookListPage.tsx
import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../service/categoryService"; // Assume there is a service to get categories
import { getAllBooks } from "../service/bookService";

// Assume Service returns an array of Book with appropriate fields: id, title, author, cover, category
interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description?: string;
}

export default function BookListPage() {
  // State to store all books fetched from DB
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch books and categories from database when component mounts
  useEffect(() => {
    setLoading(true);
    // Fetch books and categories in parallel
    Promise.all([getAllBooks(), getAllCategories()])
      .then(([booksRes, catsRes]) => {
        // Handle books
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
        // Handle categories
        const catList: string[] = Array.isArray(catsRes.data)
          ? catsRes.data.map((c: any) => String(c))
          : [];
        setCategories(["All", ...catList]);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  // Whenever searchTerm or selectedCategory or allBooks changes, filter again
  useEffect(() => {
    let temp = [...allBooks];
    if (selectedCategory !== "All") {
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

  // Helper to create full image URL
  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    const cleanPath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
    return `http://localhost:3000/${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1F2E3D]">Library Books</h1>
          <nav className="text-sm text-gray-600">
            <Link to="/home" className="hover:text-[#033060]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#033060]">All Books</span>
          </nav>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#033060]">
                <button className="px-4 text-gray-500">
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Search by title, author..."
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
                        ${
                          selectedCategory === cat
                            ? "bg-[#033060]/10 text-[#033060]"
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
            <p className="text-center text-gray-500">Loading data…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : filteredBooks.length === 0 ? (
            <p className="text-center text-gray-500">No matching books found.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
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
                      <h3 className="text-lg font-semibold text-[#1F2E3D] group-hover:text-[#033060] transition-colors">
                        {book.title}
                      </h3>
                        <p className="mt-1 text-sm text-[#033060]">Author: {book.author}</p>
                    </div>
                    <Link
                      to={`/books/detail-book/${book.id}`}
                      className="mt-4 inline-block self-start rounded-md bg-[#033060] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a6b9b] transition"
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

      {/* Pagination (Simple example) */}
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
