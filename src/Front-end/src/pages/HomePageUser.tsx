// src/pages/HomePageUser.tsx
import React, { useState, useEffect } from "react";
import { Book, Headphones, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBooks } from "../service/bookService";

interface BookItem {
  id: string;
  title: string;
  author: string;
  cover: string;
}

/** Utility để chuyển path ảnh thành URL đầy đủ */
function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `http://localhost:3000/${path.replace(/^\//, "")}`;
}

export default function HomePageUser() {
  const [popularBooks, setPopularBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch & shuffle popular books
  useEffect(() => {
    async function fetchAndShuffle() {
      try {
        const res = await getAllBooks();
        const books: BookItem[] = res.data.map((b: any) => ({
          id: String(b.book_id),
          title: b.title,
          author: b.author,
          cover: b.image_url ? getImageUrl(b.image_url) : "/public/placeholder.jpg",
        }));

        // Fisher–Yates shuffle
        for (let i = books.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [books[i], books[j]] = [books[j], books[i]];
        }

        setPopularBooks(books.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndShuffle();
  }, []);

  // Khi người dùng bấm Enter hoặc click button tìm kiếm
  const handleSearch = () => {
    const query = searchTerm.trim();
    if (query) {
      navigate(`/books?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/books");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#FEFEFE]">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center px-6 py-16 lg:px-16">
          {/* Text & Search */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <h1 className="text-4xl font-bold text-[#033060] lg:text-5xl">
              The <span className="text-[#1F2E3D]">EleBrary</span> <br />
              eBook Library.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Browse from the largest collection of ebooks. <br />
              Read stories from anywhere, at anytime.
            </p>

            {/* Search Bar */}
            <div className="mt-6 max-w-md">
              <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#033060]">
                <button
                  onClick={handleSearch}
                  className="px-4 text-gray-500"
                >
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Search by title, author..."
                  className="w-full rounded-full px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="absolute -top-10 -left-10 h-[200px] w-[200px] rounded-full bg-[#F5F7FA]" />
            <div className="absolute -bottom-16 -right-16 h-[260px] w-[260px] rounded-full bg-[#FFE082]" />
            <img
              src="/public/illustration.svg"
              alt="Illustration"
              className="relative z-10 h-auto w-full max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Popular Stories This Week */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold text-[#1F2E3D]">
            Recommended For You
          </h2>

          {loading ? (
            <div className="mt-10 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-t-[#033060] rounded-full"></div>
            </div>
          ) : (
            <div className="relative mt-10">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {popularBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/detail-book/${book.id}`}
                    className="group block rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-64 w-full rounded-t-2xl object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold text-[#1F2E3D] group-hover:text-[#033060] transition-colors">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">— {book.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-2">
            {/* eBooks Card */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#033060]/10">
                <Book size={32} className="text-[#033060]" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-[#1F2E3D]">
                eBooks
              </h3>
              <p className="mt-2 text-gray-600">
                Read your favorite titles anywhere, anytime, on any device.
              </p>
            </div>
            {/* Audiobooks Card */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#033060]/10">
                <Headphones size={32} className="text-[#033060]" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-[#1F2E3D]">
                Audiobooks
              </h3>
              <p className="mt-2 text-gray-600">
                Listen to popular titles and discover new narrations on the go.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
