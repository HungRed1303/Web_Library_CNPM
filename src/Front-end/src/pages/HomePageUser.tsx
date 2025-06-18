// src/pages/HomePage.tsx
import { Book, Headphones, Search } from "lucide-react";

export default function HomePageUser() {
  const popularBooks = [
    {
      title: "Tung Tung Sahur",
      author: "William Camy",
      cover: "/public/book-cover1.jpg",
    },
    {
      title: "Tralalelo Tralala",
      author: "Kevin Kurt",
      cover: "/public/book-cover2.jpg",
    },
    {
      title: "Bombardilo Crocodilo",
      author: "Addison Mark",
      cover: "/public/book-cover3.jpg",
    },
  ];

  return (
    <>
      {/* =======================================
          Hero Section
       ======================================= */}
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
                <button className="px-4 text-gray-500">
                  <Search size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Search by book title, author name..."
                  className="w-full rounded-full px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
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

      {/* =======================================
          Popular Stories This Week
       ======================================= */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold text-[#1F2E3D]">
            Popular Stories This Week
          </h2>

          <div className="relative mt-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {popularBooks.map((book) => (
                <div
                  key={book.title}
                  className="group rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =======================================
          Features: eBooks & Audiobooks
       ======================================= */}
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
