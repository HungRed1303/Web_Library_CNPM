"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

interface BookDetailsProps {
  book: Book
  onBack: () => void
}

export function BookDetails({ book, onBack }: BookDetailsProps) {
  return (
    <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
      <CardContent className="p-6">
        <Button
          onClick={onBack}
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-all duration-300"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          ← Back to Results
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <img
              src={book.coverImage || "/placeholder.svg"}
              alt={`Cover of ${book.title}`}
              className="w-full max-w-[200px] h-auto rounded border border-gray-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {book.title}
            </h2>

            <div className="space-y-2">
              <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                <span className="font-semibold">Author:</span> {book.author}
              </p>
              <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                <span className="font-semibold">Category:</span> {book.category}
              </p>
              <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                <span className="font-semibold">Location:</span> {book.location}
              </p>
              <p
                className={`font-semibold ${book.available ? "text-green-400" : "text-red-400"}`}
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                {book.available ? `Available (${book.copies} copies)` : "Not Available"}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
                Description
              </h3>
              <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                {book.description}
              </p>
            </div>

            {book.available && (
              <div className="pt-4">
                <Button
                  className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  Reserve Book
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
