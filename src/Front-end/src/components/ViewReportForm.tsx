"use client"

import { useState, useEffect } from "react"
import { Download, FileText, Loader2 } from "lucide-react"
import { useToast } from "../hooks/use-toast"

// Mock data for different report types
const mockData = {
  "borrowed-books": [
    {
      id: 1,
      bookTitle: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      borrower: "John Doe",
      borrowDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "Active",
    },
    {
      id: 2,
      bookTitle: "To Kill a Mockingbird",
      author: "Harper Lee",
      borrower: "Jane Smith",
      borrowDate: "2024-01-20",
      dueDate: "2024-02-20",
      status: "Returned",
    },
    {
      id: 3,
      bookTitle: "1984",
      author: "George Orwell",
      borrower: "Bob Johnson",
      borrowDate: "2024-01-25",
      dueDate: "2024-02-25",
      status: "Overdue",
    },
  ],
  "borrow-date": [
    { id: 1, date: "2024-01-15", totalBorrows: 15, newBorrows: 8, returns: 7 },
    { id: 2, date: "2024-01-16", totalBorrows: 12, newBorrows: 5, returns: 3 },
    { id: 3, date: "2024-01-17", totalBorrows: 18, newBorrows: 10, returns: 8 },
  ],
  "due-date": [
    {
      id: 1,
      bookTitle: "Pride and Prejudice",
      borrower: "Alice Brown",
      dueDate: "2024-02-01",
      daysUntilDue: 5,
      status: "Due Soon",
    },
    {
      id: 2,
      bookTitle: "The Catcher in the Rye",
      borrower: "Charlie Wilson",
      dueDate: "2024-02-03",
      daysUntilDue: 7,
      status: "Due Soon",
    },
    {
      id: 3,
      bookTitle: "Lord of the Flies",
      borrower: "Diana Davis",
      dueDate: "2024-01-28",
      daysUntilDue: -3,
      status: "Overdue",
    },
  ],
  "overdue-status": [
    {
      id: 1,
      bookTitle: "Moby Dick",
      borrower: "Edward Miller",
      dueDate: "2024-01-20",
      daysOverdue: 7,
      fineAmount: "$3.50",
    },
    {
      id: 2,
      bookTitle: "War and Peace",
      borrower: "Fiona Garcia",
      dueDate: "2024-01-18",
      daysOverdue: 9,
      fineAmount: "$4.50",
    },
    {
      id: 3,
      bookTitle: "The Odyssey",
      borrower: "George Martinez",
      dueDate: "2024-01-15",
      daysOverdue: 12,
      fineAmount: "$6.00",
    },
  ],
  "user-statistics": [
    { id: 1, userName: "John Doe", totalBorrows: 25, currentBorrows: 3, overdueBooks: 1, totalFines: "$5.50" },
    { id: 2, userName: "Jane Smith", totalBorrows: 18, currentBorrows: 2, overdueBooks: 0, totalFines: "$0.00" },
    { id: 3, userName: "Bob Johnson", totalBorrows: 32, currentBorrows: 5, overdueBooks: 2, totalFines: "$8.00" },
  ],
}

