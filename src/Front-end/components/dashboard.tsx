"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [username] = useState("User")

  const handleLogout = () => {
    // Simulate logout process
    toast({
      title: "Logging out",
      description: "You will be redirected shortly...",
      className: "bg-pink-600 text-white border-pink-400",
    })

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
      </div>
    </div>
  )
}
