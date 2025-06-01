import React, { useEffect, useState } from "react";
import {
  getAllPublishers,
  createPublisher,
  updatePublisherById,
  deletePublisherById,
} from "../service/Services";
import { Plus, Pencil, Trash2 } from "lucide-react";

/** =============================================================
 *  PublisherManagementPage – Add / Edit / Delete
 *  Professional modern theme (light background + blue accents)
 *  Font  : "Poppins", fallback sans – headings 24 px bold, body 16 px
 *  Colors: Background #FEFEFE · Accent #467DA7
 *  UX    : Left-aligned content, large rounded corners, subtle shadows
 *  NOTE  : Requires lucide-react + TailwindCSS 3+ with JIT
 * ===========================================================*/

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
  const [modal, setModal] = useState<false | "add" | "edit" | "delete">(false);
  const [active, setActive] = useState<Publisher | null>(null);

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
        setToast("Publisher added successfully");
      }
      if (modal === "edit" && active) {
        await updatePublisherById(active.publisher_id, form);
        setToast("Publisher updated successfully");
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
    <div className="min-h-screen w-full bg-[#FEFEFE] text-gray-900 font-[Poppins]">
      <header className="max-w-5xl mx-auto py-8 pl-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#467DA7] text-center">
          Publisher Management
        </h1>
      </header>

      <main className="max-w-5xl mx-auto pl-6 pb-20 text-left">
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#467DA7] text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#467DA7]/90 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition"
        >
          <Plus size={18} /> Add Publisher
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
                    {["ID", "Name", "Email", "Phone", "Address", "Actions"].map((h) => (
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
                  {publishers.map((p, idx) => (
                    <tr
                      key={p.publisher_id}
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-[#467DA7]/10 transition`}
                    >
                      <td className="px-4 py-3 border-b border-gray-200">{p.publisher_id}</td>
                      <td className="px-4 py-3 border-b">{p.name}</td>
                      <td className="px-4 py-3 border-b">{p.email}</td>
                      <td className="px-4 py-3 border-b">{p.phone_number}</td>
                      <td className="px-4 py-3 border-b">{p.address}</td>
                      <td className="px-4 py-3 border-b space-x-2">
                        <IconBtn icon={<Pencil size={16} />} onClick={() => openEdit(p)} />
                        <IconBtn icon={<Trash2 size={16} />} onClick={() => openDelete(p)} color="red" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 mt-8 md:hidden">
              {publishers.map((p) => (
                <div
                  key={p.publisher_id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-[#467DA7] text-lg text-left">{p.name}</h3>
                    <div className="flex gap-2">
                      <IconBtn icon={<Pencil size={16} />} onClick={() => openEdit(p)} />
                      <IconBtn icon={<Trash2 size={16} />} onClick={() => openDelete(p)} color="red" />
                    </div>
                  </div>
                  <InfoRow label="ID" value={p.publisher_id} />
                  <InfoRow label="Email" value={p.email} />
                  <InfoRow label="Phone" value={p.phone_number} />
                  <InfoRow label="Address" value={p.address} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {(modal === "add" || modal === "edit") && (
        <Backdrop>
          <div className="w-full max-w-sm bg-white border-2 border-[#467DA7] rounded-2xl p-8 shadow-xl animate-scale-in text-gray-900">
            <h2 className="text-xl font-extrabold text-left uppercase mb-6 text-[#467DA7]">
              {modal === "add" ? "Add Publisher" : "Edit Publisher"}
            </h2>

            {(Object.keys(empty) as (keyof PublisherDTO)[]).map((f) => (
              <div key={f} className="mb-5">
                <label className="block text-sm mb-1 font-medium text-gray-700 capitalize">
                  {f.replace("_", " ")}
                  {(f === "name" || f === "email") && (
                    <span className="text-[#467DA7]"> *</span>
                  )}
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
                {formErrors[f] && (
                  <p className="text-xs text-[#467DA7] mt-1">{formErrors[f]}</p>
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
              Delete <span className="font-extrabold text-[#467DA7]">{active.name}</span>?
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
          className="fixed bottom-6 left-6 bg-[#467DA7] text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in"
          onAnimationEnd={() => setTimeout(() => setToast(null), 3000)}
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default PublisherManagementPage;

const Backdrop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
    {children}
  </div>
);

const IconBtn: React.FC<{ icon: React.ReactElement; onClick: () => void; color?: "red" }> = ({ icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full hover:bg-${color === "red" ? "red" : "[#467DA7]"}/10 focus-visible:ring-2 focus-visible:ring-[#467DA7] transition`}
  >
    {icon}
  </button>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <p className="text-sm mb-1 text-left">
    <span className="font-medium">{label}: </span>
    {value}
  </p>
);

const inputCls = (err?: string) =>
  `w-full bg-white border ${err ? "border-[#467DA7]" : "border-gray-300"} rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#467DA7] focus:border-[#467DA7] transition`;
