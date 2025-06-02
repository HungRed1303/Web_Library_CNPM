"use client"

import React, { useState, useEffect } from "react"
import { Pencil, Trash2, Search, CheckCircle, XCircle, Users, UserPlus } from "lucide-react"

interface Student {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  address: string
  classId: string
  email: string
}

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "STU001",
      name: "John Doe",
      dateOfBirth: "2000-01-15",
      gender: "Male",
      address: "123 Library St, Booktown",
      classId: "CS101",
      email: "john.doe@student.com",
    },
    {
      id: "STU002",
      name: "Jane Smith",
      dateOfBirth: "2001-05-22",
      gender: "Female",
      address: "456 Reading Ave, Bookville",
      classId: "ENG202",
      email: "jane.smith@student.com",
    },
    {
      id: "STU003",
      name: "Alice Johnson",
      dateOfBirth: "1999-12-10",
      gender: "Female",
      address: "789 Study Lane, Bookville",
      classId: "MATH301",
      email: "alice.johnson@student.com",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Omit<Student, "id"> & { id?: string }>({
    name: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    classId: "",
    email: "",
    id: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    if (!isAddModalOpen && !isEditModalOpen) {
      setErrors({})
      setTouched({})
    }
  }, [isAddModalOpen, isEditModalOpen])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "id":
        if (!value.trim()) return "Student ID is required"
        if (students.some((s) => s.id === value.trim())) return "This Student ID already exists"
        return undefined
      case "name":
        if (!value.trim()) return "Full Name is required"
        return undefined
      case "email":
        if (!value.trim()) return "Email Address is required"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return "Invalid email format"
        return undefined
      case "dateOfBirth":
        if (!value.trim()) return "Date of Birth is required"
        return undefined
      case "gender":
        if (!value.trim()) return "Gender is required"
        return undefined
      case "address":
        if (!value.trim()) return "Address is required"
        return undefined
      case "classId":
        if (!value.trim()) return "Class ID is required"
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (mode: 'add' | 'edit'): boolean => {
    const newErrors: Record<string, string> = {}
    const fields = mode === 'add'
      ? ["id", "name", "email", "dateOfBirth", "gender", "address", "classId"]
      : ["name", "email", "dateOfBirth", "gender", "address", "classId"]
    for (const field of fields) {
      const value = (formData as any)[field] || ""
      const error = validateField(field, value)
      if (error) {
        newErrors[field] = error
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error || "" }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleAddStudent = () => {
    if (!validateForm('add')) {
      setToast({ type: "error", message: "Please correct the errors in the form." })
      return
    }
    const { id, name, dateOfBirth, gender, address, classId, email } = formData
    setStudents([...students, { id: id!.trim(), name, dateOfBirth, gender, address, classId, email }])
    setIsAddModalOpen(false)
    resetForm()
    setToast({ type: "success", message: "Student added successfully!" })
  }

  const handleEditStudent = () => {
    if (!validateForm('edit')) {
      setToast({ type: "error", message: "Please correct the errors in the form." })
      return
    }
    setStudents(students.map((stu) =>
      stu.id === formData.id
        ? { ...stu, name: formData.name, dateOfBirth: formData.dateOfBirth, gender: formData.gender, address: formData.address, classId: formData.classId, email: formData.email }
        : stu
    ))
    setIsEditModalOpen(false)
    resetForm()
    setToast({ type: "success", message: "Student updated successfully!" })
  }

  const handleDeleteStudent = () => {
    if (currentStudent) {
      setStudents(students.filter((stu) => stu.id !== currentStudent.id))
      setIsDeleteDialogOpen(false)
      setCurrentStudent(null)
      setToast({ type: "success", message: "Student deleted successfully!" })
    }
  }

  const openEditModal = (student: Student) => {
    setFormData({ ...student })
    setIsEditModalOpen(true)
    setTouched({})
    setErrors({})
  }

  const openDeleteDialog = (student: Student) => {
    setCurrentStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: "", dateOfBirth: "", gender: "", address: "", classId: "", email: "", id: "" })
    setErrors({})
    setTouched({})
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="flex items-center mb-1">
          <Users className="h-12 w-12 text-[#033060] mr-3" />
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow" style={{letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3'}}>Student Management</h1>
        </div>
        <p className="text-gray-600 text-lg">Manage your students efficiently and securely</p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
            <input
              placeholder="Search students by name, email, or ID..."
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
          Add New Student
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Student ID</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Full Name</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Email Address</th>
              <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Class ID</th>
              <th className="py-3 px-5 text-right text-[#033060] font-bold text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                  <td className="py-2.5 px-5">
                    <span className="bg-[#e0e7ef] text-[#033060] font-bold px-3 py-0.5 rounded-lg text-xs tracking-wide border border-[#b6c6e3]">{student.id}</span>
                  </td>
                  <td className="py-2.5 px-5 font-semibold text-[#033060] text-base">{student.name}</td>
                  <td className="py-2.5 px-5 text-[#033060] text-base">{student.email}</td>
                  <td className="py-2.5 px-5 text-[#033060] text-base">{student.classId}</td>
                  <td className="py-2.5 px-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(student)}
                        className="flex items-center gap-1 text-[#033060] hover:text-[#021c3a] px-2 py-1 rounded transition text-sm"
                        aria-label={`Edit ${student.name}`}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteDialog(student)}
                        className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded transition text-sm border border-transparent hover:border-red-600"
                        aria-label={`Delete ${student.name}`}
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
                <td colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-base">No students found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-4 animate-scale-in border border-[#dbeafe]" style={{boxShadow: '0 4px 24px 0 rgba(3,48,96,0.10)'}}>
            <div className="mb-3">
              <h2 className="text-xl font-extrabold text-[#033060] mb-1">Add New Student</h2>
              <p className="text-gray-600 text-xs">Fill in the details to add a new student to the system.</p>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAddStudent();
              }}
              className="space-y-3"
            >
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Student ID*</label>
                <input
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.id && errors.id ? 'border-red-500' : ''}`}
                  placeholder="e.g., STU004"
                />
                {touched.id && errors.id && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.id}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Full Name*</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.name && errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter full name"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Email Address*</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Date of Birth*</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : ''}`}
                  placeholder="YYYY-MM-DD"
                />
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.dateOfBirth}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.gender && errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {touched.gender && errors.gender && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.gender}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Address*</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={2}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition resize-none ${touched.address && errors.address ? 'border-red-500' : ''}`}
                  placeholder="Enter address"
                />
                {touched.address && errors.address && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.address}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Class ID*</label>
                <input
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.classId && errors.classId ? 'border-red-500' : ''}`}
                  placeholder="e.g., CS101"
                />
                {touched.classId && errors.classId && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.classId}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc] transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#033060] text-white font-semibold shadow hover:bg-[#021c3a] border border-[#033060] transition-all text-sm"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-4 animate-scale-in border border-[#dbeafe]" style={{boxShadow: '0 4px 24px 0 rgba(3,48,96,0.10)'}}>
            <div className="mb-3">
              <h2 className="text-xl font-extrabold text-[#033060] mb-1">Edit Student</h2>
              <p className="text-gray-600 text-xs">Update the student's information.</p>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEditStudent();
              }}
              className="space-y-3"
            >
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Student ID</label>
                <input
                  name="id"
                  value={formData.id}
                  disabled
                  className="w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] bg-[#f7f8fa] text-[#b0b6be] text-sm outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Full Name*</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.name && errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter full name"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Email Address*</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.email && errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Date of Birth*</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : ''}`}
                  placeholder="YYYY-MM-DD"
                />
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.dateOfBirth}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.gender && errors.gender ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {touched.gender && errors.gender && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.gender}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Address*</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={2}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition resize-none ${touched.address && errors.address ? 'border-red-500' : ''}`}
                  placeholder="Enter address"
                />
                {touched.address && errors.address && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.address}</p>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[#033060] font-semibold text-sm">Class ID*</label>
                <input
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-2 py-2 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-sm bg-white outline-none transition ${touched.classId && errors.classId ? 'border-red-500' : ''}`}
                  placeholder="e.g., CS101"
                />
                {touched.classId && errors.classId && (
                  <p className="text-red-500 text-xs flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.classId}</p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#dbeafe] bg-white text-[#033060] font-semibold shadow hover:bg-[#f5f8fc] transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#033060] text-white font-semibold shadow hover:bg-[#021c3a] border border-[#033060] transition-all text-sm"
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
              <p className="text-gray-600 text-base">Are you sure you want to delete this student?</p>
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
                onClick={handleDeleteStudent}
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
