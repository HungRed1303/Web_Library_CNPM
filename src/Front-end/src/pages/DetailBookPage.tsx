import { useState, useEffect } from "react"
import { ChevronLeft, BookOpen, Tag, Loader2 } from "lucide-react"

import { useParams } from 'react-router-dom';
import { getBookById, actualHandleBorrowBook } from '../service/detailbookService'
type BookData = {
  book_id: number;
  title: string;
  publisher_id: number;
  publisher_name: string;
  publication_year: string;
  quantity: number;
  availability: "available" | "unavailable";
  price: number;
  author: string;
  image_url: string | null;
  categories: string[];
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id || '0');
  const [selectedImage] = useState(0)
  const [bookData, setBookData] = useState<BookData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isBorrowed, setIsBorrowed] = useState(false);

  // Helper to create full image URL (similar to BookListPage)
  const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    const cleanPath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
    return `http://localhost:3000/${cleanPath}`;
  };

  const handleBorrowBook = async (book_id: number) => {
    try {
      await actualHandleBorrowBook(book_id);
      setIsBorrowed(true);
    } catch (error) {
      console.error("Borrow book error", error);
    }
  };

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true)
        const data = await getBookById(bookId)
        console.log('Book data received:', data)
        setBookData(data)
      } catch (err) {
        console.error('Error fetching book:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBookData()
  }, [bookId])

  // Create image URL for book (use logic similar to BookListPage)
  const bookImageUrl = bookData?.image_url ? getImageUrl(bookData.image_url) : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#033060]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading book information...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#033060] text-white px-4 py-2 rounded-lg hover:bg-[#033060]/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7]"
      style={{ fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 hover:text-[#033060] cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Book Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              {bookImageUrl ? (
                <img
                  src={bookImageUrl}
                  alt={bookData?.title || "Book cover"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    // Create placeholder element
                    const placeholder = document.createElement('div');
                    placeholder.className = 'w-full h-full bg-gray-100 flex items-center justify-center';
                    placeholder.innerHTML = '<span class="text-gray-400">No Image</span>';
                    e.currentTarget.parentNode?.appendChild(placeholder);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${bookData?.availability === 'available'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  }`}>
                  {bookData?.availability === 'available' ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Book Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {bookData?.title || 'No title'}
              </h2>
              <p className="text-xl text-gray-600 mb-1">
                Author: {bookData?.author || 'Unknown author'}
              </p>
              <p className="text-gray-500 font-mono">
                Book ID: {bookData?.book_id ? `LT-${String(bookData.book_id).padStart(3, '0')}` : 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-600 block">Publisher:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.publisher_name || 'Unknown publisher'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600 block">Publication year:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.publication_year || 'Unknown year'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600 block">Price:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.price ? `${bookData.price.toLocaleString('en-US')} VND` : 'No price'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600 block">Quantity:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.quantity || 0} copies
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {bookData?.categories && bookData.categories.length > 0 ? (
                  bookData.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-[#033060]/10 text-[#033060] hover:bg-[#033060]/20 transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3" />
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Uncategorized</span>
                )}
              </div>
            </div>

            <div className={`border rounded-2xl p-4 ${bookData?.availability === 'available'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
              }`}>
              <div className={`flex items-center gap-2 ${bookData?.availability === 'available' ? 'text-green-700' : 'text-red-700'
                }`}>
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">
                  {bookData?.availability === 'available'
                    ? `Remaining ${bookData?.quantity || 0} copies, max borrow time: 14 days`
                    : 'Currently unavailable'
                  }
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-4 flex-col sm:flex-row">
              <button
                onClick={() => handleBorrowBook(bookData?.book_id as number)}
                disabled={bookData?.availability !== 'available' || isBorrowed}
                className={`flex-1 rounded-2xl py-3 px-6 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${isBorrowed
                    ? 'bg-gray-500 text-white cursor-not-allowed'
                    : bookData?.availability === 'available'
                      ? 'bg-[#033060] hover:bg-[#033060]/90 text-white'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
              >
                {isBorrowed
                  ? 'Request sent'
                  : bookData?.availability === 'available'
                    ? 'Borrow now'
                    : 'Unavailable'}
              </button>
              <button className="flex-1 border-2 border-[#033060] text-[#033060] hover:bg-[#033060]/5 rounded-2xl py-3 px-6 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                Add to favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
