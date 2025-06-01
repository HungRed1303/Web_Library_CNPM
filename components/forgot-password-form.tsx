"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Check if the email exists in registered accounts
    const registeredAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")
    const account = registeredAccounts.find((acc: any) => acc.email === email)

    if (!account) {
      toast({
        title: "Email Not Found",
        description: "No account is registered with this email address.",
        className: "bg-red-600 text-white border-red-400",
      })
      setIsSubmitting(false)
      return
    }

    // In a real app, you would send an email with a reset link
    // For this demo, we'll store the email in localStorage and redirect to reset page
    localStorage.setItem("resetPasswordEmail", email)

    // Show success message
    toast({
      title: "Reset Link Sent",
      description: "Check your email for password reset instructions.",
      className: "bg-pink-600 text-white border-pink-400",
    })

    // Simulate email sending delay
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to reset password page (in a real app this would be a unique URL with a token)
      router.push("/reset-password")
    }, 1500)
  }

  const goToLogin = () => {
    router.push("/")
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.5)]">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          FORGOT YOUR PASSWORD?
        </h1>
        <div className="h-1 w-32 bg-pink-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(255,105,180,0.7)]"></div>
      </div>

      <p className="text-gray-300 text-center" style={{ fontFamily: "Tahoma, sans-serif" }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Email
          </Label>
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          {isSubmitting ? "SENDING..." : "SEND RESET LINK"}
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
