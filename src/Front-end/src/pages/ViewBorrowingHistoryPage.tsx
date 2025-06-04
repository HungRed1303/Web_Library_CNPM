"use client"

import React, { useState, useEffect } from "react"
import { Book, Calendar, DollarSign, Search } from "lucide-react"
import { useSearchParams } from "react-router-dom"

// Sample borrowing history data
const borrowingHistory = [
  {
    student_id: 1,
    title: "Clean Code",
    borrowed: "2025-04-01",
    returned: "2025-04-10",
    status: "On Time",
    fine: "$0",
  },
  {
    student_id: 1,
    title: "JavaScript: The Good Parts",
    borrowed: "2025-03-15",
    returned: "2025-03-25",
    status: "Late",
    fine: "$5",
  },
  {
    student_id: 2,
    title: "The Pragmatic Programmer",
    borrowed: "2025-02-20",
    returned: "2025-03-02",
    status: "On Time",
    fine: "$0",
  },
  {
    title: "Design Patterns",
    borrowed: "2025-01-10",
    returned: "2025-01-25",
    status: "Late",
    fine: "$3",
  },
  {
    title: "Refactoring",
    borrowed: "2024-12-15",
    returned: "2024-12-28",
    status: "On Time",
    fine: "$0",
  },
  {
    title: "Code Complete",
    borrowed: "2024-11-20",
    returned: "2024-12-05",
    status: "Late",
    fine: "$7",
  },
  {
    title: "You Don't Know JS",
    borrowed: "2024-10-10",
    returned: "2024-10-20",
    status: "On Time",
    fine: "$0",
  },
  {
    title: "Eloquent JavaScript",
    borrowed: "2024-09-05",
    returned: "2024-09-18",
    status: "On Time",
    fine: "$0",
  },
]

export default function LibraryHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const searchParams = useSearchParams()
  const studentId = searchParams.get('studentId')

  // Filter history based on studentId if provided
  const filteredByStudent = studentId 
    ? borrowingHistory.filter(record => record.student_id === parseInt(studentId))
    : borrowingHistory

  const totalFines = filteredByStudent.reduce((sum, record) => {
    const fine = Number.parseFloat(record.fine.replace("$", ""))
    return sum + fine
  }, 0)

  const onTimeCount = filteredByStudent.filter((record) => record.status === "On Time").length
  const lateCount = filteredByStudent.filter((record) => record.status === "Late").length

  const filteredHistory = filteredByStudent.filter((record) =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="flex items-center mb-1">
          <Book className="h-12 w-12 text-[#033060] mr-3" />
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow" style={{letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3'}}>
            {studentId ? "Student Borrowing History" : "Borrowing History"}
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          {studentId 
            ? "View the complete borrowing history for this student"
            : "View your complete borrowing history and track your fines"}
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-7xl mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
          <input
            type="text"
            placeholder="Search by book title..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition-all duration-150"
            style={{boxShadow: '0 1px 4px 0 #e0e7ef'}}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-4" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#033060] font-semibold text-base">Total Books Borrowed</h3>
            <Book className="h-6 w-6 text-[#033060]" />
          </div>
          <div className="text-2xl font-bold text-[#033060]">{filteredByStudent.length}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-4" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#033060] font-semibold text-base">Return Status</h3>
            <Calendar className="h-6 w-6 text-[#033060]" />
          </div>
          <div className="text-2xl font-bold text-green-600">{onTimeCount}</div>
          <p className="text-xs text-gray-500 mt-1">Late returns: {lateCount}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-4" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#033060] font-semibold text-base">Total Fines</h3>
            <DollarSign className="h-6 w-6 text-[#033060]" />
          </div>
          <div className="text-2xl font-bold text-red-600">${totalFines}</div>
        </div>
      </div>

      {/* Borrowing History Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="p-6 border-b border-[#dbeafe]">
          <h2 className="text-2xl font-bold text-[#033060]">Borrowing History Details</h2>
          <p className="text-gray-600">Complete list of your borrowed and returned books</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Book Title</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Borrowed Date</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Returned Date</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Status</th>
                <th className="py-3 px-5 text-right text-[#033060] font-bold text-base">Fine</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record, index) => (
                <tr key={index} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                  <td className="py-2.5 px-5 font-semibold text-[#033060] text-base">{record.title}</td>
                  <td className="py-2.5 px-5 text-[#033060] text-base">{record.borrowed}</td>
                  <td className="py-2.5 px-5 text-[#033060] text-base">{record.returned}</td>
                  <td className="py-2.5 px-5">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      record.status === "On Time" 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-5 text-right font-medium">
                    <span className={record.fine === "$0" ? "text-green-600" : "text-red-600"}>
                      {record.fine}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Borrowing History",
  description: "View your library borrowing history",
};
