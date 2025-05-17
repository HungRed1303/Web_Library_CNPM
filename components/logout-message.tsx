"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LogoutMessage() {
  const router = useRouter()

  const goToLogin = () => {
    router.push("/")
  }

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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
          See you again soon!
        </h1>

        <p className="text-gray-300" style={{ fontFamily: "Tahoma, sans-serif" }}>
          You have been successfully logged out.
        </p>
      </div>

      <Button
        onClick={goToLogin}
        className="mt-8 px-8 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.7)] hover:shadow-[0_0_20px_rgba(255,105,180,0.9)]"
        style={{ fontFamily: "Tahoma, sans-serif" }}
      >
        LOGIN AGAIN
      </Button>
    </div>
  )
}
