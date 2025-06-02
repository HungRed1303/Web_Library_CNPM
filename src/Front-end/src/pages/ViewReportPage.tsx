import ViewReportForm from "../components/ViewReportForm"

export default function ViewReportPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#033060]/20 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#033060]/20 to-transparent blur-3xl"></div>
      </div>
      <ViewReportForm />
    </div>
  )
}