// src/pages/BookManagementPage.tsx
import React, { useEffect, useState } from "react";
import {
  getAllBooks,
  createBook,
  updateBookById,
  deleteBookById,
} from "../service/Services";
import { Plus, Pencil, Trash2 } from "lucide-react";

/** =============================================================
 *  BookManagementPage – Add / Edit / Delete
 *  Professional modern theme (light background + blue accents)
 *  Font  : "Poppins", fallback sans – headings 24 px bold, body 16 px
 *  Colors: Background #FEFEFE · Accent #467DA7
 *  UX    : Left-aligned content, large rounded corners, subtle shadows
 *  NOTE  : Requires lucide-react + TailwindCSS 3+ with JIT
 * ===========================================================*/

export interface Book {
  book_id: number;
  title: string;
  publisher_id: number;
  publication_year: number;
  quantity: number;
  availability: boolean;
  price: number;
  author: string;
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
  };
  const [form, setForm] = useState<BookDTO>(empty);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Toast states
  const [toast, setToast] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

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
    });
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

  /* --------------------------- SAVE ---------------------------- */
  const handleSave = async () => {
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      if (modal === "add") {
        await createBook(form);
        setToast("Book added successfully");
      }
      if (modal === "edit" && active) {
        await updateBookById(active.book_id, form);
        setToast("Book updated successfully");
      }
      closeModal();
      load();
    } catch {
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

  /* ----------------------- TOAST ANIMATION ---------------------- */
  useEffect(() => {
    if (toast) {
      setShowToast(true);
      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 2500); // Sau 2.5s bắt đầu fade-out
      const clearTimer = setTimeout(() => {
        setToast(null);
      }, 3000); // Sau 3s remove toast hoàn toàn
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
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-[#467DA7]/10 transition`}
                    >
                      <td className="px-4 py-3 border-b border-gray-200">
                        {b.book_id}
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
          <div className="w-full max-w-md bg-white border-2 border-[#467DA7] rounded-2xl p-8 shadow-xl animate-scale-in text-gray-900">
            <h2 className="text-xl font-extrabold text-left uppercase mb-6 text-[#467DA7]">
              {modal === "add" ? "Add Book" : "Edit Book"}
            </h2>

            {(
              Object.keys(empty) as (keyof BookDTO)[]
            ).map((f) => (
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
                ) : f === "publisher_id" ||
                  f === "publication_year" ||
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

      {toast && (
        <div
          className={`fixed bottom-6 right-6 bg-[#467DA7] text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-500 ${
            showToast ? "opacity-100" : "opacity-0"
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
    className={`p-2 rounded-full hover:bg-${
      color === "red" ? "red" : "[#467DA7]"
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
  `w-full bg-white border ${
    err ? "border-[#467DA7]" : "border-gray-300"
  } rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#467DA7] focus:border-[#467DA7] transition`;
