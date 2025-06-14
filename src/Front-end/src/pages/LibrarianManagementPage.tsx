"use client"

import React, { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Search, CheckCircle, XCircle, Users, UserPlus } from "lucide-react"
import { getAllLibrarians, getLibrarianById, updateLibrarianById, deleteLibrarianById, createLibrarian } from "../service/librarianService"

interface Librarian {
  librarian_id: number
  username: string
  email: string
  name: string
  start_date: string
  end_date: string | null
}

interface FormData {
  username: string
  name: string
  email: string
  start_date: string
  end_date: string | null
}

interface ValidationErrors {
  username?: string
  name?: string
  email?: string
  start_date?: string
  end_date?: string
}

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

export default function LibrarianManagementPage() {
  const [librarians, setLibrarians] = useState<Librarian[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentLibrarian, setCurrentLibrarian] = useState<Librarian | null>(null)
  const [formData, setFormData] = useState<FormData>({
    username: "",
    name: "",
    email: "",
    start_date: "",
    end_date: null
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchLibrarians()
  }, [])

  const fetchLibrarians = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching librarians..."); // Debugging log
      const token = localStorage.getItem('token');
      if (!token) {
          showToastMessage("error", "Authentication token missing. Please login.");
          setIsLoading(false);
          console.error("Authentication token missing."); // Debugging error
          return;
      }
      console.log("Token found, calling API..."); // Debugging log
      const response = await getAllLibrarians()
      console.log("API response received:", response); // Debugging log

      if (Array.isArray(response)) {
        setLibrarians(response)
        console.log("Librarians state updated."); // Debugging log
      } else {
        setLibrarians([])
        showToastMessage("error", "Invalid librarian data format received.")
        console.error("Invalid data format:", response); // Debugging error
      }
    } catch (error: any) {
      console.error("Failed to fetch librarians:", error)
      showToastMessage("error", error.message || "Failed to fetch librarians")
      setLibrarians([]) // Clear librarians on error
    } finally {
      setIsLoading(false)
      console.log("Finished fetching librarians."); // Debugging log
    }
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required"
        if (value.trim().length < 3) return "Username must be at least 3 characters"
        return undefined
      case "name":
        if (!value.trim()) return "Full Name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        return undefined
      case "email":
        if (!value.trim()) return "Email Address is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Invalid email format"
        return undefined
      case "start_date":
        if (!value) return "Start Date is required"
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Invalid date format (YYYY-MM-DD)"
        return undefined
      case "end_date":
        if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Invalid date format (YYYY-MM-DD)"
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    const fields = ["username", "name", "email", "start_date"]
    if (formData.end_date) fields.push("end_date")
    
    for (const field of fields) {
      const value = (formData[field as keyof typeof formData] as string) || ""
      const error = validateField(field, value)
      if (error) {
        newErrors[field as keyof ValidationErrors] = error
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateLibrarian = async () => {
    if (!validateForm()) {
      showToastMessage("error", "Please correct the errors in the form.")
      return
    }

    try {
      setIsLoading(true)
      const { username, name, email, start_date, end_date } = formData
      if (!username || !name || !email || !start_date) {
        showToastMessage("error", "Required fields are missing")
        return
      }
      const response = await createLibrarian({
        username,
        name,
        email,
        start_date,
        end_date
      })
      
      if (response) {
        setLibrarians([...librarians, response])
        setIsCreateModalOpen(false)
        resetForm()
        showToastMessage("success", "Librarian created successfully!")
      }
    } catch (error: any) {
      showToastMessage("error", error.message || "Failed to create librarian")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditLibrarian = async () => {
    if (!validateForm()) {
      showToastMessage("error", "Please correct the errors in the form.")
      return
    }

    try {
      setIsLoading(true)
      const { username, name, email, start_date, end_date } = formData
      if (!username || !name || !email || !start_date || !currentLibrarian?.librarian_id) {
        showToastMessage("error", "Required fields are missing")
        setIsLoading(false)
        return
      }
      // Đảm bảo start_date và end_date đúng định dạng hoặc null
      const formatDateString = (dateStr: string | null) => {
        if (!dateStr || dateStr === '' || dateStr === 'dd/mm/yyyy') return null;
        // Nếu đã đúng định dạng yyyy-mm-dd thì giữ nguyên
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        // Nếu là dd/mm/yyyy thì chuyển sang yyyy-mm-dd
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };
      const payload = {
        username,
        name,
        email,
        start_date: formatDateString(start_date),
        end_date: formatDateString(end_date)
      };
      const response = await updateLibrarianById(currentLibrarian.librarian_id, payload)
      if (response) {
        setLibrarians(librarians.map((lib) => 
          lib.librarian_id === currentLibrarian.librarian_id ? response : lib
        ))
        setIsEditModalOpen(false)
        resetForm()
        showToastMessage("success", "Librarian updated successfully!")
      }
    } catch (error: any) {
      showToastMessage("error", error.message || "Failed to update librarian")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLibrarian = async () => {
    if (!currentLibrarian) return

    try {
      setIsLoading(true)
      const response = await deleteLibrarianById(currentLibrarian.librarian_id)
      if (response) {
        setLibrarians(librarians.filter((lib) => lib.librarian_id !== currentLibrarian.librarian_id))
        setIsDeleteDialogOpen(false)
        setCurrentLibrarian(null)
        showToastMessage("success", "Librarian deleted successfully!")
      }
    } catch (error: any) {
      showToastMessage("error", error.message || "Failed to delete librarian")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (librarian: Librarian) => {
    setCurrentLibrarian(librarian)
    setFormData({
      username: librarian.username,
      name: librarian.name,
      email: librarian.email,
      start_date: toInputDateString(librarian.start_date),
      end_date: toInputDateString(librarian.end_date)
    })
    setIsEditModalOpen(true)
    setTouched({})
    setErrors({})
  }

  const openCreateModal = () => {
    setCurrentLibrarian(null)
    setFormData({
      username: "",
      name: "",
      email: "",
      start_date: "",
      end_date: null
    })
    setIsCreateModalOpen(true)
    setTouched({})
    setErrors({})
  }

  const openDeleteDialog = (librarian: Librarian) => {
    setCurrentLibrarian(librarian)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      start_date: "",
      end_date: null
    })
    setErrors({})
    setTouched({})
    setCurrentLibrarian(null)
  }

  const showToastMessage = (type: "success" | "error", message: string) => {
    setToast({ type, message })
  }

  useEffect(() => {
    if (toast) {
      setShowToast(true)
      const hideTimer = setTimeout(() => setShowToast(false), 2000)
      const clearTimer = setTimeout(() => setToast(null), 2500)
      return () => {
        clearTimeout(hideTimer)
        clearTimeout(clearTimer)
      }
    }
  }, [toast])

  const filteredLibrarians = librarians.filter(
    (librarian) =>
      librarian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      librarian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      librarian.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedLibrarians = [...filteredLibrarians].sort((a, b) => a.librarian_id - b.librarian_id);

  function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function toInputDateString(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="flex items-center mb-1">
          <Users className="h-12 w-12 text-[#033060] mr-3" />
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow" style={{letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3'}}>Librarian Management</h1>
        </div>
        <p className="text-gray-600 text-lg">Manage your library staff efficiently and securely</p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
            <input
              placeholder="Search librarians by name, email, or username..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition-all duration-150"
              style={{boxShadow: '0 1px 4px 0 #e0e7ef'}}
            />
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#033060] text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-[#021c3a] border border-[#033060] transition-all duration-200 text-lg min-w-[200px] justify-center"
          style={{boxShadow: '0 2px 8px 0 #b6c6e3'}}
        >
          <UserPlus className="h-5 w-5" />
          Add Librarian
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
              <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[60px]">ID</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[180px]">Username</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[200px]">Full Name</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[240px]">Email Address</th>
              <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[120px]">Start Date</th>
              <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[120px]">End Date</th>
              <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033060]"></div>
                  </div>
                  <p className="text-gray-500 mt-4">Loading librarians...</p>
                </td>
              </tr>
            ) : sortedLibrarians.length > 0 ? (
              sortedLibrarians.map((librarian) => (
                <tr key={librarian.librarian_id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                  <td className="py-2.5 px-5 text-center text-[#033060] text-base w-[60px]">{librarian.librarian_id}</td>
                  <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[180px] max-w-xs break-words whitespace-normal" title={librarian.username}>{librarian.username}</td>
                  <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[200px] max-w-xs break-words whitespace-normal" title={librarian.name}>{librarian.name}</td>
                  <EmailCell email={librarian.email} />
                  <td className="py-2.5 px-5 text-center text-[#033060] text-base w-[120px]">{formatDate(librarian.start_date)}</td>
                  <td className="py-2.5 px-5 text-center text-[#033060] text-base w-[120px]">{formatDate(librarian.end_date)}</td>
                  <td className="py-2.5 px-5 text-center w-[120px]">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openEditModal(librarian)}
                        className="group flex items-center text-[#033060] hover:text-[#021c3a] hover:bg-blue-100 px-2 py-1 rounded transition text-sm relative"
                        aria-label={`Edit ${librarian.name}`}
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(librarian)}
                        className="group flex items-center text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded transition text-sm border border-transparent hover:border-red-600 relative"
                        aria-label={`Delete ${librarian.name}`}
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-base">No librarians found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Librarian Modal */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 animate-scale-in border border-[#dbeafe] flex flex-col items-center" style={{boxShadow: '0 8px 32px 0 rgba(3,48,96,0.12)'}}>
            <div className="mb-6 w-full text-center">
              <h2 className="text-xl font-extrabold text-[#033060] mb-2">
                {isCreateModalOpen ? "Add New Librarian" : "Edit Librarian"}
              </h2>
              <p className="text-gray-600 text-base">
                {isCreateModalOpen ? "Create a new librarian account." : "Update the librarian's information."}
              </p>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                isCreateModalOpen ? handleCreateLibrarian() : handleEditLibrarian();
              }}
              className="space-y-4 w-full"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-[#033060] font-semibold text-base">Username*</label>
                <input
                  id="username"
                  name="username"
                  maxLength={50}
                  value={formData.username}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, username: e.target.value }))
                    setTouched(prev => ({ ...prev, username: true }))
                    const error = validateField("username", e.target.value)
                    setErrors(prev => ({ ...prev, username: error }))
                  }}
                  onBlur={e => {
                    setTouched(prev => ({ ...prev, username: true }))
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.username && errors.username ? 'border-red-500' : ''}`}
                  placeholder="Enter username"
                />
                {touched.username && errors.username && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.username}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[#033060] font-semibold text-base">Full Name*</label>
                <input
                  id="name"
                  name="name"
                  maxLength={100}
                  value={formData.name}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                    setTouched(prev => ({ ...prev, name: true }))
                    const error = validateField("name", e.target.value)
                    setErrors(prev => ({ ...prev, name: error }))
                  }}
                  onBlur={e => {
                    setTouched(prev => ({ ...prev, name: true }))
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.name && errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter full name"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#033060] font-semibold text-base">Email Address*</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={100}
                  value={formData.email}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                    setTouched(prev => ({ ...prev, email: true }))
                    const error = validateField("email", e.target.value)
                    setErrors(prev => ({ ...prev, email: error }))
                  }}
                  onBlur={e => {
                    setTouched(prev => ({ ...prev, email: true }))
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="start_date" className="text-[#033060] font-semibold text-base">Start Date*</label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date ? formData.start_date : ''}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, start_date: e.target.value }))
                    setTouched(prev => ({ ...prev, start_date: true }))
                    const error = validateField("start_date", e.target.value)
                    setErrors(prev => ({ ...prev, start_date: error }))
                  }}
                  onBlur={e => {
                    setTouched(prev => ({ ...prev, start_date: true }))
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.start_date && errors.start_date ? 'border-red-500' : ''}`}
                  placeholder="dd/mm/yyyy"
                />
                {touched.start_date && errors.start_date && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.start_date}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="end_date" className="text-[#033060] font-semibold text-base">End Date (optional)</label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date ? formData.end_date : ''}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, end_date: e.target.value || null }))
                    setTouched(prev => ({ ...prev, end_date: true }))
                    const error = validateField("end_date", e.target.value)
                    setErrors(prev => ({ ...prev, end_date: error }))
                  }}
                  onBlur={e => {
                    setTouched(prev => ({ ...prev, end_date: true }))
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.end_date && errors.end_date ? 'border-red-500' : ''}`}
                  placeholder="dd/mm/yyyy"
                />
                {touched.end_date && errors.end_date && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.end_date}</p>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setIsCreateModalOpen(false)
                  }}
                  className="px-5 py-2.5 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#033060] text-white font-semibold shadow hover:bg-[#021c3a] border border-[#033060] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isCreateModalOpen ? "Creating..." : "Saving..."}
                    </div>
                  ) : (
                    isCreateModalOpen ? "Create Librarian" : "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-scale-in border border-[#dbeafe]" style={{boxShadow: '0 8px 32px 0 rgba(3,48,96,0.12)'}}>
            <div className="mb-4">
              <h2 className="text-xl font-extrabold text-[#033060] mb-2">Confirm Deletion</h2>
              <p className="text-gray-600 text-base">Are you sure you want to delete this librarian?</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-5 py-2 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc] transition-all text-base"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteLibrarian}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold shadow hover:bg-red-700 border border-red-600 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-10 bg-white text-[#033060] px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 text-xl font-bold z-50 transition-all duration-500 ${showToast ? "opacity-100" : "opacity-0"}`} style={{boxShadow: '0 8px 32px 0 rgba(3,48,96,0.15)'}}>
          {toast.type === "success" ? <CheckCircle className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-500" />}
          {toast.message}
        </div>
      )}
    </div>
  )
}

export const metadata = {
  title: "Librarian Management System",
  description: "A Librarian Management System",
};