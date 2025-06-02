import type React from "react"

import { useState } from "react"
import { useToast } from "../hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { forgotPassword } from "../service/Services"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await forgotPassword(email)

    if (result.success) {
      toast({
        title: "Reset Link Sent",
        description: result.message || "Check your email for password reset instructions.",
        className: "bg-pink-600 text-white border-pink-400",
      })
      setTimeout(() => {
        setIsSubmitting(false)
        navigate("/login")
      }, 1500)
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to send reset link.",
        className: "bg-red-600 text-white border-red-400",
      })
      setIsSubmitting(false)
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
            FORGOT YOUR PASSWORD?
          </h1>
          <div className="h-1 w-32 bg-[#033060] mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(3,48,96,0.7)]"></div>
        </div>
        <p className="text-[#033060] text-center" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060] shadow-[0_0_5px_rgba(3,48,96,0.3)] focus:shadow-[0_0_10px_rgba(3,48,96,0.5)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#033060] hover:bg-[#044080] text-white py-2 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(3,48,96,0.7)] hover:shadow-[0_0_20px_rgba(3,48,96,0.9)] font-bold"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            {isSubmitting ? "SENDING..." : "SEND RESET LINK"}
          </button>
        </form>
        <div className="pt-4 text-center">
          <p className="text-[#033060] text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Remember your password?{" "}
            <button onClick={goToLogin} className="text-[#033060] hover:text-[#044080] hover:underline transition-colors">
              Return to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}