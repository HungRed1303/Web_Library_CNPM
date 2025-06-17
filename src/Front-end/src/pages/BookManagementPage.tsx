import React, { useEffect, useState } from "react";
import {
  getAllBooks,
  createBook,
  updateBookById,
  deleteBookById,
  addBookToWishlist,
} from "../service/Services";
import { Plus, Pencil, Trash2, Image } from "lucide-react";

export interface Book {
  book_id: number;
  title: string;
  publisher_id: number;
  publication_year: number;
  quantity: number;
  availability: boolean;
  price: number;
  author: string;
  image_url: string;
}

export type BookDTO = Omit<Book, "book_id">;

const BookManagementPage: React.FC = () => {
  /* --------------------------- STATE --------------------------- */
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<false | "add" | "edit" | "delete">(false);
  const [active, setActive] = useState<Book | null>(null);

  const empty: BookDTO = {
    title: "",
    publisher_id: 0,
    publication_year: 0,
    quantity: 0,
    availability: true,
    price: 0,
    author: "",
    image_url: "",
  };
  const [form, setForm] = useState<BookDTO>(empty);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Thêm state cho file

  // Toast states
  const [toast, setToast] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const [wishlistNote, setWishlistNote] = useState<string>("");
  const [wishlistBook, setWishlistBook] = useState<Book | null>(null);
  const [wishlistModal, setWishlistModal] = useState(false);

  /* ------------------------- LOAD LIST ------------------------- */
  const load = () => {
    setLoading(true);
    getAllBooks()
      .then((res) => setBooks(res.data as Book[]))
      .catch(() => setError("Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  /* ------------------------- HELPERS --------------------------- */
  const openAdd = () => {
    setForm(empty);
    setFormErrors({});
    setPreviewImage(null);
    setSelectedFile(null); // Reset file
    setModal("add");
  };
  
  const openEdit = (b: Book) => {
    setActive(b);
    setForm({
      title: b.title,
      publisher_id: b.publisher_id,
      publication_year: b.publication_year,
      quantity: b.quantity,
      availability: b.availability,
      price: b.price,
      author: b.author,
      image_url: b.image_url,
    });
    setPreviewImage(null);
    setSelectedFile(null); // Reset file
    setFormErrors({});
    setModal("edit");
  };
  
  const openDelete = (b: Book) => {
    setActive(b);
    setModal("delete");
  };
  
  const closeModal = () => {
    setModal(false);
    setActive(null);
    setForm(empty);
    setFormErrors({});
    setPreviewImage(null);
    setSelectedFile(null); // Reset file
  };

  const openWishlistModal = (book: Book) => {
    setWishlistBook(book);
    setWishlistNote("");
    setWishlistModal(true);
  };

  /* ------------------------- VALIDATE -------------------------- */
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (form.publisher_id <= 0) e.publisher_id = "Publisher ID is required";
    if (form.publication_year <= 0) e.publication_year = "Valid year is required";
    if (form.quantity < 0) e.quantity = "Quantity cannot be negative";
    if (form.price < 0) e.price = "Price cannot be negative";
    return e;
  };

  /* ------------------------- HELPER FUNCTIONS ------------------------- */
  const yearToDate = (year: number): string => {
    if (!year || year <= 0) return '';
    return `${year}-01-01`;
  };

  const dateToYear = (dateString: string): number => {
    if (!dateString) return 0;
    return new Date(dateString).getFullYear();
  };

  const getDateInputValue = (year: number): string => {
    if (!year || year <= 0) return '';
    return `${year}-01-01`;
  };

  // Helper function để tạo URL ảnh đúng
  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    // Nếu là đường dẫn tương đối từ server (uploads/abc), thêm base URL
    return `http://localhost:3000/${cleanPath}`;
  };
//Test log để kiểm tra dữ liệu sách
  useEffect(() => {
  console.log('Books loaded:', books.map(b => ({
    id: b.book_id,
    title: b.title,
    image_url: b.image_url,
    full_url: getImageUrl(b.image_url)
  })));
  }, [books]);
  /* --------------------------- SAVE ---------------------------- */
  const handleSave = async () => {
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('publisher_id', form.publisher_id.toString());
      formData.append('publication_year', yearToDate(form.publication_year));
      formData.append('quantity', form.quantity.toString());
      formData.append('availability', form.availability === true ? 'true' : 'false');
      formData.append('price', form.price.toString());
      formData.append('author', form.author);
      
      // Chỉ append image_url nếu không có file mới được chọn
      if (!selectedFile) {
        formData.append('image_url', form.image_url);
      }

      // Thêm file nếu có file mới được chọn
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Sử dụng service functions thay vì fetch trực tiếp
      if (modal === "add") {
        await createBook(formData);
        setToast("Book added successfully");
      } else if (modal === "edit" && active) {
        await updateBookById(active.book_id, formData);
        setToast("Book updated successfully");
      }

      closeModal();
      load();
    } catch (error) {
      console.error('Save error:', error);
      setToast("Database error – please try later");
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------- DELETE --------------------------- */
  const handleDelete = async () => {
    if (!active) return;
    setSubmitting(true);
    try {
      await deleteBookById(active.book_id);
      setToast("Book deleted");
      closeModal();
      load();
    } catch {
      setToast("Database error – please try later");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------- HANDLE IMAGE UPLOAD ------------------- */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Lưu file để upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToWishlist = async () => {
    if (!wishlistBook) return;
    try {
      // Lấy student_id từ localStorage (giả sử đã lưu khi đăng nhập)
      const studentId = parseInt(localStorage.getItem("student_id") || "0", 10);
      await addBookToWishlist({
        student_id: studentId,
        book_id: wishlistBook.book_id,
        note: wishlistNote,
      });
      setToast("Đã thêm vào wishlist!");
      setWishlistModal(false);
    } catch (e) {
      setToast("Lỗi khi thêm vào wishlist!");
    }
  };

  /* ----------------------- TOAST ANIMATION ---------------------- */
  useEffect(() => {
    if (toast) {
      setShowToast(true);
      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 2500);
      const clearTimer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [toast]);

  /* --------------------------- UI ------------------------------ */
  return (
    <div className="min-h-screen w-full bg-[#FEFEFE] text-gray-900 font-[Poppins]">
      <header className="max-w-5xl mx-auto py-8 pl-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#467DA7] text-center">
          Book Management
        </h1>
      </header>

      <main className="max-w-5xl mx-auto pl-6 pb-20 text-left">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#467DA7] text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#467DA7]/90 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition"
        >
          <Plus size={18} /> Add Book
        </button>

        {loading ? (
          <p className="mt-8 animate-pulse">Loading…</p>
        ) : error ? (
          <p className="mt-8 text-red-600">{error}</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto mt-8 border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-[15px] leading-6">
                <thead className="bg-[#467DA7]/10 text-gray-800">
                  <tr>
                    {[
                      "ID",
                      "Cover",
                      "Title",
                      "Publisher ID",
                      "Year",
                      "Qty",
                      "Available",
                      "Price",
                      "Author",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 border-b border-gray-200 text-left font-semibold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.map((b, idx) => (
                    <tr
                      key={b.book_id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-[#467DA7]/10 transition`}
                    >
                      <td className="px-4 py-3 border-b border-gray-200">
                        {b.book_id}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200">
                        {b.image_url ? (
                          <img
                            src={getImageUrl(b.image_url)}
                            alt={b.title}
                            className="h-16 w-12 object-cover rounded shadow-sm border border-gray-200"
                            onError={(e) => {
                              console.log('Image load error:', getImageUrl(b.image_url));
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              // Tạo placeholder khi ảnh lỗi
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) {
                                placeholder.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`h-16 w-12 bg-gray-100 rounded shadow-sm border border-gray-200 flex items-center justify-center ${b.image_url ? 'hidden' : ''}`}>
                          <Image size={20} className="text-gray-400" />
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b">{b.title}</td>
                      <td className="px-4 py-3 border-b">{b.publisher_id}</td>
                      <td className="px-4 py-3 border-b">{b.publication_year}</td>
                      <td className="px-4 py-3 border-b">{b.quantity}</td>
                      <td className="px-4 py-3 border-b">
                        {b.availability ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 border-b">{b.price}</td>
                      <td className="px-4 py-3 border-b">{b.author}</td>
                      <td className="px-4 py-3 border-b space-x-2">
                        <IconBtn
                          icon={<Pencil size={16} />}
                          onClick={() => openEdit(b)}
                        />
                        <IconBtn
                          icon={<Trash2 size={16} />}
                          onClick={() => openDelete(b)}
                          color="red"
                        />
                        <button
                          onClick={() => openWishlistModal(b)}
                          className="ml-2 px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
                        >
                          Thêm vào wishlist
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 mt-8 md:hidden">
              {books.map((b) => (
                <div
                  key={b.book_id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="mb-3">
                    {b.image_url ? (
                      <img
                        src={getImageUrl(b.image_url)}
                        alt={b.title}
                        className="w-full max-h-40 object-contain rounded shadow-sm border border-gray-200"
                        onError={(e) => {
                          console.log('Mobile image load error:', getImageUrl(b.image_url));
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded shadow-sm border border-gray-200 flex items-center justify-center">
                        <Image size={40} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-[#467DA7] text-lg text-left">
                      {b.title}
                    </h3>
                    <div className="flex gap-2">
                      <IconBtn
                        icon={<Pencil size={16} />}
                        onClick={() => openEdit(b)}
                      />
                      <IconBtn
                        icon={<Trash2 size={16} />}
                        onClick={() => openDelete(b)}
                        color="red"
                      />
                    </div>
                  </div>
                  <InfoRow label="ID" value={b.book_id} />
                  <InfoRow label="Publisher ID" value={b.publisher_id} />
                  <InfoRow label="Year" value={b.publication_year} />
                  <InfoRow label="Quantity" value={b.quantity} />
                  <InfoRow
                    label="Available"
                    value={b.availability ? "Yes" : "No"}
                  />
                  <InfoRow label="Price" value={b.price} />
                  <InfoRow label="Author" value={b.author} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {(modal === "add" || modal === "edit") && (
        <Backdrop>
          <div className="w-full max-w-md bg-white border-2 border-[#467DA7] rounded-2xl p-8 shadow-xl animate-scale-in text-gray-900 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-extrabold text-left uppercase mb-6 text-[#467DA7]">
              {modal === "add" ? "Add Book" : "Edit Book"}
            </h2>

            {/* Các trường nhập liệu (loại bỏ image_url khỏi form) */}
            {(Object.keys(empty).filter(key => key !== 'image_url') as (keyof BookDTO)[]).map((f) => (
              <div key={f} className="mb-5">
                <label className="block text-sm mb-1 font-medium text-gray-700 capitalize">
                  {f.replace("_", " ")}
                  {(f === "title" || f === "author") && (
                    <span className="text-[#467DA7]"> *</span>
                  )}
                </label>

                {f === "availability" ? (
                  <select
                    value={form[f] ? "yes" : "no"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availability: e.target.value === "yes",
                      })
                    }
                    className={inputCls(formErrors[f])}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : f === "publication_year" ? (
                  <input
                    type="date"
                    value={getDateInputValue(form.publication_year)}
                    onChange={(e) => {
                      const year = e.target.value ? dateToYear(e.target.value) : 0;
                      setForm({
                        ...form,
                        publication_year: year,
                      });
                    }}
                    className={inputCls(formErrors[f])}
                    placeholder="Select publication date"
                  />
                ) : f === "publisher_id" ||
                  f === "quantity" ||
                  f === "price" ? (
                  <input
                    type="number"
                    value={form[f] as number}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f]: Number(e.target.value),
                      } as BookDTO)
                    }
                    className={inputCls(formErrors[f])}
                  />
                ) : (
                  <input
                    value={form[f] as string}
                    onChange={(e) =>
                      setForm({ ...form, [f]: e.target.value } as BookDTO)
                    }
                    className={inputCls(formErrors[f])}
                  />
                )}
                {formErrors[f] && (
                  <p className="text-xs text-[#467DA7] mt-1">
                    {formErrors[f]}
                  </p>
                )}
              </div>
            ))}

            {/* Hiển thị ảnh hiện tại khi edit */}
            {modal === "edit" && active?.image_url && (
              <div className="mb-5">
                <label className="block text-sm mb-1 font-medium text-gray-700">
                  Current Image
                </label>
                <img
                  src={getImageUrl(active.image_url)}
                  alt="Current book cover"
                  className="max-h-32 rounded shadow border border-gray-200"
                  onError={(e) => {
                    console.log('Current image load error:', getImageUrl(active.image_url));
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Trường upload ảnh mới */}
            <div className="mb-5">
              <label className="block text-sm mb-1 font-medium text-gray-700 capitalize">
                {modal === "edit" ? "Change Book Cover Image" : "Book Cover Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={inputCls()}
              />
              {previewImage && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Preview:</p>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-32 rounded shadow border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleSave}
                className="px-5 py-2 bg-[#467DA7] text-white font-semibold rounded-lg hover:bg-[#467DA7]/90 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {modal === "delete" && active && (
        <Backdrop>
          <div className="w-full max-w-xs bg-white border-2 border-[#467DA7] rounded-2xl p-8 shadow-xl text-center animate-scale-in text-gray-900">
            <p className="mb-8 text-lg">
              Delete <span className="font-extrabold text-[#467DA7]">{active.title}</span>?
            </p>
            <div className="flex justify-center gap-8">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition"
              >
                No
              </button>
              <button
                disabled={submitting}
                onClick={handleDelete}
                className="px-4 py-2 bg-[#467DA7] text-white font-semibold rounded-lg hover:bg-[#467DA7]/90 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition"
              >
                {submitting ? "Deleting…" : "Yes"}
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {wishlistModal && wishlistBook && (
        <Backdrop>
          <div className="w-full max-w-xs bg-white border-2 border-[#467DA7] rounded-2xl p-8 shadow-xl text-center animate-scale-in text-gray-900">
            <h2 className="text-lg font-bold mb-4">Thêm vào wishlist</h2>
            <p className="mb-2 font-medium">{wishlistBook.title}</p>
            <textarea
              className="w-full border rounded p-2 mb-4"
              placeholder="Ghi chú cho cuốn sách này (tùy chọn)..."
              value={wishlistNote}
              onChange={e => setWishlistNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setWishlistModal(false)}
                className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleAddToWishlist}
                className="px-4 py-2 bg-[#467DA7] text-white font-semibold rounded-lg hover:bg-[#467DA7]/90"
              >
                Lưu
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 bg-[#467DA7] text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500 ${showToast ? "opacity-100" : "opacity-0"
            }`}
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default BookManagementPage;

const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
    {children}
  </div>
);

const IconBtn: React.FC<{
  icon: React.ReactElement;
  onClick: () => void;
  color?: "red";
}> = ({ icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full hover:bg-${color === "red" ? "red" : "[#467DA7]"
      }/10 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition`}
  >
    {icon}
  </button>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <p className="text-sm mb-1 text-left">
    <span className="font-medium">{label}: </span>
    {value}
  </p>
);

const inputCls = (err?: string) =>
  `w-full bg-white border ${err ? "border-[#467DA7]" : "border-gray-300"
  } rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#467DA7] focus:border-[#467DA7] transition`;