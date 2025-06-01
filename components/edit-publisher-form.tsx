"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Loader2, Search, Save } from "lucide-react"

// Get publishers from localStorage or use mock data
const getPublishers = () => {
  // Try to get publishers from localStorage
  const storedPublishers = localStorage.getItem("publishers")
  if (storedPublishers) {
    try {
      return JSON.parse(storedPublishers)
    } catch (e) {
      console.error("Error parsing publishers from localStorage:", e)
    }
  }

  // Return mock data if localStorage doesn't have publishers
  return [
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
    {
      id: "PUB004",
      name: "Macmillan Publishers",
      address: "120 Broadway, New York, NY",
      email: "info@macmillan.com",
      phone: "646-307-5151",
    },
    {
      id: "PUB005",
      name: "Hachette Book Group",
      address: "1290 Avenue of the Americas, New York, NY",
      email: "info@hachettebookgroup.com",
      phone: "212-364-1100",
    },
  ]
}

// Simulate encryption
const encryptData = (data: string) => {
  // This is just a simulation of encryption
  return btoa(data) // Base64 encoding as a simple "encryption" simulation
}

export default function EditPublisherForm() {
  const [searchTerm, setSearchTerm] = useState("")
  const [publishers, setPublishers] = useState<any[]>([])
  const [filteredPublishers, setFilteredPublishers] = useState<any[]>([])
  const [selectedPublisher, setSelectedPublisher] = useState<any | null>(null)
  const [originalPublisher, setOriginalPublisher] = useState<any | null>(null)
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
  const [isSearching, setIsSearching] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
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

    // Load publishers
    setPublishers(getPublishers())
  }, [router, toast])

  // Filter publishers when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPublishers([])
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = publishers.filter(
        (pub) => pub.id.toLowerCase().includes(term) || pub.name.toLowerCase().includes(term),
      )
      setFilteredPublishers(filtered)
    }
  }, [searchTerm, publishers])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchTerm.trim() === "") {
      setErrors((prev) => ({ ...prev, general: "Please enter a Publisher ID or Name" }))
      return
    }

    setErrors({ name: "", email: "", general: "" })
    setIsSearching(true)
    setSelectedPublisher(null)
    setOriginalPublisher(null)
    setShowSuccessMessage(false)

    // Simulate search delay
    setTimeout(() => {
      // Randomly simulate a database error (10% chance)
      if (Math.random() < 0.1) {
        setErrors((prev) => ({ ...prev, general: "Database connection failed. Please try again later." }))
        setIsSearching(false)
        return
      }

      const term = searchTerm.toLowerCase()
      const found = publishers.find((pub) => pub.id.toLowerCase() === term || pub.name.toLowerCase() === term)

      if (found) {
        setSelectedPublisher(found)
        setOriginalPublisher(found)
        setFormData({
          name: found.name,
          address: found.address || "",
          email: found.email || "",
          phone: found.phone || "",
        })
      } else {
        setErrors((prev) => ({ ...prev, general: "Publisher not found." }))
      }

      setIsSearching(false)
    }, 800) // Simulate a search that takes 0.8 seconds
  }

  const handleSelectPublisher = (publisher: any) => {
    setSelectedPublisher(publisher)
    setOriginalPublisher(publisher)
    setFormData({
      name: publisher.name,
      address: publisher.address || "",
      email: publisher.email || "",
      phone: publisher.phone || "",
    })
    setSearchTerm(publisher.name) // Update search field with selected publisher name
    setFilteredPublishers([]) // Clear dropdown after selection
    setErrors({ name: "", email: "", general: "" }) // Clear any errors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      newErrors.name = "Publisher name is required"
      valid = false
    }

    // Validate email
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const checkDuplicate = () => {
    // Check if publisher name already exists (excluding the current publisher)
    return publishers.some(
      (pub) => pub.name.toLowerCase() === formData.name.toLowerCase() && pub.id !== selectedPublisher?.id,
    )
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({ name: "", email: "", general: "" })

    // Validate form
    if (!validateForm()) return

    // Check for duplicate publisher name
    if (checkDuplicate()) {
      setErrors((prev) => ({
        ...prev,
        name: "Publisher name already exists. Please use a different name.",
      }))
      return
    }

    setIsUpdating(true)

    // Simulate processing delay
    setTimeout(() => {
      // Randomly simulate a database error (5% chance)
      if (Math.random() < 0.05) {
        setErrors((prev) => ({
          ...prev,
          general: "Database connection failed. Please try again later.",
        }))
        setIsUpdating(false)
        return
      }

      // Simulate encrypting sensitive data
      const encryptedEmail = formData.email ? encryptData(formData.email) : ""

      // Update publisher in state
      const updatedPublishers = publishers.map((pub) => {
        if (pub.id === selectedPublisher?.id) {
          return {
            ...pub,
            name: formData.name,
            address: formData.address,
            email: encryptedEmail, // Simulated encrypted email
            phone: formData.phone,
          }
        }
        return pub
      })

      setPublishers(updatedPublishers)

      // Update localStorage
      try {
        localStorage.setItem("publishers", JSON.stringify(updatedPublishers))
      } catch (e) {
        console.error("Error updating localStorage:", e)
      }

      // Show success message
      setShowSuccessMessage(true)
      setIsUpdating(false)

      // Show success toast
      toast({
        title: "Success!",
        description: "Publisher updated successfully.",
        className: "bg-pink-600 text-white border-pink-400",
      })
    }, 1500) // Simulate an update that takes 1.5 seconds
  }

  const handleCancel = () => {
    if (originalPublisher) {
      // Reset form to original values
      setFormData({
        name: originalPublisher.name,
        address: originalPublisher.address || "",
        email: originalPublisher.email || "",
        phone: originalPublisher.phone || "",
      })
    }
    setErrors({ name: "", email: "", general: "" })
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedPublisher(null)
    setOriginalPublisher(null)
    setFormData({
      name: "",
      address: "",
      email: "",
      phone: "",
    })
    setErrors({ name: "", email: "", general: "" })
    setShowSuccessMessage(false)
  }

  if (!isLoggedIn) {
    return null // Don't render anything if not logged in
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 p-4 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)]">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Edit Publisher
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
            {showSuccessMessage ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  Publisher Updated Successfully
                </h2>
                <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  The publisher information has been updated in the database.
                </p>
                <div className="pt-6">
                  <Button
                    onClick={handleReset}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)] mr-4"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Edit Another Publisher
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
              <div className="space-y-6">
                {/* Search Section */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Search for Publisher
                  </h2>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="space-y-1 relative">
                      <Label
                        htmlFor="searchTerm"
                        className="text-white font-medium"
                        style={{ fontFamily: "Tahoma, sans-serif" }}
                      >
                        Publisher ID or Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="searchTerm"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Enter Publisher ID or Name"
                          className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)] pr-10"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        />
                        <Button
                          type="submit"
                          disabled={isSearching}
                          className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-transparent text-pink-500 hover:text-pink-400"
                        >
                          {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        </Button>
                      </div>

                      {/* Dropdown for search results */}
                      {filteredPublishers.length > 0 && !selectedPublisher && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-pink-500 rounded-md shadow-lg max-h-60 overflow-auto">
                          <ul className="py-1">
                            {filteredPublishers.map((pub) => (
                              <li
                                key={pub.id}
                                className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                                onClick={() => handleSelectPublisher(pub)}
                                style={{ fontFamily: "Tahoma, sans-serif" }}
                              >
                                <div>
                                  <div className="text-white font-medium">{pub.name}</div>
                                  <div className="text-gray-400 text-sm">{pub.id}</div>
                                </div>
                                <Button
                                  type="button"
                                  className="bg-transparent hover:bg-pink-900 text-pink-500 hover:text-pink-400 p-1 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelectPublisher(pub)
                                  }}
                                >
                                  <Search className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        disabled={isSearching || searchTerm.trim() === ""}
                        className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
                        style={{ fontFamily: "Tahoma, sans-serif" }}
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          "Search"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Error Message */}
                {errors.general && (
                  <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-md p-3">
                    <p className="text-white text-sm flex items-center" style={{ fontFamily: "Tahoma, sans-serif" }}>
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" /> {errors.general}
                    </p>
                  </div>
                )}

                {/* Edit Form */}
                {selectedPublisher && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                      Edit Publisher Information
                    </h3>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="space-y-1">
                        <Label
                          htmlFor="id"
                          className="text-white font-medium"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        >
                          Publisher ID
                        </Label>
                        <Input
                          id="id"
                          value={selectedPublisher.id}
                          disabled
                          className="bg-gray-800 border-gray-600 text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)]"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        />
                      </div>

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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
                          className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="email"
                          className="text-white font-medium"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
                          className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        />
                      </div>

                      <div className="flex justify-center space-x-4 pt-4">
                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="flex items-center bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
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
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
