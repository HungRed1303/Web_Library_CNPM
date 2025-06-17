import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { changePassword } from "../service/authService"

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Lấy thông tin user từ localStorage khi component mount
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        // Kiểm tra các trường có thể chứa role
        const role = userData.role || userData.role_type || userData.user_type
        setUserRole(role)
        console.log("User data:", userData) // Debug log
        console.log("User role:", role) // Debug log
      } else {
        // Nếu không có user data, có thể lấy role riêng
        const roleFromStorage = localStorage.getItem("role")
        setUserRole(roleFromStorage)
        console.log("Role from storage:", roleFromStorage) // Debug log
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      // Fallback to role from localStorage
      const roleFromStorage = localStorage.getItem("role")
      setUserRole(roleFromStorage)
    }
  }, [])

  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    let valid = true
    if (!oldPassword){
      newErrors.oldPassword = "Old password is incorrect"
      valid = false
    }

    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required"
      valid = false
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required"
      valid = false
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters"
      valid = false
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      const result = await changePassword(oldPassword, newPassword, confirmPassword)
      
      if (result.success) {
        // Hiển thị thông báo thành công trên form
        setShowSuccessMessage(true)
        toast({
          title: "Success!",
          description: result.message || "Password changed successfully!",
          className: "bg-green-600 text-white border-green-400",
        })

        // Reset form
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        
        // Điều hướng dựa trên role
        setTimeout(() => {
          console.log("Navigating based on role:", userRole) // Debug log
          
          if (userRole === "S" || userRole === "student") {
            // Nếu là sinh viên, chuyển hướng về trang home
            navigate("/home")
          } else if (userRole === "A" || userRole === "admin" || userRole === "L" || userRole === "librarian") {
            // Nếu là admin hoặc librarian, chuyển hướng về dashboard
            navigate("/dashboard")
          } else {
            // Mặc định về home nếu không xác định được role
            console.log("Unknown role, navigating to home")
            navigate("/home")
          }
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: result.error || result.message || "Failed to change password.",
          className: "bg-red-600 text-white border-red-400",
        })
      }
    } catch (err) {
      console.error("Password change error:", err) // Debug log
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        className: "bg-red-600 text-white border-red-400",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] z-10">
      {/* Thông báo thành công */}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-center">
          <div className="font-bold">✅ Success!</div>
          <div className="text-sm">Your password has been changed!</div>
          <div className="text-xs mt-1">Redirecting in 2 seconds...</div>
        </div>
      )}
      
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#033060]" style={{ fontFamily: "Tahoma, sans-serif" }}>
          CHANGE PASSWORD
        </h1>
        <div className="h-1 w-24 bg-[#033060] mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(3,48,96,0.7)]"></div>
        <p className="text-[#033060] mt-2">Update your account password</p>
        {/* Debug info - có thể xóa sau khi test xong */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Old Password */}
        <div className="space-y-1">
          <label htmlFor="oldPassword" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Old Password
          </label>
          <div className="relative">
            <input
              id="oldPassword"
              name="oldPassword"
              type={showOldPassword ? "text" : "password"}
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#033060]"
            >
              {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label htmlFor="newPassword" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#033060]"
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#033060]"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || showSuccessMessage}
          className="w-full bg-[#033060] hover:bg-[#044080] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#033060]/50 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          {showSuccessMessage ? "SUCCESS! REDIRECTING..." : (isSubmitting ? "CHANGING..." : "CHANGE PASSWORD")}
        </button>
      </form>
    </div>
  )
}