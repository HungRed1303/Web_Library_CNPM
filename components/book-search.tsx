"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BookDetails } from "@/components/book-details"

// Book type definition
interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string
  available: boolean
  copies: number
  location: string
  coverImage: string
}

// Mock book database
const mockBooks: Book[] = [
  {
    id: "1",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle.",
    available: true,
    copies: 3,
    location: "Section A, Shelf 2",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "2",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description:
      "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.",
    available: true,
    copies: 2,
    location: "Section A, Shelf 3",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Classic",
    description:
      "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.",
    available: false,
    copies: 0,
    location: "Section B, Shelf 1",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Classic",
    description:
      "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    available: true,
    copies: 1,
    location: "Section B, Shelf 2",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "5",
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    available: true,
    copies: 4,
    location: "Section C, Shelf 1",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "6",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    description: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    available: false,
    copies: 0,
    location: "Section B, Shelf 3",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "7",
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Dystopian",
    description:
      "Aldous Huxley's profoundly important classic of world literature, Brave New World is a searching vision of an unequal, technologically-advanced future where humans are genetically bred, socially indoctrinated, and pharmaceutically anesthetized to passively uphold an authoritarian ruling order.",
    available: true,
    copies: 2,
    location: "Section C, Shelf 2",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "8",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    description:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep.",
    available: true,
    copies: 3,
    location: "Section A, Shelf 4",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "9",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Coming-of-age",
    description:
      "The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.",
    available: false,
    copies: 0,
    location: "Section D, Shelf 1",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
  {
    id: "10",
    title: "Moby Dick",
    author: "Herman Melville",
    category: "Adventure",
    description:
      "The saga of Captain Ahab and his monomaniacal pursuit of the white whale remains a peerless adventure story but one full of mythic grandeur, poetic majesty, and symbolic power.",
    available: true,
    copies: 1,
    location: "Section D, Shelf 2",
    coverImage: "/placeholder.svg?height=200&width=150",
  },
]

export default function BookSearch() {
  const [searchParams, setSearchParams] = useState({
    title: "",
    author: "",
    category: "",
  })
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)
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
    } else {
      setIsLoggedIn(true)
    }
  }, [router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSelectedBook(null)
    setError(null)
    setIsSearching(true)
    setHasSearched(true)

    // Simulate network delay
    setTimeout(() => {
      // Randomly simulate a database error (10% chance)
      if (Math.random() < 0.1) {
        setError("Database connection failed. Please try again later.")
        setIsSearching(false)
        return
      }

      // Filter books based on search parameters
      const results = mockBooks.filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(searchParams.title.toLowerCase())
        const authorMatch = book.author.toLowerCase().includes(searchParams.author.toLowerCase())
        const categoryMatch = book.category.toLowerCase().includes(searchParams.category.toLowerCase())

        // If a field is empty, don't filter by it
        return (
          (searchParams.title === "" || titleMatch) &&
          (searchParams.author === "" || authorMatch) &&
          (searchParams.category === "" || categoryMatch)
        )
      })

      setSearchResults(results)
      setIsSearching(false)
    }, 1500) // Simulate a search that takes 1.5 seconds
  }

  const handleReset = () => {
    setSearchParams({
      title: "",
      author: "",
      category: "",
    })
    setSearchResults([])
    setHasSearched(false)
    setSelectedBook(null)
    setError(null)
  }

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
  }

  const handleBackToResults = () => {
    setSelectedBook(null)
  }

  const goToDashboard = () => {
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
          Find a Book
        </h1>
        <Button
          onClick={goToDashboard}
          className="bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          Back to Dashboard
        </Button>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Search Form */}
        {!selectedBook && (
          <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-white font-medium"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    >
                      Book Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={searchParams.title}
                      onChange={handleInputChange}
                      placeholder="Enter book title"
                      className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="author"
                      className="text-white font-medium"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    >
                      Author
                    </Label>
                    <Input
                      id="author"
                      name="author"
                      value={searchParams.author}
                      onChange={handleInputChange}
                      placeholder="Enter author name"
                      className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-white font-medium"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    >
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={searchParams.category}
                      onChange={handleInputChange}
                      placeholder="Enter book category"
                      className="bg-gray-900 border-pink-500 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400 shadow-[0_0_5px_rgba(255,105,180,0.3)] focus:shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                      style={{ fontFamily: "Tahoma, sans-serif" }}
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-all duration-300"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 bg-opacity-70 border border-red-500 rounded-xl p-6 text-center shadow-[0_0_10px_rgba(255,0,0,0.4)]">
            <p className="text-white text-lg" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {error}
            </p>
            <Button
              onClick={() => setError(null)}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition-all duration-300"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Book Details View */}
        {selectedBook && <BookDetails book={selectedBook} onBack={handleBackToResults} />}

        {/* Search Results */}
        {!selectedBook && hasSearched && !error && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Search Results
            </h2>

            {searchResults.length === 0 ? (
              <div className="bg-gray-900 bg-opacity-70 border border-pink-500 rounded-xl p-6 text-center shadow-[0_0_10px_rgba(255,105,180,0.4)]">
                <p className="text-white text-lg" style={{ fontFamily: "Tahoma, sans-serif" }}>
                  No books found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((book) => (
                  <Card
                    key={book.id}
                    className="bg-black bg-opacity-70 border-pink-500 hover:border-pink-400 shadow-[0_0_10px_rgba(255,105,180,0.4)] hover:shadow-[0_0_15px_rgba(255,105,180,0.6)] text-white cursor-pointer transition-all duration-300"
                    onClick={() => handleBookClick(book)}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start space-x-4">
                        <div className="w-1/3">
                          <img
                            src={book.coverImage || "/placeholder.svg"}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-auto rounded border border-gray-700"
                          />
                        </div>
                        <div className="w-2/3 space-y-2">
                          <h3 className="font-bold text-lg text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            {book.title}
                          </h3>
                          <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            by {book.author}
                          </p>
                          <p className="text-gray-400 text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
                            Category: {book.category}
                          </p>
                          <div
                            className={`text-sm ${book.available ? "text-green-400" : "text-red-400"}`}
                            style={{ fontFamily: "Tahoma, sans-serif" }}
                          >
                            {book.available ? "Available" : "Not Available"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
