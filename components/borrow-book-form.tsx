"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format, addDays } from "date-fns"

// Book type definition
interface Book {
  id: string
  title: string
  author: string
  category: string
  available: boolean
}

// Mock book database
const mockBooks: Book[] = [
  {
    id: "B001",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    available: true,
  },
  {
    id: "B002",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    available: true,
  },
  {
    id: "B003",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Classic",
    available: false,
  },
  {
    id: "B004",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic",
    available: true,
  },
  {
    id: "B005",
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    available: true,
  },
  {
    id: "B006",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    available: false,
  },
  {
    id: "B007",
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Dystopian",
    available: true,
  },
  {
    id: "B008",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    available: true,
  },
]

// Similar books suggestions based on category
const getSimilarBooks = (category: string): Book[] => {
  return mockBooks.filter((book) => book.category === category && book.available)
}

export default function BorrowBookForm() {
  const [bookId, setBookId] = useState("")
  const [selectedBookId, setSelectedBookId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [hasLibraryCard, setHasLibraryCard] = useState(false)
  const [borrowDate, setBorrowDate] = useState<Date>(new Date())
  const [borrowDateString, setBorrowDateString] = useState(format(new Date(), "yyyy-MM-dd"))
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 14))
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [similarBooks, setSimilarBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const { toast } = useToast()
  const router = useRouter()

  // Check if user is logged in and has a library card
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

    // Get user data
    const registeredAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")
    const account = registeredAccounts.find((acc: any) => acc.email === email)

    if (account) {
      setUserData(account)

      // Check if user has a library card
      const libraryRequests = JSON.parse(localStorage.getItem("libraryRequests") || "[]")
      const hasCard = libraryRequests.some((req: any) => req.email === email && req.status !== "Rejected")
      setHasLibraryCard(hasCard)

      // Initialize borrowing data if not exists
      if (!account.borrowing) {
        account.borrowing = {
          currentBooks: 0,
          hasOverdue: false,
          borrowedBooks: [],
        }

        // Update localStorage
        localStorage.setItem("registeredAccounts", JSON.stringify(registeredAccounts))
      }
    }
  }, [router, toast])

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    setBorrowDateString(dateString)

    try {
      // Parse the date string to a Date object
      const date = new Date(dateString)

      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        setBorrowDate(date)
        setDueDate(addDays(date, 14))
      }
    } catch (error) {
      console.error("Invalid date format", error)
    }
  }

  const handleBookIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookId(e.target.value)
    setSelectedBookId("")
  }

  const handleSelectBook = (value: string) => {
    setSelectedBookId(value)
    setBookId("")
  }

  const checkEligibility = () => {
    if (!hasLibraryCard) {
      setErrorMessage("You don't have a library card. Please request one first.")
      return false
    }

    if (userData.borrowing?.currentBooks >= 3) {
      setErrorMessage("You have reached the maximum limit of 3 borrowed books.")
      return false
    }

    if (userData.borrowing?.hasOverdue) {
      setErrorMessage("You have overdue books. Please return them before borrowing new ones.")
      return false
    }

    return true
  }

  const findBook = () => {
    const id = bookId || selectedBookId
    return mockBooks.find((book) => book.id === id)
  }

  const handleBorrow = () => {
    setIsProcessing(true)
    setShowError(false)
    setSimilarBooks([])

    // Simulate processing delay
    setTimeout(() => {
      // Check if book ID is provided
      if (!bookId && !selectedBookId) {
        setErrorMessage("Please enter a Book ID or select a book from the dropdown.")
        setShowError(true)
        setIsProcessing(false)
        return
      }

      // Check student eligibility
      if (!checkEligibility()) {
        setShowError(true)
        setIsProcessing(false)
        return
      }

      // Find the book
      const book = findBook()
      setSelectedBook(book || null)

      // Check if book exists
      if (!book) {
        setErrorMessage("Book not found. Please check the Book ID.")
        setShowError(true)
        setIsProcessing(false)
        return
      }

      // Check if book is available
      if (!book.available) {
        setErrorMessage("Book is currently unavailable.")
        setShowError(true)

        // Suggest similar books
        const similar = getSimilarBooks(book.category)
        setSimilarBooks(similar)

        setIsProcessing(false)
        return
      }

      // Randomly simulate a database error (5% chance)
      if (Math.random() < 0.05) {
        setErrorMessage("Database connection failed. Please try again later. Your request has been saved temporarily.")
        setShowError(true)
        setIsProcessing(false)
        return
      }

      // Success - show confirmation dialog
      setShowConfirmation(true)
      setIsProcessing(false)
    }, 1500) // Simulate a 1.5 second processing time
  }

  const confirmBorrow = () => {
    // Update user's borrowing data
    if (userData && selectedBook) {
      const registeredAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")
      const accountIndex = registeredAccounts.findIndex((acc: any) => acc.email === userData.email)

      if (accountIndex !== -1) {
        // Initialize borrowing if not exists
        if (!registeredAccounts[accountIndex].borrowing) {
          registeredAccounts[accountIndex].borrowing = {
            currentBooks: 0,
            hasOverdue: false,
            borrowedBooks: [],
          }
        }

        // Update borrowing count
        registeredAccounts[accountIndex].borrowing.currentBooks += 1

        // Add book to borrowed books
        registeredAccounts[accountIndex].borrowing.borrowedBooks.push({
          bookId: selectedBook.id,
          title: selectedBook.title,
          borrowDate: format(borrowDate, "dd/MM/yyyy"),
          dueDate: format(dueDate, "dd/MM/yyyy"),
          returned: false,
        })

        // Update localStorage
        localStorage.setItem("registeredAccounts", JSON.stringify(registeredAccounts))
      }
    }

    // Show success toast
    toast({
      title: "Book Borrowed Successfully",
      description: `Due date: ${format(dueDate, "dd/MM/yyyy")}`,
      className: "bg-pink-600 text-white border-pink-400",
    })

    // Close confirmation dialog
    setShowConfirmation(false)

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  const handleReserve = (book: Book) => {
    toast({
      title: "Book Reserved",
      description: `You will be notified when "${book.title}" becomes available.`,
      className: "bg-pink-600 text-white border-pink-400",
    })
  }

  if (!isLoggedIn) {
    return null // Don't render anything if not logged in
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 p-4 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)]">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Borrow a Book
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
      <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                Enter Book Details
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="bookId"
                    className="text-white font-medium"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Book ID
                  </Label>
                  <Input
                    id="bookId"
                    value={bookId}
                    onChange={handleBookIdChange}
                    placeholder="Enter Book ID (e.g., B001)"
                    className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                    disabled={!!selectedBookId || isProcessing}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-16 border-t border-gray-600"></div>
                  <span className="mx-4 text-gray-400" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    OR
                  </span>
                  <div className="w-16 border-t border-gray-600"></div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="selectBook"
                    className="text-white font-medium"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Select a Book
                  </Label>
                  <Select value={selectedBookId} onValueChange={handleSelectBook} disabled={!!bookId || isProcessing}>
                    <SelectTrigger
                      className="bg-gray-900 border-pink-500 text-white focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    >
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-pink-500 text-white">
                      {mockBooks.map((book) => (
                        <SelectItem
                          key={book.id}
                          value={book.id}
                          className="focus:bg-pink-900 focus:text-white"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        >
                          {book.title} ({book.available ? "Available" : "Unavailable"})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="borrowDate"
                    className="text-white font-medium"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Borrow Date
                  </Label>
                  <Input
                    id="borrowDate"
                    type="date"
                    value={borrowDateString}
                    onChange={handleDateChange}
                    className="bg-gray-900 border-pink-500 text-white focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  />
                  <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Due Date: {format(dueDate, "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button
                onClick={handleBorrow}
                disabled={isProcessing || (!bookId && !selectedBookId)}
                className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                {isProcessing ? "Processing..." : "Borrow"}
              </Button>
              <Button
                onClick={handleCancel}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-all duration-300"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {showError && (
        <Card className="mt-6 bg-black bg-opacity-70 border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.4)] text-white">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-red-400" style={{ fontFamily: "Tahoma, sans-serif" }}>
                Unable to Borrow
              </h3>
              <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                {errorMessage}
              </p>

              {errorMessage === "Book is currently unavailable." && similarBooks.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Similar Books Available:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarBooks.map((book) => (
                      <div key={book.id} className="p-3 bg-gray-800 rounded-md border border-pink-500">
                        <p className="font-medium text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                          {book.title}
                        </p>
                        <p className="text-sm text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                          by {book.author}
                        </p>
                        <Button
                          onClick={() => {
                            setSelectedBookId(book.id)
                            setBookId("")
                            setShowError(false)
                          }}
                          className="mt-2 bg-pink-600 hover:bg-pink-700 text-white text-sm py-1 px-3 rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                          style={{ fontFamily: "Tahoma, sans-serif" }}
                        >
                          Select This Book
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errorMessage === "Book is currently unavailable." && selectedBook && (
                <Button
                  onClick={() => handleReserve(selectedBook)}
                  className="mt-2 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  Reserve This Book
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-black border-pink-500 text-white shadow-[0_0_20px_rgba(255,105,180,0.6)]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Confirm Borrowing
            </DialogTitle>
            <DialogDescription className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Please review the borrowing details below.
            </DialogDescription>
          </DialogHeader>

          {selectedBook && (
            <div className="py-4 space-y-3">
              <div>
                <p className="text-gray-400" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  Book Title:
                </p>
                <p className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  {selectedBook.title}
                </p>
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  Author:
                </p>
                <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  {selectedBook.author}
                </p>
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  Book ID:
                </p>
                <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  {selectedBook.id}
                </p>
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  Borrow Date:
                </p>
                <p className="text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  {format(borrowDate, "dd/MM/yyyy")}
                </p>
              </div>
              <div>
                <p className="text-gray-400" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  Due Date:
                </p>
                <p className="text-white font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  {format(dueDate, "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBorrow}
              className="bg-pink-600 hover:bg-pink-700 text-white shadow-[0_0_10px_rgba(255,105,180,0.5)] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              Confirm Borrow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
