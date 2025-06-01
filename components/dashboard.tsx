"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("User")
  const [isLibrarian, setIsLibrarian] = useState(false)

  // Get the logged-in user's information from localStorage
  useEffect(() => {
    // Get the email from the URL query parameter or use the last logged in email
    const email = localStorage.getItem("lastLoggedInEmail")

    if (email) {
      const registeredAccounts = JSON.parse(localStorage.getItem("registeredAccounts") || "[]")
      const account = registeredAccounts.find((acc: any) => acc.email === email)

      if (account) {
        setUsername(account.fullName)

        // For demo purposes, let's assume all users are librarians
        setIsLibrarian(true)
      }
    }
  }, [])

  const handleLogout = () => {
    // Simulate logout process
    toast({
      title: "Logging out",
      description: "You will be redirected shortly...",
      className: "bg-pink-600 text-white border-pink-400",
    })

    // Clear the last logged in email
    localStorage.removeItem("lastLoggedInEmail")

    // Redirect to logout page after a short delay
    setTimeout(() => {
      router.push("/logout")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 p-4 bg-black bg-opacity-70 rounded-xl border border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)]">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          Blackpink Dashboard
        </h1>
        <Button
          onClick={handleLogout}
          className="bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]"
          style={{ fontFamily: "Tahoma, sans-serif" }}
        >
          Logout
        </Button>
      </header>

      {/* Welcome Section */}
      <section className="mb-8">
        <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Welcome back, {username}!</CardTitle>
            <CardDescription className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Here's what's happening today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
              You've successfully logged in to your account. This is your personal dashboard.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card 1 */}
        <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Profile Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-pink-500" style={{ fontFamily: "Tahoma, sans-serif" }}>
              128
            </div>
            <p className="text-gray-300 text-sm mt-2" style={{ fontFamily: "Tahoma, sans-serif" }}>
              +12% from last week
            </p>
          </CardContent>
        </Card>

        {/* Stats Card 2 */}
        <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-pink-500" style={{ fontFamily: "Tahoma, sans-serif" }}>
              24
            </div>
            <p className="text-gray-300 text-sm mt-2" style={{ fontFamily: "Tahoma, sans-serif" }}>
              5 unread messages
            </p>
          </CardContent>
        </Card>

        {/* Stats Card 3 */}
        <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-pink-500" style={{ fontFamily: "Tahoma, sans-serif" }}>
              7
            </div>
            <p className="text-gray-300 text-sm mt-2" style={{ fontFamily: "Tahoma, sans-serif" }}>
              3 new since yesterday
            </p>
          </CardContent>
        </Card>

        {/* Library Card Request Card */}
        <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Library Card</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold text-pink-500 mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <rect width="18" height="14" x="3" y="5" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </div>
            <Button
              onClick={() => router.push("/library-card")}
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              Request Library Card
            </Button>
          </CardContent>
        </Card>

        {/* Find Book Card */}
        <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Find Books</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold text-pink-500 mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <Button
              onClick={() => router.push("/find-book")}
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              Search Books
            </Button>
          </CardContent>
        </Card>

        {/* Borrow Book Card */}
        <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white">
          <CardHeader>
            <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Borrow Books</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold text-pink-500 mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>
            <Button
              onClick={() => router.push("/borrow-book")}
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(255,105,180,0.5)] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              Borrow a Book
            </Button>
          </CardContent>
        </Card>

        {/* Publisher Management Section - Only visible to librarians */}
        {isLibrarian && (
          <Card className="bg-black bg-opacity-70 border-pink-500 shadow-[0_0_10px_rgba(255,105,180,0.4)] text-white col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle style={{ fontFamily: "Tahoma, sans-serif" }}>Publisher Management</CardTitle>
              <CardDescription className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
                Add, edit, or delete publishers from the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-pink-500 flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500 mb-3"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Add Publisher
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Add a new publisher to the database
                  </p>
                  <Button
                    onClick={() => router.push("/add-publisher")}
                    className="bg-pink-600 hover:bg-pink-700 text-white w-full shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Add New
                  </Button>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-pink-500 flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500 mb-3"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Edit Publisher
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Modify existing publisher details
                  </p>
                  <Button
                    onClick={() => router.push("/edit-publisher")}
                    className="bg-pink-600 hover:bg-pink-700 text-white w-full shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Edit
                  </Button>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-pink-500 flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-pink-500 mb-3"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                  <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Delete Publisher
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    Remove a publisher from the database
                  </p>
                  <Button
                    onClick={() => router.push("/delete-publisher")}
                    className="bg-pink-600 hover:bg-pink-700 text-white w-full shadow-[0_0_10px_rgba(255,105,180,0.5)]"
                    style={{ fontFamily: "Tahoma, sans-serif" }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
