import React, { useEffect, useState } from "react";
import {
  getAllBooks,
  createBook,
  updateBookById,
  deleteBookById,
} from "../service/bookService";

import { getAllCategories } from "../service/categoryService";
import { getAllPublishers } from "../service/publisherService";

import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Category } from "./CategoryManagementPage";

export interface Publisher {
  publisher_id: number;
  name: string;
}

export interface Book {
  book_id: number;
  title: string;
  publisher_id: number;
  publisher_name?: string;
  categories: string[];
  publication_year: number;
  quantity: number;
  availability: boolean;
  price: number;
  author: string;
  image_url: string;
}

export type BookDTO = Omit<Book, "book_id" | "categories" | "publisher_name"> & {
  category_ids: number[];
};

const emptyForm: BookDTO = {
  title: "",
  publisher_id: 0,
  category_ids: [],
  publication_year: 0,
  quantity: 0,
  availability: true,
  price: 0,
  author: "",
  image_url: "",
};

export default function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allPublishers, setAllPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<false | "add" | "edit" | "delete">(false);
  const [active, setActive] = useState<Book | null>(null);
  const [form, setForm] = useState<BookDTO>(emptyForm);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // --- Load initial data ---
  useEffect(() => {
    getAllPublishers()
      .then(res => setAllPublishers(res.data as Publisher[] || []))
      .catch(() => setAllPublishers([]));
    getAllCategories()
      .then(res => setAllCategories(res.data as Category[] || []))
      .catch(() => setAllCategories([]));
  }, []);

  useEffect(() => {
    if (allPublishers.length) loadBooks();
    // eslint-disable-next-line
  }, [allPublishers]);

  function loadBooks() {
    setLoading(true);
    getAllBooks()
      .then(res => {
        const data: Book[] = res.data as Book[];
        setBooks(
          data.map(b => ({
            ...b,
            publisher_name:
              allPublishers.find(p => p.publisher_id === b.publisher_id)?.name ||
              b.publisher_id.toString(),
          }))
        );
      })
      .catch(() => setError("Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }

  // --- Toast auto-hide ---
  useEffect(() => {
    if (!toast) return;
    setShowToast(true);
    const hide = setTimeout(() => setShowToast(false), 2500);
    const clear = setTimeout(() => setToast(null), 3000);
    return () => {
      clearTimeout(hide);
      clearTimeout(clear);
    };
  }, [toast]);

  // --- Form validation ---
  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.author.trim()) errs.author = "Author is required";
    if (form.publisher_id <= 0) errs.publisher_id = "Publisher is required";
    if (form.publication_year <= 0) errs.publication_year = "Valid year is required";
    if (form.quantity < 0) errs.quantity = "Quantity cannot be negative";
    if (form.price < 0) errs.price = "Price cannot be negative";
    if (!selectedCategories.length) errs.category_ids = "Select at least one category";
    return errs;
  }

  // --- Modal handlers ---
  function openAdd() {
    setActive(null);
    setForm(emptyForm);
    setSelectedCategories([]);
    setFormErrors({});
    setPreviewImage(null);
    setSelectedFile(null);
    setModal("add");
  }

  function openEdit(b: Book) {
    setActive(b);
    const catIds = allCategories
      .filter(c => b.categories.includes(c.name))
      .map(c => c.category_id);
    setForm({
      title: b.title,
      publisher_id: b.publisher_id,
      category_ids: catIds,
      publication_year: b.publication_year,
      quantity: b.quantity,
      availability: b.availability,
      price: b.price,
      author: b.author,
      image_url: b.image_url,
    });
    setSelectedCategories(catIds);
    setFormErrors({});
    setPreviewImage(null);
    setSelectedFile(null);
    setModal("edit");
  }

  function openDelete(b: Book) {
    setActive(b);
    setModal("delete");
  }

  function closeModal() {
    setModal(false);
    setActive(null);
    setForm(emptyForm);
    setSelectedCategories([]);
    setFormErrors({});
    setPreviewImage(null);
    setSelectedFile(null);
  }

  // --- Save / Delete handlers ---
  async function handleSave() {
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("publisher_id", form.publisher_id.toString());
      fd.append("publication_year", `${form.publication_year}-01-01`);
      fd.append("quantity", form.quantity.toString());
      fd.append("availability", form.availability.toString());
      fd.append("price", form.price.toString());
      fd.append("author", form.author);
      selectedCategories.forEach(id => fd.append("category_ids[]", id.toString()));
      if (selectedFile) fd.append("image", selectedFile);
      else fd.append("image_url", form.image_url);

      if (modal === "add") {
        await createBook(fd);
        setToast({ type: "success", message: "Book added successfully" });
      } else if (modal === "edit" && active) {
        await updateBookById(active.book_id, fd);
        setToast({ type: "success", message: "Book updated successfully" });
      }

      closeModal();
      loadBooks();
    } catch {
      setToast({ type: "error", message: "Database error – please try later" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!active) return;
    setSubmitting(true);
    try {
      await deleteBookById(active.book_id);
      setToast({ type: "success", message: "Book deleted" });
      closeModal();
      loadBooks();
    } catch {
      setToast({ type: "error", message: "Database error – please try later" });
    } finally {
      setSubmitting(false);
    }
  }

  // --- Image upload preview ---
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  // --- Utility to build full image URL ---
  function getImageUrl(path: string): string {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://localhost:3000/${path.replace(/^\//, "")}`;
  }

  // --- Filtered list by search term ---
  const filtered = books.filter(
    b =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.publisher_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => a.book_id - b.book_id);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">

      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow">
          Book Management
        </h1>
        <p className="text-gray-600 text-lg">Manage your library books efficiently</p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, author, publisher..."
            className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#033060] text-white px-8 py-3 rounded-xl shadow hover:bg-[#021c3a] border border-[#033060] text-lg transition"
        >
          <Plus className="h-5 w-5" /> Add Book
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-[#f5f8fc] border-b border-[#dbeafe]">
            <tr>
              {["ID","Cover","Title","Publisher","Categories","Year","Qty","Avail","Price","Author","Actions"].map(h => (
                <th key={h} className="py-3 px-5 text-center text-[#033060] font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033060]" />
                  </div>
                  <p className="text-gray-500 mt-4">Loading…</p>
                </td>
              </tr>
            ) : paginated.length ? (
              paginated.map((b, idx) => (
                <tr key={b.book_id} className={`border-b hover:bg-[#f1f5fa] transition`}>
                  <td className="py-2.5 px-5 text-center">{b.book_id}</td>
                  <td className="py-2.5 px-5">
                    {b.image_url ? (
                      <img
                        src={getImageUrl(b.image_url)}
                        alt={b.title}
                        className="h-12 w-8 object-cover rounded"
                        onError={e => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <div className="h-12 w-8 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-5 text-[#033060]">{b.title}</td>
                  <td className="py-2.5 px-5">{b.publisher_name}</td>
                  <td className="py-2.5 px-5">{b.categories.join(", ") || "None"}</td>
                  <td className="py-2.5 px-5 text-center">{b.publication_year}</td>
                  <td className="py-2.5 px-5 text-center">{b.quantity}</td>
                  <td className="py-2.5 px-5 text-center">{b.availability ? "Yes":"No"}</td>
                  <td className="py-2.5 px-5 text-center">{b.price}</td>
                  <td className="py-2.5 px-5">{b.author}</td>
                  <td className="py-2.5 px-5 text-center flex justify-center gap-3">
                    <button onClick={() => openEdit(b)} className="p-2 rounded hover:bg-blue-100">
                      <Pencil className="h-5 w-5 text-[#033060]" />
                    </button>
                    <button onClick={() => openDelete(b)} className="p-2 rounded hover:bg-red-100">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-500">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="py-4 px-6 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "text-gray-300" : "text-[#033060] hover:bg-blue-100"}`}
          >
            Previous
          </button>
          <span className="text-[#033060] font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? "text-gray-300" : "text-[#033060] hover:bg-blue-100"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <Backdrop>
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-extrabold text-[#033060] uppercase mb-6">
              {modal === "add" ? "Add Book" : "Edit Book"}
            </h2>

            {/* Publisher */}
            <div className="mb-5">
              <label className="block text-sm mb-1 font-medium">
                Publisher <span className="text-[#033060]">*</span>
              </label>
              <select
                value={form.publisher_id}
                onChange={e => setForm({ ...form, publisher_id: +e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                  formErrors.publisher_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select publisher</option>
                {allPublishers.map(pub => (
                  <option key={pub.publisher_id} value={pub.publisher_id}>
                    {pub.name}
                  </option>
                ))}
              </select>
              {formErrors.publisher_id && (
                <p className="text-xs text-red-500 mt-1">{formErrors.publisher_id}</p>
              )}
            </div>

            {/* Other inputs */}
            {(["title","author","publication_year","quantity","price"] as const).map(key => (
              <div key={key} className="mb-5">
                <label className="block text-sm mb-1 font-medium">
                  {key.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
                  {(key==="title"||key==="author") && <span className="text-[#033060]">*</span>}
                </label>
                {key==="publication_year" ? (
                  <input
                    type="date"
                    value={form.publication_year ? `${form.publication_year}-01-01` : ""}
                    onChange={e => {
                      const yr = e.target.value ? new Date(e.target.value).getFullYear() : 0;
                      setForm({ ...form, publication_year: yr });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                      formErrors[key] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                ) : (
                  <input
                    type={key==="quantity"||key==="price"?"number":"text"}
                    min={key==="quantity"||key==="price" ? "0" : undefined}
                    value={form[key] as any}
                    onFocus={(e) => {
                      if ((key === "quantity" || key === "price") && form[key] === 0) {
                        e.target.value = "";
                      }
                    }}
                    onChange={e =>
                      setForm({
                        ...form,
                        [key]: key==="quantity"||key==="price" ? +e.target.value : e.target.value,
                      } as BookDTO)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                      formErrors[key] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
                {formErrors[key] && (
                  <p className="text-xs text-red-500 mt-1">{formErrors[key]}</p>
                )}
              </div>
            ))}

            {/* Category */}
            <div className="mb-5">
              <label className="block text-sm mb-1 font-medium">
                Category <span className="text-[#033060]">*</span>
              </label>
              <select
                value={selectedCategories[0] || 0}
                onChange={e => {
                  const value = Number(e.target.value);
                  setSelectedCategories(value > 0 ? [value] : []);
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                  formErrors.category_ids ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select category</option>
                {allCategories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formErrors.category_ids && (
                <p className="text-xs text-red-500 mt-1">{formErrors.category_ids}</p>
              )}
            </div>

            {/* Image upload */}
            <div className="mb-5">
              <label className="block text-sm mb-1 font-medium">
                {modal === "edit" ? "Change Cover Image" : "Cover Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#033060]"
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

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-[#033060]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-5 py-2 bg-[#033060] text-white rounded-lg hover:bg-[#021c3a] disabled:opacity-50 focus:ring-2 focus:ring-[#033060]"
              >{submitting ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Delete Confirmation */}
      {modal === "delete" && active && (
        <Backdrop>
          <div className="w-full max-w-xs bg-white rounded-2xl p-8 shadow-xl animate-scale-in text-center">
            <p className="mb-8 text-lg">
              Delete <span className="font-extrabold text-[#033060]">{active.title}</span>?
            </p>
            <div className="flex justify-center gap-8">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-[#033060]"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 bg-[#033060] text-white rounded-lg hover:bg-[#021c3a] disabled:opacity-50 focus:ring-2 focus:ring-[#033060]"
              >{submitting ? "Deleting…" : "Yes"}</button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bg-white transition-opacity duration-500 ${
            showToast ? "opacity-100" : "opacity-0"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="text-[#033060] font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
    {children}
  </div>
);