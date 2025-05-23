"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Link} from "react-router-dom"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full max-w-md z-10">
      <div className="bg-black border border-pink-600/30 rounded-2xl shadow-xl shadow-pink-600/10 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-pink-300">Sign in to your account</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-pink-100">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-black/50 border-pink-600/30 text-white placeholder:text-pink-300/50 focus-visible:ring-pink-600 focus-visible:border-pink-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-pink-100">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-black/50 border-pink-600/30 text-white placeholder:text-pink-300/50 focus-visible:ring-pink-600 focus-visible:border-pink-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-pink-300 hover:text-pink-100"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-pink-600/30 bg-black text-pink-600 focus:ring-pink-600 focus:ring-offset-black"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-pink-100">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link href="#" className="font-medium text-pink-400 hover:text-pink-300">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-pink-600/50"
          >
            Sign in
          </Button>

          <div className="mt-4 text-center text-sm">
            <span className="text-pink-300">Don&apos;t have an account? </span>
            <Link to="https://example.com/signup" className="font-medium text-pink-400 hover:text-pink-300">
              Sign up
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-pink-300/70">
          © {new Date().getFullYear()} BLACKPINK Inspired. All rights reserved.
        </p>
      </div>
    </div>
  )
}
