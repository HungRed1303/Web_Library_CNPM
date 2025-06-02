"use client"

import React, { useState, useEffect } from "react"
import { Pencil, Trash2, Search, CheckCircle, XCircle, Users, UserPlus } from "lucide-react"

interface Librarian {
  id: string
  name: string
  email: string
  password: string
}

interface ValidationErrors {
  id?: string
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function LibrarianManagementPage() {
  const [librarians, setLibrarians] = useState<Librarian[]>([
    { id: "LIB001", name: "Jane Smith", email: "jane.smith@library.com", password: "********" },
    { id: "LIB002", name: "John Doe", email: "john.doe@library.com", password: "********" },
    { id: "LIB003", name: "Alice Johnson", email: "alice.j@library.com", password: "********" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentLibrarian, setCurrentLibrarian] = useState<Librarian | null>(null)
  const [formData, setFormData] = useState<Librarian & { confirmPassword?: string }>({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showToast, setShowToast] = useState(false)

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
      librarian.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    if (!isAddModalOpen && !isEditModalOpen) {
      setErrors({})
      setTouched({})
    }
  }, [isAddModalOpen, isEditModalOpen])

  const validateField = (name: string, value: string, formMode: "add" | "edit"): string | undefined => {
    switch (name) {
      case "id":
        if (!value.trim()) return "Librarian ID is required"
        if (formMode === "add" && librarians.some((lib) => lib.id === value)) return "This Librarian ID already exists"
        return undefined
      case "name":
        if (!value.trim()) return "Full Name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        return undefined
      case "email":
        if (!value.trim()) return "Email Address is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Invalid email format"
        if (formMode === "add" && librarians.some((lib) => lib.email === value))
          return "This Email Address is already in use"
        if (formMode === "edit" && librarians.some((lib) => lib.email === value && lib.id !== formData.id))
          return "This Email Address is already in use"
        return undefined
      case "password":
        if (formMode === "add" && !value.trim()) return "Password is required"
        if (value.trim() && value.trim().length < 6) return "Password must be at least 6 characters"
        return undefined
      case "confirmPassword":
        if (formMode === "add" && !value.trim()) return "Please confirm your password"
        if (value !== formData.password) return "Passwords do not match"
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (mode: "add" | "edit"): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true
    const fieldsToValidate = mode === "add" ? ["id", "name", "email", "password", "confirmPassword"] : ["name", "email"]
    for (const field of fieldsToValidate) {
      const value = (formData[field as keyof typeof formData] as string) || ""
      const error = validateField(field, value, mode)
      if (error) {
        newErrors[field as keyof ValidationErrors] = error
        isValid = false
      }
    }
    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
    const mode = isAddModalOpen ? "add" : "edit"
    const error = validateField(name, value, mode)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleAddLibrarian = () => {
    if (!validateForm("add")) {
      setToast({ type: "error", message: "Please correct the errors in the form." })
      return
    }
    const { confirmPassword, ...newLibrarian } = formData
    setLibrarians([...librarians, newLibrarian])
    setIsAddModalOpen(false)
    resetForm()
    setToast({ type: "success", message: "Librarian added successfully!" })
  }

  const handleEditLibrarian = () => {
    if (!validateForm("edit")) {
      setToast({ type: "error", message: "Please correct the errors in the form." })
      return
    }
    const updatedLibrarians = librarians.map((lib) => {
      if (lib.id === formData.id) {
        return {
          ...lib,
          name: formData.name,
          email: formData.email,
          password: formData.password || lib.password,
        }
      }
      return lib
    })
    setLibrarians(updatedLibrarians)
    setIsEditModalOpen(false)
    resetForm()
    setToast({ type: "success", message: "Librarian updated successfully!" })
  }

  const handleDeleteLibrarian = () => {
    if (currentLibrarian) {
      setLibrarians(librarians.filter((lib) => lib.id !== currentLibrarian.id))
      setIsDeleteDialogOpen(false)
      setCurrentLibrarian(null)
      setToast({ type: "success", message: "Librarian deleted successfully!" })
    }
  }

  const openEditModal = (librarian: Librarian) => {
    setFormData({ ...librarian, password: "", confirmPassword: "" })
    setIsEditModalOpen(true)
    setTouched({})
    setErrors({})
  }

  const openDeleteDialog = (librarian: Librarian) => {
    setCurrentLibrarian(librarian)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ id: "", name: "", email: "", password: "", confirmPassword: "" })
    setErrors({})
    setTouched({})
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
              placeholder="Search librarians by name, email, or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition-all duration-150"
              style={{boxShadow: '0 1px 4px 0 #e0e7ef'}}
            />
          </div>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsAddModalOpen(true)
          }}
          className="flex items-center gap-2 bg-[#033060] text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-[#021c3a] border border-[#033060] transition-all duration-200 text-lg min-w-[200px] justify-center"
          style={{boxShadow: '0 2px 8px 0 #b6c6e3'}}
        >
          <UserPlus className="h-5 w-5" />
          Add New Librarian
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Librarian ID</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Full Name</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Email Address</th>
              <th className="py-3 px-5 text-right text-[#033060] font-bold text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLibrarians.length > 0 ? (
              filteredLibrarians.map((librarian, index) => (
                <tr key={librarian.id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                  <td className="py-2.5 px-5">
                    <span className="bg-[#e0e7ef] text-[#033060] font-bold px-3 py-0.5 rounded-lg text-xs tracking-wide border border-[#b6c6e3]">{librarian.id}</span>
                  </td>
                  <td className="py-2.5 px-5 font-semibold text-[#033060] text-base">{librarian.name}</td>
                  <td className="py-2.5 px-5 text-[#033060] text-base">{librarian.email}</td>
                  <td className="py-2.5 px-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(librarian)}
                        className="flex items-center gap-1 text-[#033060] hover:text-[#021c3a] px-2 py-1 rounded transition text-sm"
                        aria-label={`Edit ${librarian.name}`}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteDialog(librarian)}
                        className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded transition text-sm border border-transparent hover:border-red-600"
                        aria-label={`Delete ${librarian.name}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8">
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

      {/* Add Librarian Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 animate-scale-in border border-[#dbeafe]" style={{boxShadow: '0 8px 32px 0 rgba(3,48,96,0.12)'}}>
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-[#033060] mb-2">Add New Librarian</h2>
              <p className="text-gray-600 text-base">Fill in the details to add a new librarian to the system.</p>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAddLibrarian();
              }}
              className="space-y-5"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="id" className="text-[#033060] font-semibold text-base">Librarian ID*</label>
                <input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.id && errors.id ? 'border-red-500' : ''}`}
                  placeholder="e.g., LIB004"
                />
                {touched.id && errors.id && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.id}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[#033060] font-semibold text-base">Full Name*</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-[#033060] font-semibold text-base">Password*</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.password && errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter password"
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.password}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-[#033060] font-semibold text-base">Confirm Password*</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm password"
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.confirmPassword}</p>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-7 py-3 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-[#033060] text-white font-semibold shadow hover:bg-[#021c3a] border border-[#033060] transition-all"
                >
                  Add Librarian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Librarian Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 animate-scale-in border border-[#dbeafe]" style={{boxShadow: '0 8px 32px 0 rgba(3,48,96,0.12)'}}>
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-[#033060] mb-2">Edit Librarian</h2>
              <p className="text-gray-600 text-base">Update the librarian's information.</p>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditLibrarian();
              }}
              className="space-y-5"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-id" className="text-[#033060] font-semibold text-base">Librarian ID</label>
                <input
                  id="edit-id"
                  name="id"
                  value={formData.id}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] bg-[#f7f8fa] text-[#b0b6be] text-lg outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-name" className="text-[#033060] font-semibold text-base">Full Name*</label>
                <input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.name && errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter full name"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-email" className="text-[#033060] font-semibold text-base">Email Address*</label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.email}</p>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-7 py-3 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-[#033060] text-white font-semibold shadow hover:bg-[#021c3a] border border-[#033060] transition-all"
                >
                  Save
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
                No
              </button>
              <button
                type="button"
                onClick={handleDeleteLibrarian}
                className="px-5 py-2 rounded-xl bg-[#033060] text-white font-semibold shadow hover:bg-[#021c3a] border border-[#033060] transition-all text-base"
              >
                Yes
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
