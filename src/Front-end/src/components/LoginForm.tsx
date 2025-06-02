import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { loginUser } from "../service/Services"
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

const handleLoginSuccess = (role: string) => {
    localStorage.setItem('user', JSON.stringify({ isLogged: true, role: role }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    setError('');
    const result = await loginUser(email, password);
    if (result.success) {
      handleLoginSuccess(result.role);
      if (result.role === 'A') {
        navigate('/A');
      } else if (result.role === 'S') {
        navigate('/S');
      } else if (result.role === 'L') {
        navigate('/L');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  const goToRegister = () => {
    navigate("/register")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#033060]/20 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#033060]/20 to-transparent blur-3xl"></div>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#033060]" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Welcome Back
          </h1>
          <div className="h-1 w-24 bg-[#033060] mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(3,48,96,0.7)]"></div>
          <p className="text-[#033060] mt-2">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-[#033060] font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#033060]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#033060]/30 bg-white text-[#033060] focus:ring-[#033060] focus:ring-offset-white accent-[#033060]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#033060]">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate("/password/forgot")}
                className="font-medium text-[#033060] hover:text-[#044080] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#033060] hover:bg-[#044080] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#033060]/50 transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ fontFamily: "Tahoma, sans-serif" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="pt-4 text-center">
          <p className="text-[#033060] text-sm" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Don't have an account?{' '}
            <button onClick={goToRegister} className="text-[#033060] hover:text-[#044080] hover:underline transition-colors">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
