// src/pages/CategoryManagementPage.tsx
import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../service/categoryService";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Search } from "lucide-react";

/**
 * CategoryManagementPage – Add / Edit / Delete
 * Theme: Gradient background / Accent #033060 / Font Tahoma / Rounded cards / Shadow
 */

export interface Category {
  category_id: number;
  name: string;
  description: string;
}

export type CategoryDTO = Omit<Category, "category_id">;

const emptyForm: CategoryDTO = { name: "", description: "" };

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<false | "add" | "edit" | "delete">(false);
  const [active, setActive] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryDTO>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    getAllCategories()
      .then(res => setCategories(res.data as Category[]))
      .catch(() => setError("Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!toast) return;
    setShowToast(true);
    const h = setTimeout(() => setShowToast(false), 2500);
    const c = setTimeout(() => setToast(null), 3000);
    return () => { clearTimeout(h); clearTimeout(c); };
  }, [toast]);

  function validate(): Record<string,string> {
    const e: Record<string,string> = {};
    if (!form.name.trim()) e.name = "Category name is required";
    const dup = categories
      .filter(c => active ? c.category_id !== active.category_id : true)
      .some(c => c.name.toLowerCase() === form.name.trim().toLowerCase());
    if (dup) e.name = "Category name already exists";
    return e;
  }

  function openAdd() {
    setForm(emptyForm);
    setErrors({});
    setModal("add");
  }
  function openEdit(c: Category) {
    setActive(c);
    setForm({ name: c.name, description: c.description });
    setErrors({});
    setModal("edit");
  }
  function openDelete(c: Category) {
    setActive(c);
    setModal("delete");
  }
  function closeModal() {
    setModal(false);
    setActive(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleSave() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      if (modal === "add") {
        await createCategory(form);
        setToast({ type: "success", message: "Category added successfully" });
      }
      if (modal === "edit" && active) {
        await updateCategoryById(active.category_id, form);
        setToast({ type: "success", message: "Category updated successfully" });
      }
      closeModal();
      load();
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
      await deleteCategoryById(active.category_id);
      setToast({ type: "success", message: "Category deleted" });
      closeModal();
      load();
    } catch {
      setToast({ type: "error", message: "Database error – please try later" });
    } finally {
      setSubmitting(false);
    }
  }

  // Filter categories based on search term
  const filtered = categories.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => a.category_id - b.category_id);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow">
          Category Management
        </h1>
        <p className="text-gray-600 text-lg">Manage your book categories efficiently</p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or description..."
            className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#033060] text-white px-8 py-3 rounded-xl shadow hover:bg-[#021c3a] border border-[#033060] text-lg transition"
        >
          <Plus className="h-5 w-5" /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-[#f5f8fc] border-b border-[#dbeafe]">
            <tr>
              {["ID", "Name", "Description", "Actions"].map(h => (
                <th key={h} className="py-3 px-5 text-center text-[#033060] font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033060]" />
                  </div>
                  <p className="text-gray-500 mt-4">Loading…</p>
                </td>
              </tr>
            ) : paginated.length ? (
              paginated.map((c, idx) => (
                <tr key={c.category_id} className={`border-b hover:bg-[#f1f5fa] transition`}>
                  <td className="py-2.5 px-5 text-center">{c.category_id}</td>
                  <td className="py-2.5 px-5 text-[#033060] text-center">{c.name}</td>
                  <td className="py-2.5 px-5 text-center">{c.description}</td>
                  <td className="py-2.5 px-5 text-center flex justify-center gap-3">
                    <button onClick={() => openEdit(c)} className="p-2 rounded hover:bg-blue-100">
                      <Pencil className="h-5 w-5 text-[#033060]" />
                    </button>
                    <button onClick={() => openDelete(c)} className="p-2 rounded hover:bg-red-100">
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No categories found
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
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl animate-scale-in">
            <h2 className="text-xl font-extrabold text-[#033060] uppercase mb-6">
              {modal === "add" ? "Add Category" : "Edit Category"}
            </h2>
            {(["name", "description"] as (keyof CategoryDTO)[]).map(f => (
              <div key={f} className="mb-5">
                <label className="block text-sm mb-1 font-medium">
                  {f.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                  {f === "name" && <span className="text-[#033060]">*</span>}
                </label>
                {f === "description" ? (
                  <textarea
                    rows={2}
                    value={form[f]}
                    onChange={e => setForm({ ...form, [f]: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                      errors[f] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                ) : (
                  <input
                    value={form[f]}
                    onChange={e => setForm({ ...form, [f]: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                      errors[f] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
                {errors[f] && <p className="text-xs text-red-500 mt-1">{errors[f]}</p>}
              </div>
            ))}
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
              >
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* Delete Confirmation */}
      {modal === "delete" && active && (
        <Backdrop>
          <div className="w-full max-w-xs bg-white rounded-2xl p-8 shadow-xl animate-scale-in text-center">
            <p className="mb-8 text-lg">
              Delete <span className="font-extrabold text-[#033060]">{active.name}</span>?
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
              >
                {submitting ? "Deleting…" : "Yes"}
              </button>
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
