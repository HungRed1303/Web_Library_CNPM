import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../service/Services"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
      valid = false
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const result = await registerUser(formData.username, formData.email, formData.password, formData.name)
      if (result.success) {
        toast({
          title: "Success!",
          description: "New account created!",
          className: "bg-pink-600 text-white border-pink-400",
        })
        setFormData({
          username: "",
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        setTimeout(() => {
          navigate("/login")
        }, 1200)
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Registration failed.",
          className: "bg-red-600 text-white border-red-400",
        })
      }
    }
  }

  const goToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#033060]/20 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#033060]/20 to-transparent blur-3xl"></div>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#033060]" style={{ fontFamily: "Tahoma, sans-serif" }}>
            REGISTER
          </h1>
          <div className="h-1 w-24 bg-[#033060] mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(3,48,96,0.7)]"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="username" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="yourusername"
              value={formData.username}
              onChange={handleChange}
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060] shadow-[0_0_5px_rgba(3,48,96,0.3)] focus:shadow-[0_0_10px_rgba(3,48,96,0.5)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
                {errors.username}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="name" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060] shadow-[0_0_5px_rgba(3,48,96,0.3)] focus:shadow-[0_0_10px_rgba(3,48,96,0.5)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060] shadow-[0_0_5px_rgba(3,48,96,0.3)] focus:shadow-[0_0_10px_rgba(3,48,96,0.5)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060] shadow-[0_0_5px_rgba(3,48,96,0.3)] focus:shadow-[0_0_10px_rgba(3,48,96,0.5)]"
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
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060] shadow-[0_0_5px_rgba(3,48,96,0.3)] focus:shadow-[0_0_10px_rgba(3,48,96,0.5)]"
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
            className="w-full bg-[#033060] hover:bg-[#044080] text-white py-2 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(3,48,96,0.7)] hover:shadow-[0_0_20px_rgba(3,48,96,0.9)] font-bold"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            REGISTER
          </button>
        </form>
        <div className="pt-4 text-center">
          <p className="text-[#033060] text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Already have an account?{" "}
            <button onClick={goToLogin} className="text-[#033060] hover:text-[#044080] hover:underline transition-colors">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}