"use client"

import React, { useState, useEffect, useRef } from "react"
import { Pencil, Trash2, Search, CheckCircle, XCircle, Users, UserPlus, History } from "lucide-react"
import { 
  getAllStudents, 
  getStudentById, 
  updateStudentById, 
  deleteStudentById, 
  createStudent 
} from "../service/Services"
import { useNavigate } from "react-router-dom"

interface Student {
  student_id: number
  username: string
  email: string
  name: string
  class_id: number | null
}

interface FormData {
  username: string
  name: string
  email: string
  class_id: string | null
}

interface ValidationErrors {
  username?: string
  name?: string
  email?: string
  class_id?: string
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

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<FormData>({
    username: "",
    name: "",
    email: "",
    class_id: null
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        showToastMessage("error", "Authentication token missing. Please login.")
        setIsLoading(false);
        console.error("Authentication token missing.");
        return
      }
      const response = await getAllStudents()
      if (Array.isArray(response)) {
        setStudents(response)
      } else {
        setStudents([])
        showToastMessage("error", "Invalid student data format received.")
        console.error("Invalid data format:", response);
      }
    } catch (error: any) {
      console.error("Failed to fetch students:", error)
      showToastMessage("error", error.message || "Failed to fetch students")
      setStudents([])
    } finally {
      setIsLoading(false)
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
      case "class_id":
        if (!value.trim()) return "Class ID is required";
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    const fields = ["username", "name", "email", "class_id"]
    
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

  const handleCreateStudent = async () => {
    if (!validateForm()) {
      showToastMessage("error", "Please correct the errors in the form.")
      return
    }

    try {
      setIsLoading(true)
      const { username, name, email, class_id } = formData
      if (!username || !name || !email || !class_id) {
        showToastMessage("error", "Required fields are missing")
        return
      }
      
      const response = await createStudent({
        username,
        name,
        email,
        class_id: class_id
      })
      
      if (response) {
        setStudents([...students, response])
        setIsCreateModalOpen(false)
        resetForm()
        showToastMessage("success", "Student created successfully!")
      }
    } catch (error: any) {
      console.error("Failed to create student:", error);
      showToastMessage("error", error.message || "Failed to create student")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStudent = async () => {
    // Chỉ validate các trường không bị xóa trắng, riêng class_id:
    // Nếu ban đầu (currentStudent.class_id) không có dữ liệu thì cho phép để trống class_id khi save changes.
    // Nếu ban đầu có dữ liệu thì không được phép để trống class_id khi save changes.
    const newErrors: ValidationErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    if (currentStudent?.class_id && (!formData.class_id || !formData.class_id.trim())) {
      newErrors.class_id = "Class ID is required";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showToastMessage("error", "Please correct the errors in the form.");
      return;
    }

    try {
      setIsLoading(true);
      const { username, name, email, class_id } = formData;
      if (!currentStudent?.student_id) {
        showToastMessage("error", "Student ID is missing");
        return;
      }
      const response = await updateStudentById(currentStudent.student_id, {
        username,
        name,
        email,
        class_id: class_id
      });
      if (response) {
        setStudents(students.map((stu) =>
          stu.student_id === currentStudent.student_id ? response : stu
        ));
        setIsEditModalOpen(false);
        resetForm();
        showToastMessage("success", "Student updated successfully!");
      }
    } catch (error: any) {
      console.error("Failed to update student:", error);
      showToastMessage("error", error.message || "Failed to update student");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteStudent = async () => {
    if (!currentStudent) return

    try {
      setIsLoading(true)
      await deleteStudentById(currentStudent.student_id)
      
      setStudents(students.filter((stu) => stu.student_id !== currentStudent.student_id))
      setIsDeleteDialogOpen(false)
      setCurrentStudent(null)
      showToastMessage("success", "Student deleted successfully!")
      
    } catch (error: any) {
      console.error("Failed to delete student:", error);
      showToastMessage("error", error.message || "Failed to delete student")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (student: Student) => {
    setCurrentStudent(student)
    setFormData({
      username: student.username,
      name: student.name,
      email: student.email,
      class_id: student.class_id?.toString() || null
    })
    setIsEditModalOpen(true)
    setTouched({})
    setErrors({})
  }

  const openCreateModal = () => {
    setCurrentStudent(null)
    setFormData({
      username: "",
      name: "",
      email: "",
      class_id: null
    })
    setIsCreateModalOpen(true)
    setTouched({})
    setErrors({})
  }

  const openDeleteDialog = (student: Student) => {
    setCurrentStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      class_id: null
    })
    setErrors({})
    setTouched({})
    setCurrentStudent(null)
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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedStudents = [...filteredStudents].sort((a, b) => a.student_id - b.student_id);

  const handleViewBorrowingHistory = (studentId: number) => {
    navigate(`/students/borrowingHistory?studentId=${studentId}`)
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
              placeholder="Search students by name, email, or username..."
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
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[60px]">ID</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[180px]">Username</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[200px]">Name</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[240px]">Email</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[120px]">Class ID</th>
                <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033060]"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Loading students...</p>
                  </td>
                </tr>
              ) : sortedStudents.length > 0 ? (
                sortedStudents.map((student) => (
                  <tr key={student.student_id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[60px]">{student.student_id}</td>
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[180px] max-w-xs break-words whitespace-normal" title={student.username}>{student.username}</td>
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[200px] max-w-xs break-words whitespace-normal" title={student.name}>{student.name}</td>
                    <EmailCell email={student.email} />
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[120px]">{student.class_id || 'N/A'}</td>
                    <td className="py-2.5 px-5 text-center w-[180px]">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleViewBorrowingHistory(student.student_id)}
                          className="group flex items-center text-[#033060] hover:text-[#021c3a] hover:bg-blue-100 px-2 py-1 rounded transition text-sm relative"
                          title="View Borrowing History"
                        >
                          <History className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="group flex items-center text-[#033060] hover:text-[#021c3a] hover:bg-blue-100 px-2 py-1 rounded transition text-sm relative"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(student)}
                          className="group flex items-center text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded transition text-sm border border-transparent hover:border-red-600 relative"
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
                  <td colSpan={6} className="text-center py-8">
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
      </div>

      {/* Create/Edit Student Modal */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-4 animate-scale-in border border-[#dbeafe]" style={{boxShadow: '0 8px 32px 0 rgba(3,48,96,0.12)'}}>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-extrabold text-[#033060] mb-2">
                {isCreateModalOpen ? "Add New Student" : "Edit Student"}
              </h2>
              <p className="text-gray-600 text-base">
                {isCreateModalOpen ? "Create a new student account." : "Update the student's information."}
              </p>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                isCreateModalOpen ? handleCreateStudent() : handleEditStudent();
              }}
              className="space-y-4"
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
                <label htmlFor="class_id" className="text-[#033060] font-semibold text-base">Class ID*</label>
                <input
                  id="class_id"
                  name="class_id"
                  type="text"
                  maxLength={10}
                  value={formData.class_id || ""}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, class_id: e.target.value }))
                    setTouched(prev => ({ ...prev, class_id: true }))
                    const error = validateField("class_id", e.target.value)
                    setErrors(prev => ({ ...prev, class_id: error }))
                  }}
                  onBlur={e => {
                    setTouched(prev => ({ ...prev, class_id: true }))
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 border-[#dbeafe] focus:border-[#033060] focus:ring-2 focus:ring-blue-100 text-lg bg-white outline-none transition ${touched.class_id && errors.class_id ? 'border-red-500' : ''}`}
                  placeholder="Enter class ID"
                />
                {touched.class_id && errors.class_id && (
                  <p className="text-red-500 text-sm flex items-center mt-1"><XCircle className="h-4 w-4 mr-2" />{errors.class_id}</p>
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
                    isCreateModalOpen ? "Create Student" : "Save Changes"
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
              <p className="text-gray-600 text-base">Are you sure you want to delete this student?</p>
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
                onClick={handleDeleteStudent}
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
  title: "Student Management System",
  description: "A Student Management System",
};