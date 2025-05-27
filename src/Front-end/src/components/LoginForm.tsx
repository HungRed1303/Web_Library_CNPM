import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import {loginUser} from "../service/Services"
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const Navigate = useNavigate()

const handleLoginSuccess = (role) => {
    localStorage.setItem('user', JSON.stringify({ isLogged: true, role: role }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    setError('');

    const result = await loginUser(email, password);

    if (result.success)
    {
      handleLoginSuccess(result.role);
      console.log("Login successful");
      if (result.role === 'A')
      {
        Navigate('/A');
      }
      else if (result.role === 'S')
      {
        Navigate('/S');
      }
      else if(result.role === 'L') 
      {
        Navigate('/L');
      }
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-pink-600/20 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-pink-600/20 to-transparent blur-3xl"></div>
      </div>

      <div className="w-full max-w-[700px] z-10">
        <div className="bg-black border border-pink-600/30 rounded-2xl shadow-xl shadow-pink-600/10 pt-6 pb-6 px-40 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-pink-300">Sign in to your account</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-pink-100">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-black/50 border border-pink-600/30 rounded-md text-white placeholder:text-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-pink-100">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-2 py-2 bg-black/50 border border-pink-600/30 rounded-md text-white placeholder:text-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-pink-300 hover:text-pink-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-pink-600/30 bg-black text-pink-600 focus:ring-pink-600 focus:ring-offset-black accent-pink-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-pink-100">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => alert("Forgot password functionality would be implemented here")}
                  className="font-medium text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-pink-600/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign in
            </button>

            <div className="mt-4 text-center text-sm">
              <span className="text-pink-300">Don't have an account? </span>
              <button
                type="button"
                onClick={() => alert("Sign up functionality would be implemented here")}
                className="font-medium text-pink-400 hover:text-pink-300 transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-pink-300/70">
            © {new Date().getFullYear()} BLACKPINK Inspired. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
