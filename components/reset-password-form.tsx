"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Get the email from localStorage
    const resetEmail = localStorage.getItem("resetPasswordEmail")
    if (!resetEmail) {
      // If no email is found, redirect to forgot password page
      toast({
        title: "Error",
        description: "Please submit your email first.",
        className: "bg-red-600 text-white border-red-400",
      })
      router.push("/forgot-password")
    } else {
      setEmail(resetEmail)
    }
  }, [router, toast])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Get registered accounts
    const registeredAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")
    const accountIndex = registeredAccounts.findIndex((acc: any) => acc.email === email)

    if (accountIndex === -1) {
      toast({
        title: "Error",
        description: "Account not found.",
        className: "bg-red-600 text-white border-red-400",
      })
      return
    }

    // Update the password
    registeredAccounts[accountIndex].password = password
    localStorage.setItem("registeredAccounts", JSON.stringify(registeredAccounts))

    // Clear the reset email
    localStorage.removeItem("resetPasswordEmail")

    // Show success message
    toast({
      title: "Success!",
      description: "Your password has been reset.",
      className: "bg-pink-600 text-white border-pink-400",
    })

    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  const goToLogin = () => {
    router.push("/")
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.5)]">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          RESET PASSWORD
        </h1>
        <div className="h-1 w-32 bg-pink-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(255,105,180,0.7)]"></div>
      </div>

      <p className="text-gray-300 text-center" style={{ fontFamily: "Tahoma, sans-serif" }}>
        Create a new password for your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-gray-800 border-gray-600 text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)]"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-white font-medium"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
          RESET PASSWORD
        </Button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Remember your password?{" "}
          <button onClick={goToLogin} className="text-pink-400 hover:text-pink-300 hover:underline transition-colors">
            Return to Login
          </button>
        </p>
      </div>
    </div>
  )
}
