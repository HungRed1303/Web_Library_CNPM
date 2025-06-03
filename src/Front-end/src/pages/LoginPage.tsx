import LoginForm from "../components/LoginForm"

const LoginPage = () => {
  return (
    <main className="h-screen bg-cream flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-600/20 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-blue-600/20 to-transparent blur-3xl"></div>
      </div>
      <LoginForm />
    </main>
  )
}

export default LoginPage;

