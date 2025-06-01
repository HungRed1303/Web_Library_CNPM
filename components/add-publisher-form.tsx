"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

// Mock publisher database
const mockPublishers = [
  {
    id: "PUB001",
    name: "Penguin Random House",
    address: "1745 Broadway, New York, NY",
    email: "info@penguinrandomhouse.com",
    phone: "212-782-9000",
  },
  {
    id: "PUB002",
    name: "HarperCollins",
    address: "195 Broadway, New York, NY",
    email: "info@harpercollins.com",
    phone: "212-207-7000",
  },
  {
    id: "PUB003",
    name: "Simon & Schuster",
    address: "1230 Avenue of the Americas, New York, NY",
    email: "info@simonandschuster.com",
    phone: "212-698-7000",
  },
]

// Generate a unique publisher ID
const generatePublisherId = () => {
  const existingIds = mockPublishers.map((pub) => pub.id)
  let newId
  do {
    const randomNum = Math.floor(Math.random() * 900) + 100 // Generate a random 3-digit number
    newId = `PUB${randomNum}`
  } while (existingIds.includes(newId))

  return newId
}

// Simulate encryption
const encryptData = (data: string) => {
  // This is just a simulation of encryption
  return btoa(data) // Base64 encoding as a simple "encryption" simulation
}

export default function AddPublisherForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    general: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [publisherId, setPublisherId] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const email = localStorage.getItem("lastLoggedInEmail")
    if (!email) {
      toast({
        title: "Not logged in",
        description: "Please log in to access this feature",
        className: "bg-red-600 text-white border-red-400",
      })
      router.push("/")
      return
    }

    setIsLoggedIn(true)
  }, [router, toast])

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
      name: "",
      email: "",
      general: "",
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Missing required field: Publisher Name"
      valid = false
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Missing required field: Email"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const checkDuplicate = () => {
    // Check if publisher name already exists
    return mockPublishers.some((pub) => pub.name.toLowerCase() === formData.name.toLowerCase())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setErrors({ name: "", email: "", general: "" })
    setIsSuccess(false)

    // Validate form
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate processing delay
    setTimeout(() => {
      // Check for duplicate publisher name
      if (checkDuplicate()) {
        setErrors((prev) => ({
          ...prev,
          name: "Publisher name already exists. Please use a different name.",
        }))
        setIsSubmitting(false)
        return
      }

      // Randomly simulate a database error (10% chance)
      if (Math.random() < 0.1) {
        setErrors((prev) => ({
          ...prev,
          general: "Database connection failed. Please try again later.",
        }))

        toast({
          title: "Database Error",
          description: "Your data has been saved temporarily.",
          className: "bg-yellow-600 text-white border-yellow-400",
        })

        setIsSubmitting(false)
        return
      }

      // Generate a unique publisher ID
      const newId = generatePublisherId()
      setPublisherId(newId)

      // Simulate encrypting sensitive data
      const encryptedEmail = encryptData(formData.email)

      // Add to mock database (in a real app, this would be an API call)
      const newPublisher = {
        id: newId,
        name: formData.name,
        address: formData.address,
        email: encryptedEmail, // Simulated encrypted email
        phone: formData.phone,
      }

      // In a real app, you would send this to an API
      console.log("New publisher added:", newPublisher)

      // Show success state
      setIsSuccess(true)
      setIsSubmitting(false)

      // Show success toast
      toast({
        title: "Success!",
        description: `Publisher added successfully. Publisher ID: ${newId}`,
        className: "bg-pink-600 text-white border-pink-400",
      })

      // Store in localStorage for demonstration
      const publishers = JSON.parse(localStorage.getItem("publishers") || "[]")
      publishers.push(newPublisher)
      localStorage.setItem("publishers", JSON.stringify(publishers))
    }, 1000) // Simulate a 1 second processing time
  }

  const handleCancel = () => {
    // Clear form and return to previous view
    setFormData({
      name: "",
      address: "",
      email: "",
      phone: "",
    })
    setErrors({ name: "", email: "", general: "" })
    setIsSuccess(false)

    // Navigate back to dashboard
    router.push("/dashboard")
  }

  if (!isLoggedIn) {
    return null // Don't render anything if not logged in
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 p-4 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)]">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Add Publisher
        </h1>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          Back to Dashboard
        </Button>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black bg-opacity-70 border border-pink-500 shadow-[0_0_15px_rgba(255,105,180,0.4)] text-white">
          <CardContent className="p-6">
            {isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  Publisher Added Successfully
                </h2>
                <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  The publisher has been added to the database.
                </p>
                <div className="bg-gray-800 p-4 rounded-md inline-block mx-auto mt-4">
                  <p className="text-pink-400 font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Publisher ID: {publisherId}
                  </p>
                </div>
                <div className="pt-6">
                  <Button
                    onClick={() => {
                      setFormData({
                        name: "",
                        address: "",
                        email: "",
                        phone: "",
                      })
                      setIsSuccess(false)
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)] mr-4"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Add Another Publisher
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-all duration-300"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <Label
                    htmlFor="name"
                    className="text-white font-medium flex items-center"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Publisher Name <span className="text-pink-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  />
                  {errors.name && (
                    <p
                      className="text-red-400 text-sm flex items-center mt-1"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    >
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="address"
                    className="text-white font-medium"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="text-white font-medium flex items-center"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Email <span className="text-pink-500 ml-1">*</span>
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
                    <p
                      className="text-red-400 text-sm flex items-center mt-1"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    >
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="phone"
                    className="text-white font-medium"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  />
                </div>

                {errors.general && (
                  <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-md p-3">
                    <p className="text-white text-sm flex items-center" style={{ fontFamily: "Tahoma, sans-serif" }}>
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" /> {errors.general}
                    </p>
                  </div>
                )}

                <div className="flex justify-center space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-all duration-300"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
