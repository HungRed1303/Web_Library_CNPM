"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Loader2, Search, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock publisher database with book associations
interface Publisher {
  id: string
  name: string
  address: string
  email: string
  phone: string
  hasBooks: boolean
}

// Get publishers from localStorage or use mock data
const getPublishers = (): Publisher[] => {
  // Try to get publishers from localStorage
  const storedPublishers = localStorage.getItem("publishers")
  if (storedPublishers) {
    try {
      const parsed = JSON.parse(storedPublishers)
      // Add hasBooks property if it doesn't exist
      return parsed.map((pub: any) => ({
        ...pub,
        hasBooks: pub.hasBooks !== undefined ? pub.hasBooks : Math.random() > 0.5, // Randomly assign for demo
      }))
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
      hasBooks: true,
    },
    {
      id: "PUB002",
      name: "HarperCollins",
      address: "195 Broadway, New York, NY",
      email: "info@harpercollins.com",
      phone: "212-207-7000",
      hasBooks: false,
    },
    {
      id: "PUB003",
      name: "Simon & Schuster",
      address: "1230 Avenue of the Americas, New York, NY",
      email: "info@simonandschuster.com",
      phone: "212-698-7000",
      hasBooks: true,
    },
    {
      id: "PUB004",
      name: "Macmillan Publishers",
      address: "120 Broadway, New York, NY",
      email: "info@macmillan.com",
      phone: "646-307-5151",
      hasBooks: false,
    },
    {
      id: "PUB005",
      name: "Hachette Book Group",
      address: "1290 Avenue of the Americas, New York, NY",
      email: "info@hachettebookgroup.com",
      phone: "212-364-1100",
      hasBooks: true,
    },
  ]
}

export default function DeletePublisherForm() {
  const [searchTerm, setSearchTerm] = useState("")
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>([])
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [error, setError] = useState("")
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
      setError("Please enter a Publisher ID or Name")
      return
    }

    setError("")
    setIsSearching(true)
    setSelectedPublisher(null)
    setShowSuccessMessage(false)

    // Simulate search delay
    setTimeout(() => {
      // Randomly simulate a database error (10% chance)
      if (Math.random() < 0.1) {
        setError("Database connection failed. Please try again later.")
        setIsSearching(false)
        return
      }

      const term = searchTerm.toLowerCase()
      const found = publishers.find((pub) => pub.id.toLowerCase() === term || pub.name.toLowerCase() === term)

      if (found) {
        setSelectedPublisher(found)
      } else {
        setError("Publisher not found.")
      }

      setIsSearching(false)
    }, 800) // Simulate a search that takes 0.8 seconds
  }

  const handleSelectPublisher = (publisher: Publisher) => {
    setSelectedPublisher(publisher)
    setSearchTerm(publisher.name) // Update search field with selected publisher name
    setFilteredPublishers([]) // Clear dropdown after selection
  }

  const handleDeleteClick = () => {
    if (!selectedPublisher) return

    // Check if publisher has associated books
    if (selectedPublisher.hasBooks) {
      setError("Cannot delete publisher. This publisher is associated with active books.")
      return
    }

    // Show confirmation dialog
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedPublisher) return

    setIsDeleting(true)
    setShowConfirmDialog(false)

    // Simulate deletion delay
    setTimeout(() => {
      // Randomly simulate a database error (5% chance)
      if (Math.random() < 0.05) {
        toast({
          title: "Database Error",
          description: "Database connection failed. Please try again later.",
          className: "bg-red-600 text-white border-red-400",
        })
        setIsDeleting(false)
        return
      }

      // Remove publisher from state
      setPublishers((prevPublishers) => prevPublishers.filter((pub) => pub.id !== selectedPublisher.id))

      // Update localStorage
      try {
        const updatedPublishers = getPublishers().filter((pub) => pub.id !== selectedPublisher.id)
        localStorage.setItem("publishers", JSON.stringify(updatedPublishers))
      } catch (e) {
        console.error("Error updating localStorage:", e)
      }

      // Show success message
      setShowSuccessMessage(true)
      setSelectedPublisher(null)
      setSearchTerm("")
      setIsDeleting(false)

      // Show success toast
      toast({
        title: "Success!",
        description: "Publisher deleted successfully.",
        className: "bg-pink-600 text-white border-pink-400",
      })
    }, 1500) // Simulate a deletion that takes 1.5 seconds
  }

  const handleCancelDelete = () => {
    setShowConfirmDialog(false)
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedPublisher(null)
    setError("")
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
          Delete Publisher
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
                  Publisher Deleted Successfully
                </h2>
                <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  The publisher has been removed from the database.
                </p>
                <div className="pt-6">
                  <Button
                    onClick={handleReset}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)] mr-4"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Delete Another Publisher
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

                {error && (
                  <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-md p-3">
                    <p className="text-white text-sm flex items-center" style={{ fontFamily: "Tahoma, sans-serif" }}>
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" /> {error}
                    </p>
                  </div>
                )}

                {selectedPublisher && !error && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                      Publisher Details
                    </h3>
                    <div className="bg-gray-900 border border-pink-500 rounded-md p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            Publisher ID
                          </p>
                          <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            {selectedPublisher.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            Publisher Name
                          </p>
                          <p className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            {selectedPublisher.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            Email
                          </p>
                          <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            {selectedPublisher.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            Phone
                          </p>
                          <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            {selectedPublisher.phone}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                          Address
                        </p>
                        <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                          {selectedPublisher.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                          Status
                        </p>
                        <p
                          className={`font-medium ${selectedPublisher.hasBooks ? "text-yellow-500" : "text-green-500"}`}
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        >
                          {selectedPublisher.hasBooks
                            ? "Has associated books"
                            : "No associated books (eligible for deletion)"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={handleDeleteClick}
                        disabled={selectedPublisher.hasBooks || isDeleting}
                        className={`flex items-center py-2 px-6 rounded-md transition-all duration-300 ${
                          selectedPublisher.hasBooks
                            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(255,0,0,0.7)] hover:shadow-[0_0_20px_rgba(255,0,0,0.9)]"
                        }`}
                        style={{ fontFamily: "Tahoma, sans-serif" }}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Publisher
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReset}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-all duration-300"
                        style={{ fontFamily: "Tahoma, sans-serif" }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-black border-pink-500 text-white shadow-[0_0_20px_rgba(255,105,180,0.6)]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Are you sure you want to delete this publisher?
            </DialogDescription>
          </DialogHeader>

          {selectedPublisher && (
            <div className="py-4">
              <div className="bg-gray-900 border border-pink-500 rounded-md p-3 mb-4">
                <p className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  {selectedPublisher.name}
                </p>
                <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  ID: {selectedPublisher.id}
                </p>
              </div>
              <p className="text-red-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                This action cannot be undone. The publisher will be permanently removed from the database.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={handleCancelDelete}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              No, Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_10px_rgba(255,0,0,0.5)] hover:shadow-[0_0_15px_rgba(255,0,0,0.7)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