export default function LibraryReports() {
  const [userRole, setUserRole] = useState<string>("")
  const [reportType, setReportType] = useState<string>("")
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [bookType, setBookType] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false)
  const { toast } = useToast()

  // Simulate user role check
  useEffect(() => {
    // In a real app, this would come from authentication context
    const role = localStorage.getItem("userRole") || "Librarian" // Default to Librarian for demo
    setUserRole(role)
  }, [])

  // Check if user has access
  const hasAccess = userRole === "Librarian" || userRole === "Library Administrator"

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type",
        className: "bg-red-600 text-white border-red-400",
      })
      return
    }

    setIsLoading(true)
    setHasGeneratedReport(false)

    // Simulate API call delay
    setTimeout(() => {
      const data = mockData[reportType as keyof typeof mockData] || []
      setReportData(data)
      setHasGeneratedReport(true)
      setIsLoading(false)

      toast({
        title: "Report Generated",
        description: `${data.length} records found`,
        className: "bg-blue-600 text-white border-blue-400",
      })
    }, 1500)
  }

  const exportReport = (format: "csv" | "pdf") => {
    toast({
      title: "Export Started",
      description: `Exporting report as ${format.toUpperCase()}...`,
      className: "bg-green-600 text-white border-green-400",
    })
  }

  const getTableHeaders = () => {
    switch (reportType) {
      case "borrowed-books":
        return ["Book Title", "Author", "Borrower", "Borrow Date", "Due Date", "Status"]
      case "borrow-date":
        return ["Date", "Total Borrows", "New Borrows", "Returns"]
      case "due-date":
        return ["Book Title", "Borrower", "Due Date", "Days Until Due", "Status"]
      case "overdue-status":
        return ["Book Title", "Borrower", "Due Date", "Days Overdue", "Fine Amount"]
      case "user-statistics":
        return ["User Name", "Total Borrows", "Current Borrows", "Overdue Books", "Total Fines"]
      default:
        return []
    }
  }

  const renderTableRow = (item: any) => {
    switch (reportType) {
      case "borrowed-books":
        return (
          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.bookTitle}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.author}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.borrower}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.borrowDate}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.dueDate}
            </td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : item.status === "Returned"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                }`}
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                {item.status}
              </span>
            </td>
          </tr>
        )
      case "borrow-date":
        return (
          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.date}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.totalBorrows}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.newBorrows}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.returns}
            </td>
          </tr>
        )
      case "due-date":
        return (
          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.bookTitle}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.borrower}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.dueDate}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.daysUntilDue}
            </td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === "Due Soon" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                {item.status}
              </span>
            </td>
          </tr>
        )
      case "overdue-status":
        return (
          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.bookTitle}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.borrower}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.dueDate}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.daysOverdue}
            </td>
            <td className="px-4 py-3 text-gray-900 font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.fineAmount}
            </td>
          </tr>
        )
      case "user-statistics":
        return (
          <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.userName}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.totalBorrows}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.currentBorrows}
            </td>
            <td className="px-4 py-3 text-gray-900" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.overdueBooks}
            </td>
            <td className="px-4 py-3 text-gray-900 font-medium" style={{ fontFamily: "Tahoma, sans-serif" }}>
              {item.totalFines}
            </td>
          </tr>
        )
      default:
        return null
    }
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-4">
            <FileText className="h-16 w-16 mx-auto text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Access Denied
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Only Librarians and Library Administrators can access this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#033060] mb-4"
            style={{ fontFamily: "Tahoma, sans-serif" }}
          >
            LIBRARY REPORTS
          </h1>
          <div className="h-1 w-32 bg-[#033060] mx-auto rounded-full shadow-[0_0_10px_rgba(3,48,96,0.7)]"></div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] p-6">
          <h2 className="text-xl font-bold text-[#033060] mb-4" style={{ fontFamily: "Tahoma, sans-serif" }}>
            Report Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Report Type */}
            <div className="space-y-2">
              <label
                htmlFor="reportType"
                className="text-[#033060] font-medium"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                Report Type *
              </label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                <option value="">Select report type</option>
                <option value="borrowed-books">Borrowed Books</option>
                <option value="borrow-date">Borrow Date</option>
                <option value="due-date">Due Date</option>
                <option value="overdue-status">Overdue Status</option>
                <option value="user-statistics">User Statistics</option>
              </select>
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <label
                htmlFor="fromDate"
                className="text-[#033060] font-medium"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                From Date
              </label>
              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              />
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <label
                htmlFor="toDate"
                className="text-[#033060] font-medium"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                To Date
              </label>
              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              />
            </div>

            {/* Book Type */}
            <div className="space-y-2">
              <label
                htmlFor="bookType"
                className="text-[#033060] font-medium"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                Book Type (Optional)
              </label>
              <select
                id="bookType"
                value={bookType}
                onChange={(e) => setBookType(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                <option value="">Select book type</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="reference">Reference</option>
                <option value="textbook">Textbook</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-[#033060] font-medium"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                Status (Optional)
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pr-10 pl-2 py-2 bg-white border border-[#033060] rounded-md text-[#033060] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#033060] focus:border-[#033060]"
                style={{ fontFamily: "Tahoma, sans-serif" }}
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {/* Generate Report Button */}
          <div className="mt-6">
            <button
              onClick={generateReport}
              disabled={isLoading}
              className="w-full md:w-auto bg-[#033060] hover:bg-[#044080] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#033060]/50 transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: "Tahoma, sans-serif" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4 inline" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {hasGeneratedReport && (
          <div className="bg-white rounded-xl border border-[#033060] shadow-[0_0_15px_rgba(3,48,96,0.5)] p-6">
            <div className="flex flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#033060]" style={{ fontFamily: "Tahoma, sans-serif" }}>
                Report Results
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => exportReport("csv")}
                  disabled={!hasGeneratedReport || reportData.length === 0}
                  className="px-4 py-2 bg-white border border-[#033060] rounded-md text-[#033060] hover:bg-[#033060] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  <Download className="mr-2 h-4 w-4 inline" />
                  Export CSV
                </button>
                <button
                  onClick={() => exportReport("pdf")}
                  disabled={!hasGeneratedReport || reportData.length === 0}
                  className="px-4 py-2 bg-white border border-[#033060] rounded-md text-[#033060] hover:bg-[#033060] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  <Download className="mr-2 h-4 w-4 inline" />
                  Export PDF
                </button>
              </div>
            </div>
            <div>
              {reportData.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-[#033060] mb-4" />
                  <p className="text-xl text-[#033060]" style={{ fontFamily: "Tahoma, sans-serif" }}>
                    No data found.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#033060]">
                        {getTableHeaders().map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-3 text-left text-sm font-bold text-[#033060] uppercase tracking-wider"
                            style={{ fontFamily: "Tahoma, sans-serif" }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{reportData.map((item) => renderTableRow(item))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
