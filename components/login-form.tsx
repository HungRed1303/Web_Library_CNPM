"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if the account exists in localStorage
    const registeredAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")
    const account = registeredAccounts.find((acc: any) => acc.email === email)

    if (!account) {
      // Show error toast if account doesn't exist
      toast({
        title: "Login Failed",
        description: "This account has not been registered!",
        className: "bg-red-600 text-white border-red-400",
      })
      return
    }

    // Check if password matches
    if (account.password !== password) {
      toast({
        title: "Login Failed",
        description: "Incorrect password!",
        className: "bg-red-600 text-white border-red-400",
      })
      return
    }

    // Store the email for the dashboard to use
    localStorage.setItem("lastLoggedInEmail", email)

    // Show success toast
    toast({
      title: "Login Successful",
      description: "Welcome back!",
      className: "bg-pink-600 text-white border-pink-400",
    })

    // Redirect to dashboard after successful login
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  const goToRegister = () => {
    router.push("/register")
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.5)]">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          LOGIN
        </h1>
        <div className="h-1 w-20 bg-pink-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(255,105,180,0.7)]"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Email
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Password
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
        </div>

        <div className="text-right">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-pink-400 hover:text-pink-300 hover:underline transition-colors"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          LOGIN
        </Button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Don&apos;t have an account?{" "}
          <button
            onClick={goToRegister}
            className="text-pink-400 hover:text-pink-300 hover:underline transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
