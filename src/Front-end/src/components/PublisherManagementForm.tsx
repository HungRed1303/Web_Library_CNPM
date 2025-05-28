import React, { useEffect, useState } from "react";
import {
  getAllPublishers,
  createPublisher,
  updatePublisherById,
  deletePublisherById,
} from "../service/Services";
import { Plus, Pencil, Trash2 } from "lucide-react";

/** ==============================================================
 *  PublisherManagementPage – Add / Edit / Delete
 *  Professional dark theme with restrained neon‑pink accents
 *  Font  : Tahoma – headings 20 px bold uppercase, body 16 px
 *  Colors: Deep charcoal bg (#0d0d0d) · Accent #ff2df2 / #e600c8
 *  UX    : Softer shadows, focus rings, mobile‑first responsive
 *  NOTE  : Requires lucide-react + TailwindCSS 3
 * ============================================================*/

export interface Publisher {
  publisher_id: number;
  name: string;
  address: string;
  email: string;
  phone_number: string;
}

export type PublisherDTO = Omit<Publisher, "publisher_id">;

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const PublisherManagementPage: React.FC = () => {
  /* --------------------------- STATE --------------------------- */
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* modal state: false | "add" | "edit" | "delete" */
  const [modal, setModal] = useState<false | "add" | "edit" | "delete">(false);
  const [active, setActive] = useState<Publisher | null>(null);

  /* form state cho add / edit */
  const empty: PublisherDTO = { name: "", address: "", email: "", phone_number: "" };
  const [form, setForm] = useState<PublisherDTO>(empty);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* ------------------------- LOAD LIST ------------------------- */
  const load = () => {
    setLoading(true);
    getAllPublishers()
      .then((res) => setPublishers(res.data as Publisher[]))
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
  const openEdit = (p: Publisher) => {
    setActive(p);
    setForm({ name: p.name, address: p.address, email: p.email, phone_number: p.phone_number });
    setFormErrors({});
    setModal("edit");
  };
  const openDelete = (p: Publisher) => {
    setActive(p);
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
    if (!form.name.trim()) e.name = "Publisher name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Invalid email format";

    const dup = publishers
      .filter((p) => (active ? p.publisher_id !== active.publisher_id : true))
      .some((p) => p.name.toLowerCase() === form.name.trim().toLowerCase());
    if (dup) e.name = "Publisher name already exists";

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
        await createPublisher(form);
        setToast("Publisher added");
      }
      if (modal === "edit" && active) {
        await updatePublisherById(active.publisher_id, form);
        setToast("Publisher updated");
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
      await deletePublisherById(active.publisher_id);
      setToast("Publisher deleted");
      closeModal();
      load();
    } catch {
      setToast("Database error – please try later");
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------- UI ------------------------------ */
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white-300 font-[Tahoma] p-6">
      <h1 className="text-center text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6">
        Publisher Management
      </h1>

      {/* ADD BUTTON */}
      <button
        onClick={openAdd}
        className="flex items-center gap-2 bg-pink-500 text-black px-4 py-2 rounded-md shadow hover:bg-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 transition"
      >
        <Plus size={16} /> Add Publisher
      </button>

      {/* ---------- TABLE – DESKTOP ---------- */}
      {loading ? (
        <p className="mt-6 animate-pulse">Loading…</p>
      ) : error ? (
        <p className="mt-6 text-red-400">{error}</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto mt-6 border border-[#1e1e1e] rounded-lg">
            <table className="w-full text-sm leading-6">
              <thead className="bg-[#141414] text-pink-200">
                <tr>
                  {["ID", "Name", "Email", "Phone", "Actions"].map((h) => (
                    <th key={h} className="px-3 py-2 border-b border-[#262626] text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publishers.map((p) => (
                  <tr key={p.publisher_id} className="odd:bg-[#111111] hover:bg-[#1a1a1a]">
                    <td className="px-3 py-2 border-b border-[#1e1e1e]">{p.publisher_id}</td>
                    <td className="px-3 py-2 border-b">{p.name}</td>
                    <td className="px-3 py-2 border-b">{p.email}</td>
                    <td className="px-3 py-2 border-b">{p.phone_number}</td>
                    <td className="px-3 py-2 border-b space-x-2">
                      <IconBtn icon={<Pencil size={16} />} onClick={() => openEdit(p)} />
                      <IconBtn icon={<Trash2 size={16} />} onClick={() => openDelete(p)} color="red" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ---------- CARDS – MOBILE ---------- */}
          <div className="flex flex-col gap-4 mt-6 md:hidden">
            {publishers.map((p) => (
              <div key={p.publisher_id} className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-pink-200">{p.name}</h3>
                  <div className="flex gap-2">
                    <IconBtn icon={<Pencil size={16} />} onClick={() => openEdit(p)} />
                    <IconBtn icon={<Trash2 size={16} />} onClick={() => openDelete(p)} color="red" />
                  </div>
                </div>
                <p className="text-xs mb-1">ID: {p.publisher_id}</p>
                <p className="text-xs mb-1">Email: {p.email}</p>
                <p className="text-xs">Phone: {p.phone_number}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ------------------ MODAL ADD / EDIT ------------------ */}
      {(modal === "add" || modal === "edit") && (
        <Backdrop>
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-pink-600 rounded-lg p-6 shadow-lg animate-scale-in">
            <h2 className="text-lg font-bold uppercase text-pink-200 mb-4">
              {modal === "add" ? "Add Publisher" : "Edit Publisher"}
            </h2>

            {(Object.keys(empty) as (keyof PublisherDTO)[]).map((f) => (
              <div key={f} className="mb-4">
                <label className="block text-sm mb-1 text-pink-300 capitalize">
                  {f.replace("_", " ")}
                  {(f === "name" || f === "email") && <span className="text-pink-500"> *</span>}
                </label>
                {f === "address" ? (
                  <textarea
                    rows={2}
                    value={form[f] as string}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    className={inputCls(formErrors[f])}
                  />
                ) : (
                  <input
                    value={form[f] as string}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    className={inputCls(formErrors[f])}
                  />
                )}
                {formErrors[f] && <p className="text-xs text-yellow-300 mt-1">{formErrors[f]}</p>}
              </div>
            ))}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-pink-500 rounded-md hover:bg-[#262626] focus-visible:ring-2 focus-visible:ring-pink-400 transition"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleSave}
                className="px-4 py-2 bg-pink-500 text-black font-semibold rounded-md hover:bg-pink-400 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-pink-400 transition"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* ------------------ CONFIRM DELETE ------------------ */}
      {modal === "delete" && active && (
        <Backdrop>
          <div className="w-full max-w-xs bg-[#1a1a1a] border border-pink-600 rounded-lg p-6 shadow-lg text-center animate-scale-in">
            <p className="mb-6">
              Delete <span className="font-bold text-pink-200">{active.name}</span>?
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-pink-500 rounded-md hover:bg-[#262626] focus-visible:ring-2 focus-visible:ring-pink-400 transition"
              >
                No
              </button>
              <button
                disabled={submitting}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-black font-semibold rounded-md hover:bg-red-500 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-red-500 transition"
              >
                {submitting ? "Deleting…" : "Yes"}
              </button>
            </div>
          </div>
        </Backdrop>
      )}

      {/* ---------------------- TOAST ---------------------- */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 bg-pink-500 text-black px-4 py-2 rounded-md shadow-lg animate-slide-in"
          onAnimationEnd={() => setTimeout(() => setToast(null), 3000)}
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default PublisherManagementPage;

/* ------------------------- COMPONENTS ------------------------- */
const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    {children}
  </div>
);

const IconBtn: React.FC<{ icon: React.ReactElement; onClick: () => void; color?: "red" }> = ({ icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-1 rounded-md hover:bg-${color === "red" ? "red" : "pink"}-500/20 focus-visible:ring-2 focus-visible:ring-${color === "red" ? "red" : "pink"}-400 transition`}
  >
    {icon}
  </button>
);

/* --------------------------- STYLES --------------------------- */
const inputCls = (err?: string) =>
  `w-full bg-[#121212] border ${err ? "border-yellow-400" : "border-pink-600"} rounded-md px-3 py-2 text-sm placeholder:text-pink-400 outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-600 transition`;
