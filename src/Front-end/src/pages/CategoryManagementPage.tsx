// src/pages/CategoryManagementPage.tsx
import { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../service/categoryService";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

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

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] font-[Tahoma] flex flex-col items-center py-10">
      <header className="w-full max-w-7xl text-center mb-10">
        <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow">
          Category Management
        </h1>
      </header>

      <main className="w-full max-w-7xl px-6">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#033060] text-white px-5 py-2.5 rounded-xl shadow hover:bg-[#021c3a] transition"
        >
          <Plus size={18} /> Add Category
        </button>

        {loading ? (
          <p className="mt-8 text-center text-gray-500 animate-pulse">Loading…</p>
        ) : error ? (
          <p className="mt-8 text-center text-red-600">{error}</p>
        ) : (
          <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                <tr>
                  {["ID","Name","Description","Actions"].map(h => (
                    <th key={h} className="py-3 px-5 text-left text-[#033060] font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...categories]
                  .sort((a, b) => a.category_id - b.category_id)
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((c,i) => (
                  <tr key={c.category_id} className={`border-b ${i%2===0?"bg-white":"bg-[#e3ecf7]"} hover:bg-[#f1f5fa] transition`}>
                    <td className="py-2.5 px-5">{c.category_id}</td>
                    <td className="py-2.5 px-5">{c.name}</td>
                    <td className="py-2.5 px-5">{c.description}</td>
                    <td className="py-2.5 px-5 flex gap-3">
                      <button onClick={()=>openEdit(c)} className="p-2 rounded hover:bg-[#033060]/10">
                        <Pencil className="text-[#033060]" />
                      </button>
                      <button onClick={()=>openDelete(c)} className="p-2 rounded hover:bg-red-100">
                        <Trash2 className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
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
                Page {currentPage} of {Math.ceil(categories.length / itemsPerPage)}
              </span>
              <button
                disabled={currentPage === Math.ceil(categories.length / itemsPerPage)}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 rounded ${currentPage === Math.ceil(categories.length / itemsPerPage) ? "text-gray-300" : "text-[#033060] hover:bg-blue-100"}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {(modal==="add"||modal==="edit") && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-[#033060] mb-6">
              {modal==="add"?"Add Category":"Edit Category"}
            </h2>
            {(["name","description"] as (keyof CategoryDTO)[]).map(f=>(
              <div key={f} className="mb-4">
                <label className="block mb-1 font-medium capitalize">
                  {f.replace("_"," ")}{f==="name"&&<span className="text-red-500 ml-1">*</span>}
                </label>
                {f==="description"?
                  <textarea
                    rows={2}
                    value={form[f]}
                    onChange={e=>setForm({...form,[f]:e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${errors[f]?"border-red-500":"border-gray-300"}`}
                  />:
                  <input
                    value={form[f]}
                    onChange={e=>setForm({...form,[f]:e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${errors[f]?"border-red-500":"border-gray-300"}`}
                  />
                }
                {errors[f] && <p className="text-xs text-red-500 mt-1">{errors[f]}</p>}
              </div>
            ))}
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-5 py-2 bg-[#033060] text-white rounded-lg hover:bg-[#021c3a] disabled:opacity-50"
              >
                {submitting?"Saving…":"Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal==="delete" && active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-6 text-center animate-scale-in">
            <p className="mb-6 text-lg">
              Delete <strong>{active.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                No
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 bg-[#033060] text-white rounded-lg hover:bg-[#021c3a] disabled:opacity-50"
              >
                {submitting?"Deleting…":"Yes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg transition-opacity ${showToast?"opacity-100":"opacity-0"}`}>
          {toast.type==="success"?<CheckCircle className="text-green-500"/>:<XCircle className="text-red-500"/>}
          <span className="text-[#033060]">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
