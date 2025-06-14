import { useState, useEffect } from "react"
import { ChevronLeft, BookOpen, Tag, Loader2 } from "lucide-react"
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';

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

interface TokenPayload {
  id: number; // hoặc id tùy vào token của bạn
  exp?: number;    // (tuỳ chọn) thời gian hết hạn
  iat?: number;    // (tuỳ chọn) thời gian phát hành
  // thêm các trường khác nếu token có, ví dụ: name, email, role,...
}
export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id || '0');
  const [selectedImage] = useState(0)
  const [bookData, setBookData] = useState<BookData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isBorrowed, setIsBorrowed] = useState(false);

  const getBookById = async (id: number): Promise<BookData> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const response = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch book requests')
      }

      const result = await response.json();
      return result.data
    } catch (error) {
      console.log("Error getBookById", error);
      throw error;
    }
  }

const actualHandleBorrowBook = async (book_id: number) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found");
  }
 
  try {
    // 🔓 Giải mã token để lấy user_id
    const decoded = jwtDecode<TokenPayload>(token);
    const user_id =  decoded.id;
    
    console.log(decoded.id)

    if (!user_id) {
      throw new Error("Không tìm thấy user_id trong token");
    }

    // 📥 Gọi API để lấy student_id từ user_id
    const studentRes = await fetch(`http://localhost:3000/api/students/user-id/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log(studentRes)
    if (!studentRes.ok) {
      throw new Error("Không thể lấy thông tin student_id từ user_id");
    }

    const studentData = await studentRes.json();
    const student_id = studentData?.data?.student_id;

    if (!student_id) {
      throw new Error("Dữ liệu student_id không hợp lệ");
    }

    // 📤 Gửi yêu cầu mượn sách
    const borrowRes = await fetch('http://localhost:3000/api/borrow/borrow-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ book_id, student_id })
    });

    if (!borrowRes.ok) {
      throw new Error('Mượn sách thất bại');
    }

    const result = await borrowRes.json();
    return result.data;
  } catch (error) {
    console.error("Error handleBorrowBook", error);
    throw error;
  }
};

const handleBorrowBook = async (book_id: number) => {
  try {
    await actualHandleBorrowBook(book_id); // tách logic ra ngoài nếu cần
    setIsBorrowed(true); // ✅ sau khi mượn thành công
  } catch (error) {
    console.error("Mượn sách lỗi", error);
  }
};
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true)
        const data = await getBookById(bookId)
        console.log('Book data received:', data) // Debug log
        setBookData(data)
      } catch (err) {
        console.error('Error fetching book:', err) // Debug log
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBookData()
  }, [bookId])

  // Default image when no image is provided
  const bookImages = [
    bookData?.image_url || "/placeholder.svg?height=600&width=450",
    "/placeholder.svg?height=600&width=450",
    "/placeholder.svg?height=600&width=450",
    "/placeholder.svg?height=600&width=450",
    "/placeholder.svg?height=600&width=450",
  ]

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#033060]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Đang tải thông tin sách...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Lỗi: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#033060] text-white px-4 py-2 rounded-lg hover:bg-[#033060]/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  // Main render
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7]"
      style={{ fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 hover:text-[#033060] cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Book Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={bookImages[selectedImage] || "/placeholder.svg"}
                alt={bookData?.title || "Book cover"}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                  bookData?.availability === 'available' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {bookData?.availability === 'available' ? 'Có sẵn' : 'Hết sách'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Book Information */}
          <div className="space-y-6">
            {/* Book Title & Author */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {bookData?.title || 'Không có tiêu đề'}
              </h2>
              <p className="text-xl text-gray-600 mb-1">
                Tác giả: {bookData?.author || 'Không rõ tác giả'}
              </p>
              <p className="text-gray-500 font-mono">
                Mã sách: {bookData?.book_id ? `LT-${String(bookData.book_id).padStart(3, '0')}` : 'N/A'}
              </p>
            </div>

            {/* Detailed Information */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Thông tin chi tiết</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-600 block">Nhà xuất bản:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.publisher_name || 'Không rõ nhà xuất bản'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600 block">Năm xuất bản:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.publication_year || 'Không rõ năm xuất bản'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600 block">Giá:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.price ? `${bookData.price.toLocaleString('vi-VN')} VNĐ` : 'Chưa có giá'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600 block">Số lượng:</span>
                  <p className="font-medium text-gray-900">
                    {bookData?.quantity || 0} bản
                  </p>
                </div>
              </div>
            </div>

            {/* Genre Tags */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Thể loại</h3>
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
                  <span className="text-gray-500">Chưa phân loại</span>
                )}
              </div>
            </div>

            {/* Book Status */}
            <div className={`border rounded-2xl p-4 ${
              bookData?.availability === 'available' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className={`flex items-center gap-2 ${
                bookData?.availability === 'available' ? 'text-green-700' : 'text-red-700'
              }`}>
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">
                  {bookData?.availability === 'available' 
                    ? `Còn ${bookData?.quantity || 0} bản, thời gian mượn tối đa: 14 ngày`
                    : 'Hiện tại không có sách'
                  }
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 flex-col sm:flex-row">
<button 
  onClick={() => handleBorrowBook(bookData?.book_id)}
  disabled={bookData?.availability !== 'available' || isBorrowed}
  className={`flex-1 rounded-2xl py-3 px-6 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
    isBorrowed
      ? 'bg-gray-500 text-white cursor-not-allowed'
      : bookData?.availability === 'available'
        ? 'bg-[#033060] hover:bg-[#033060]/90 text-white'
        : 'bg-gray-400 text-white cursor-not-allowed'
  }`}
>
  {isBorrowed
    ? 'Đã gửi yêu cầu'
    : bookData?.availability === 'available'
      ? 'Mượn ngay'
      : 'Hết sách'}
</button>
              <button className="flex-1 border-2 border-[#033060] text-[#033060] hover:bg-[#033060]/5 rounded-2xl py-3 px-6 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                Thêm vào yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}