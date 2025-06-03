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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const goToRegister = () => {
    Navigate("/register")
  }
return (
  <div className="min-h-screen bg-cream flex items-center justify-center p-4">
    <div className="w-full max-w-[700px] z-10">
      <div className="bg-cream border border-blue-600/30 rounded-2xl shadow-xl shadow-blue-600/10 pt-5 pb-5 px-40 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome Back</h1>
          <p className="text-blue-600">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-blue-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pr-10 pl-2 py-2 bg-white border border-blue-600/40 rounded-md text-blue-900 placeholder:text-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-blue-800">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-white border border-blue-600/40 rounded-md text-blue-900 placeholder:text-blue-600/60 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-800 transition-colors"
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
                className="h-4 w-4 rounded border-blue-600/40 bg-white text-blue-600 focus:ring-blue-600 focus:ring-offset-cream accent-blue-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-800">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => Navigate("/password/forgot")}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="mt-4 text-center text-sm">
            <span className="text-blue-700">Don't have an account? </span>
            <button
              type="button"
              onClick={() => goToRegister()}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-blue-600/70">
          © {new Date().getFullYear()} Blue Cream Design. All rights reserved.
        </p>
      </div>
    </div>
  </div>
)
}

export default LoginForm
