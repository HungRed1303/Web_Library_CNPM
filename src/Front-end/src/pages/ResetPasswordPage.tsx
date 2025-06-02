import ResetPasswordForm from "../components/ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f3f6fa] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[150%] rounded-full bg-gradient-to-br from-[#033060]/20 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[150%] rounded-full bg-gradient-to-tl from-[#033060]/20 to-transparent blur-3xl"></div>
      </div>
      <ResetPasswordForm />
    </div>
  )
}