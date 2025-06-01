"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function LibraryCardForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    agreeToTerms: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // Auto-fill name and email from logged in user
  useEffect(() => {
    const email = localStorage.getItem("lastLoggedInEmail")

    if (email) {
      const registeredAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")
      const account = registeredAccounts.find((acc: any) => acc.email === email)

      if (account) {
        setFormData((prev) => ({
          ...prev,
          fullName: account.fullName,
          email: account.email,
        }))
      }
    } else {
      // Redirect to login if not logged in
      router.push("/")
    }
  }, [router])

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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }))

    if (errors.agreeToTerms) {
      setErrors((prev) => ({
        ...prev,
        agreeToTerms: "",
      }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      agreeToTerms: "",
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

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      valid = false
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
      valid = false
    }

    if (!formData.address.trim()) {
      newErrors.address = "Home address is required"
      valid = false
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the library terms"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirmation(true)

      // Show success toast
      toast({
        title: "Request Submitted!",
        description: "Your library card request has been received.",
        className: "bg-pink-600 text-white border-pink-400",
      })

      // Store the request in localStorage
      const libraryRequests = JSON.parse(localStorage.getItem("libraryRequests") || "[]")
      libraryRequests.push({
        ...formData,
        requestDate: new Date().toISOString(),
        status: "Pending",
      })
      localStorage.setItem("libraryRequests", JSON.stringify(libraryRequests))
    }, 1500)
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  if (showConfirmation) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.5)] text-center">
        <div className="space-y-4">
          <div className="inline-block p-4 rounded-full bg-black border-2 border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.6)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff69b4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Request Submitted!
          </h1>

          <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Your library card request has been received. We'll process your request and contact you soon.
          </p>
        </div>

        <Button
          onClick={goToDashboard}
          className="mt-8 px-8 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          RETURN TO DASHBOARD
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.5)]">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          REQUEST LIBRARY CARD
        </h1>
        <div className="h-1 w-32 bg-pink-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(255,105,180,0.7)]"></div>
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
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
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
          <Label htmlFor="phone" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={handleChange}
            className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="address" className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Home Address
          </Label>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="123 Main St, City, State, ZIP"
            value={formData.address}
            onChange={handleChange}
            className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          />
          {errors.address && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {errors.address}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={handleCheckboxChange}
            className="border-pink-500 text-pink-500 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)]"
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="agreeToTerms"
              className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              I agree to the library terms and conditions
            </Label>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-xs" style={{ fontFamily: "Tahoma, sans-serif" }}>
                {errors.agreeToTerms}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            {isSubmitting ? "SUBMITTING..." : "REQUEST CARD"}
          </Button>
        </div>
      </form>

      <div className="pt-4 text-center">
        <button
          onClick={goToDashboard}
          className="text-pink-400 hover:text-pink-300 hover:underline transition-colors text-sm"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}
