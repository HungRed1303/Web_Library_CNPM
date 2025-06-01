"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
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
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Get existing registered accounts or initialize empty array
      const existingAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")

      // Check if email already exists
      const emailExists = existingAccounts.some((account: any) => account.email === formData.email)

      if (emailExists) {
        toast({
          title: "Registration Failed",
          description: "This email is already registered!",
          className: "bg-red-600 text-white border-red-400",
        })
        return
      }

      // Add new account to the array
      const newAccount = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      }

      existingAccounts.push(newAccount)

      // Save updated accounts array to localStorage
      localStorage.setItem("registeredAccounts", JSON.stringify(existingAccounts))

      // Show success notification
      toast({
        title: "Success!",
        description: "New account created!",
        className: "bg-pink-600 text-white border-pink-400",
      })

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    }
  }

  const goToLogin = () => {
    router.push("/")
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.5)]">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          REGISTER
        </h1>
        <div className="h-1 w-24 bg-pink-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(255,105,180,0.7)]"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="fullName" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          />
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)] pr-10"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-pink-500"
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
          <Label
            htmlFor="confirmPassword"
            className="text-white font-medium"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)] pr-10"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-pink-500"
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

        <Button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          REGISTER
        </Button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Already have an account?{" "}
          <button onClick={goToLogin} className="text-pink-400 hover:text-pink-300 hover:underline transition-colors">
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
