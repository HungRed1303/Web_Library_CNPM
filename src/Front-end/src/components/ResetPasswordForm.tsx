import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { resetPassword } from "../service/Services"
import { useParams } from "react-router-dom"

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { token } = useParams()

  useEffect(() => {
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid or missing reset token.",
        className: "bg-red-600 text-white border-red-400",
      })
      navigate("/password/forgot")
    }
  }, [token, navigate, toast])

  const validateForm = () => {
    let valid = true
    const newErrors = {
      password: "",
      confirmPassword: "",
    }

    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    if (password !== confirmPassword) {
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
      const result = await resetPassword(token, password, confirmPassword)
      if (!result) {
        toast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          className: "bg-red-600 text-white border-red-400",
        })
        setIsSubmitting(false)
        return
      }
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          className: "bg-pink-600 text-white border-pink-400",
        })

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login")
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: result.error,
          className: "bg-red-600 text-white border-red-400",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        className: "bg-red-600 text-white border-red-400",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] z-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#033060]" style={{ fontFamily: "Tahoma, sans-serif" }}>
          RESET PASSWORD
        </h1>
        <div className="h-1 w-24 bg-[#033060] mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(3,48,96,0.7)]"></div>
        <p className="text-[#033060] mt-2">Create a new password for your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="password" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#033060]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {errors.password}
            </p>
          )}
        </div>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#033060]"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#033060] hover:bg-[#044080] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#033060]/50 transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          {isSubmitting ? "RESETTING..." : "RESET PASSWORD"}
        </button>
      </form>
      <div className="pt-4 text-center">
        <p className="text-[#033060] text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Remember your password?{' '}
          <button onClick={goToLogin} className="text-[#033060] hover:text-[#044080] hover:underline transition-colors">
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
