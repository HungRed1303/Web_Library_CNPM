// src/pages/PublisherManagementPage.tsx
import { useEffect, useState } from "react";
import {
  getAllPublishers,
  createPublisher,
  updatePublisherById,
  deletePublisherById,
} from "../service/publisherService";
import { Plus, Pencil, Trash2, CheckCircle } from "lucide-react";

/**
 * PublisherManagementPage – Add / Edit / Delete
 * Theme: Gradient background / Accent #033060 / Font Tahoma / Rounded cards / Shadow
 */

export interface Publisher {
  publisher_id: number;
  name: string;
  address: string;
  email: string;
  phone_number: string;
}

export type PublisherDTO = Omit<Publisher, "publisher_id">;

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const emptyForm: PublisherDTO = { name: "", address: "", email: "", phone_number: "" };

export default function PublisherManagementPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<false | "add" | "edit" | "delete">(false);
  const [active, setActive] = useState<Publisher | null>(null);
  const [form, setForm] = useState<PublisherDTO>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showToast, setShowToast] = useState(false);

  // load list
  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    getAllPublishers()
      .then(res => setPublishers(res.data as Publisher[]))
      .catch(() => setError("Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  }

  // toast auto-hide
  useEffect(() => {
    if (!toast) return;
    setShowToast(true);
    const h = setTimeout(() => setShowToast(false), 2500);
    const c = setTimeout(() => setToast(null), 3000);
    return () => { clearTimeout(h); clearTimeout(c); };
  }, [toast]);

  // validate
  function validate(): Record<string,string> {
    const e: Record<string,string> = {};
    if (!form.name.trim()) e.name = "Publisher name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Invalid email format";
    const dup = publishers
      .filter(p => active ? p.publisher_id !== active.publisher_id : true)
      .some(p => p.name.toLowerCase() === form.name.trim().toLowerCase());
    if (dup) e.name = "Publisher name already exists";
    return e;
  }

  // open/close
  function openAdd() {
    setForm(emptyForm);
    setErrors({});
    setModal("add");
  }
  function openEdit(p: Publisher) {
    setActive(p);
    setForm({ name:p.name, address:p.address, email:p.email, phone_number:p.phone_number });
    setErrors({});
    setModal("edit");
  }
  function openDelete(p: Publisher) {
    setActive(p);
    setModal("delete");
  }
  function closeModal() {
    setModal(false);
    setActive(null);
    setForm(emptyForm);
    setErrors({});
  }

  // save
  async function handleSave() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      if (modal==="add") {
        await createPublisher(form);
        setToast({ type:"success", message:"Publisher added successfully" });
      }
      if (modal==="edit" && active) {
        await updatePublisherById(active.publisher_id, form);
        setToast({ type:"success", message:"Publisher updated successfully" });
      }
      closeModal();
      load();
    } catch {
      setToast({ type:"error", message:"Database error – please try later" });
    } finally {
      setSubmitting(false);
    }
  }

  // delete
  async function handleDelete() {
    if (!active) return;
    setSubmitting(true);
    try {
      await deletePublisherById(active.publisher_id);
      setToast({ type:"success", message:"Publisher deleted" });
      closeModal();
      load();
    } catch {
      setToast({ type:"error", message:"Database error – please try later" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] font-[Tahoma] flex flex-col items-center py-10">
      <header className="w-full max-w-7xl text-center mb-10">
        <h1 className="text-5xl font-extrabold text-[#033060]">Publisher Management</h1>
      </header>

      <main className="w-full max-w-7xl px-6">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#033060] text-white px-5 py-2.5 rounded-xl shadow hover:bg-[#021c3a] transition"
        >
          <Plus size={18} /> Add Publisher
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
                  {["ID","Name","Email","Phone","Address","Actions"].map(h => (
                    <th
                      key={h}
                      className="py-3 px-5 text-left text-[#033060] font-bold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publishers.map((p, i) => (
                  <tr key={p.publisher_id} className={`border-b ${i%2===0?"bg-white":"bg-[#f1f5fa]"} hover:bg-[#e3ecf7] transition`}>
                    <td className="py-2.5 px-5 text-[#033060]">{p.publisher_id}</td>
                    <td className="py-2.5 px-5">{p.name}</td>
                    <td className="py-2.5 px-5">{p.email}</td>
                    <td className="py-2.5 px-5">{p.phone_number}</td>
                    <td className="py-2.5 px-5">{p.address}</td>
                    <td className="py-2.5 px-5 flex gap-3">
                      <button onClick={()=>openEdit(p)} className="p-2 rounded hover:bg-[#033060]/10">
                        <Pencil className="text-[#033060]" />
                      </button>
                      <button onClick={()=>openDelete(p)} className="p-2 rounded hover:bg-red-100">
                        <Trash2 className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modals */}
      {(modal==="add"||modal==="edit") && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-[#033060] mb-6">
              {modal==="add" ? "Add Publisher" : "Edit Publisher"}
            </h2>
            {(["name","email","phone_number","address"] as (keyof PublisherDTO)[]).map(f=>(
              <div className="mb-4" key={f}>
                <label className="block font-medium text-gray-700 capitalize mb-1">
                  {f.replace("_"," ")}
                  {(f==="name"||f==="email")&&<span className="text-red-500 ml-1">*</span>}
                </label>
                {f==="address" ? (
                  <textarea
                    rows={2}
                    value={form[f] as string}
                    onChange={e=>setForm({...form,[f]:e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                      errors[f]?"border-red-500":"border-gray-300"
                    }`}
                  />
                ):(
                  <input
                    type={f==="email"?"email":"text"}
                    value={form[f] as string}
                    onChange={e=>setForm({...form,[f]:e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#033060] ${
                      errors[f]?"border-red-500":"border-gray-300"
                    }`}
                  />
                )}
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
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                {submitting ? "Deleting…" : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg transition-opacity ${
          showToast ? "opacity-100" : "opacity-0"
        }`}>
          <CheckCircle className="text-green-500" />
          <span className="text-[#033060]">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
