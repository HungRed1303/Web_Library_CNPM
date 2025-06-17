// src/pages/PublisherManagementPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle, Users } from "lucide-react";
import {
  getAllPublishers,
  createPublisher,
  updatePublisherById,
  deletePublisherById,
} from "../service/publisherService";

export interface Publisher {
  publisher_id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

export type PublisherDTO = Omit<Publisher, "publisher_id">;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailCell({ email }: { email: string }) {
  const ref = useRef<HTMLTableCellElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setShowTooltip(ref.current.scrollWidth > ref.current.clientWidth);
    }
  }, [email]);

  return (
    <td
      ref={ref}
      className="py-2.5 px-5 text-left text-[#033060] text-base w-[240px] max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap"
      title={showTooltip ? email : undefined}
    >
      {email}
    </td>
  );
}

export default function PublisherManagementPage() {
  const emptyForm: PublisherDTO = { name: "", email: "", phone_number: "", address: "" };
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [current, setCurrent] = useState<Publisher | null>(null);
  const [form, setForm] = useState<PublisherDTO>({ name: "", email: "", phone_number: "", address: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof PublisherDTO, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof PublisherDTO, boolean>>>({});
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPublishers();
      setPublishers((response.data ?? []) as Publisher[]);
    } catch (e: any) {
      setToast({ type: "error", message: "Failed to fetch publishers" });
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (field: keyof PublisherDTO, value: string): string | undefined => {
    if (field === "name" && !value.trim()) return "Name is required";
    if (field === "email") {
      if (!value.trim()) return "Email is required";
      if (!emailRegex.test(value)) return "Invalid email format";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErr: typeof errors = {};
    (["name", "email", "phone_number", "address"] as (keyof PublisherDTO)[]).forEach(f => {
      const err = validateField(f, form[f]);
      if (err) newErr[f] = err;
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      await createPublisher(form);
      setToast({ type: "success", message: "Publisher added successfully!" });
      fetchPublishers();
      setIsAddOpen(false);
    } catch {
      setToast({ type: "error", message: "Failed to add publisher" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!current || !validateForm()) return;
    try {
      setIsLoading(true);
      await updatePublisherById(current.publisher_id, form);
      setToast({ type: "success", message: "Publisher updated successfully!" });
      fetchPublishers();
      setIsEditOpen(false);
    } catch {
      setToast({ type: "error", message: "Failed to update publisher" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!current) return;
    try {
      setIsLoading(true);
      await deletePublisherById(current.publisher_id);
      setToast({ type: "success", message: "Publisher deleted successfully!" });
      fetchPublishers();
      setIsDeleteOpen(false);
    } catch {
      setToast({ type: "error", message: "Failed to delete publisher" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (toast) {
      setShowToast(true);
      const h = setTimeout(() => setShowToast(false), 2000);
      const c = setTimeout(() => setToast(null), 2500);
      return () => { clearTimeout(h); clearTimeout(c); };
    }
  }, [toast]);

  const filtered = publishers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone_number.includes(searchTerm)
  );
  const sorted = [...filtered].sort((a, b) => a.publisher_id - b.publisher_id);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedPublishers = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center" style={{ boxShadow: '0 4px 32px rgba(3,48,96,0.08)' }}>
        <div className="flex items-center mb-1">
          <Users className="h-12 w-12 text-[#033060] mr-3" />
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow" style={{ letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3' }}>
            Publisher Management
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Manage your publishers efficiently</p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
            <input
              placeholder="Search publishers by name, email, or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition-all duration-150"
              style={{ boxShadow: '0 1px 4px rgba(224,231,239,1)' }}
            />
          </div>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setIsAddOpen(true); }}
          className="flex items-center gap-2 bg-[#033060] text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-[#021c3a] border border-[#033060] transition-all duration-200 text-lg min-w-[200px] justify-center"
          style={{ boxShadow: '0 2px 8px rgba(182,198,227,1)' }}
        >
          <Plus className="h-5 w-5" /> Add Publisher
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(3,48,96,0.08)' }}>
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
              <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[60px]">ID</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[180px]">Name</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[240px]">Email</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[180px]">Phone</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Address</th>
              <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033060]" />
                  </div>
                  <p className="text-gray-500 mt-4">Loading publishers...</p>
                </td>
              </tr>
            ) : paginatedPublishers.length > 0 ? (
              paginatedPublishers.map(pub => (
                <tr key={pub.publisher_id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                  <td className="py-2.5 px-5 text-center text-[#033060]">{pub.publisher_id}</td>
                  <td className="py-2.5 px-5 text-[#033060]">{pub.name}</td>
                  <EmailCell email={pub.email} />
                  <td className="py-2.5 px-5">{pub.phone_number}</td>
                  <td className="py-2.5 px-5">{pub.address}</td>
                  <td className="py-2.5 px-5 text-center flex justify-center gap-4">
                    <button
                      onClick={() => { setCurrent(pub); setForm({ name: pub.name, email: pub.email, phone_number: pub.phone_number, address: pub.address }); setIsEditOpen(true); }}
                      className="group flex items-center text-[#033060] hover:text-[#021c3a] hover:bg-blue-100 px-2 py-1 rounded transition text-sm"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => { setCurrent(pub); setIsDeleteOpen(true); }}
                      className="group flex items-center text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded transition text-sm"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-base">No publishers found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                  </div>
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

      {/* Add / Edit Modal */}
      {(isAddOpen || isEditOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 animate-scale-in border border-[#dbeafe]">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-extrabold text-[#033060]">
                {isAddOpen ? "Add Publisher" : "Edit Publisher"}
              </h2>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                isAddOpen ? handleAdd() : handleEdit();
              }}
              className="space-y-4"
            >
              {(["name", "email", "phone_number", "address"] as (keyof PublisherDTO)[]).map(field => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-[#033060] font-semibold text-base capitalize">
                    {field.replace("_", " ")}{(field === "name" || field === "email") && "*"}
                  </label>
                  {field === "address" ? (
                    <textarea
                      rows={2}
                      value={form[field]}
                      onChange={e => {
                        setForm({ ...form, [field]: e.target.value });
                        setTouched(prev => ({ ...prev, [field]: true }));
                        setErrors(prev => ({ ...prev, [field]: validateField(field, e.target.value) }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 bg-white outline-none transition ${touched[field] && errors[field] ? "border-red-500" : ""}`}
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={form[field]}
                      onChange={e => {
                        setForm({ ...form, [field]: e.target.value });
                        setTouched(prev => ({ ...prev, [field]: true }));
                        setErrors(prev => ({ ...prev, [field]: validateField(field, e.target.value) }));
                      }}
                      onBlur={() => setTouched(prev => ({ ...prev, [field]: true }))}
                      className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 bg-white outline-none transition ${touched[field] && errors[field] ? "border-red-500" : ""}`}
                    />
                  )}
                  {touched[field] && errors[field] && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <XCircle className="h-4 w-4 mr-2" />
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                  className="px-5 py-2.5 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#033060] text-white font-semibold shadow hover:bg-[#021c3a] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      {isAddOpen ? "Adding..." : "Saving..."}
                    </div>
                  ) : (
                    isAddOpen ? "Add Publisher" : "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-scale-in border border-[#dbeafe]">
            <h2 className="text-xl font-extrabold text-[#033060] mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this publisher?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-5 py-2 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-10 bg-white text-[#033060] px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 text-xl font-bold z-50 transition-opacity ${showToast ? "opacity-100" : "opacity-0"}`}>
          {toast.type === "success" ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
