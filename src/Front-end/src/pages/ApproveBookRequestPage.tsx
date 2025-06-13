import React, {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { Search, Check, X, BookOpen } from "lucide-react"
import { getAllBookRequests,issueBook,rejectBookRequest } from '../service/bookRequestService'; 
import { Toast } from '@radix-ui/react-toast';

type ToastType = { type: "success" | "error", message: string } | null;

const BookApprovalPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [toast, setToast] = useState<ToastType>(null)
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  type BorrowRequest = {
    request_id: number;
    student_name: string;
    book_title: string;
    request_date: string;
    status: string;
    // Add other fields if needed
  }
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([])

  // Fetch book requests on component mount
  useEffect(() => {
    fetchBookRequests()
  }, [])

  const fetchBookRequests = async () => {
    try {
      setIsLoading(true)
      const data = await getAllBookRequests()
      setBorrowRequests(data || [])
    } catch (error) {
      console.error('Error loading book requests:', error)
      showToastMessage("error", "Không thể tải danh sách yêu cầu!")
      setBorrowRequests([])
    } finally {
      setIsLoading(false)
    }
  }

interface ShowToastMessage {
    (type: "success" | "error", message: string): () => void;
}

const showToastMessage: ShowToastMessage = (type, message) => {
    setToast({ type, message })
    setShowToast(true)
    const hideTimer = setTimeout(() => setShowToast(false), 2000)
    const clearTimer = setTimeout(() => setToast(null), 2500)
    return () => {
        clearTimeout(hideTimer)
        clearTimeout(clearTimer)
    }
}

  const handleApprove = async (id) => {
    try {
      await issueBook(id)
      // Refresh the data after successful approval
      await fetchBookRequests()
      showToastMessage("success", "Yêu cầu đã được duyệt thành công!")
    } catch (error) {
      console.error('Error approving request:', error)
      showToastMessage("error", "Không thể duyệt yêu cầu!")
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectBookRequest(id)
      // Refresh the data after successful rejection
      await fetchBookRequests()
      showToastMessage("success", "Yêu cầu đã được từ chối!")
    } catch (error) {
      console.error('Error rejecting request:', error)
      showToastMessage("error", "Không thể từ chối yêu cầu!")
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "approved":
        return "text-green-600 bg-green-50 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      default: 
        return "text-[#033060] bg-blue-50 border-blue-200"
    }
  }

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case "pending": return "Chờ duyệt"
      case "approved": return "Đã duyệt"
      case "rejected": return "Từ chối"
      default: return status || "Không xác định"
    }
  }

  const isPending = (status) => {
    return status?.toLowerCase() === "pending"
  }

  const filteredRequests = borrowRequests.filter(req => {
    const searchFields = [
      req.student_name || '',
      req.book_title || '',
      req.request_id?.toString() || ''
    ].join(' ').toLowerCase()
    
    const matchesSearch = searchFields.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || req.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const sortedRequests = [...filteredRequests].sort((a, b) => (a.request_id || 0) - (b.request_id || 0))

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('vi-VN')
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="flex items-center mb-1">
          <BookOpen className="h-12 w-12 text-[#033060] mr-3" />
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow" style={{letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3'}}>Book Borrow Approval</h1>
        </div>
        <p className="text-gray-600 text-lg">Manage student book borrowing requests efficiently</p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên học sinh, tên sách hoặc mã yêu cầu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition-all duration-150"
              style={{boxShadow: '0 1px 4px 0 #e0e7ef'}}
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-150 min-w-[200px]"
          style={{boxShadow: '0 1px 4px 0 #e0e7ef'}}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>

      {/* Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[80px]">Mã YC</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[200px]">Học sinh</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[250px]">Tên sách</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[140px]">Ngày yêu cầu</th>
                <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-[120px]">Trạng thái</th>
                <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-[150px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033060]"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : sortedRequests.length > 0 ? (
                sortedRequests.map((request) => (
                  <tr key={request.request_id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[80px] font-medium">
                      #{request.request_id}
                    </td>
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[200px]">
                      <div className="font-medium truncate" title={request.student_name}>
                        {request.student_name || 'N/A'}
                      </div>
                    </td>
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[250px]">
                      <div className="font-medium truncate" title={request.book_title}>
                        {request.book_title || 'N/A'}
                      </div>
                    </td>
                    <td className="py-2.5 px-5 text-left text-[#033060] text-base w-[140px]">
                      {formatDate(request.request_date)}
                    </td>
                    <td className="py-2.5 px-5 text-left w-[120px]">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 text-center w-[150px]">
                      <div className="flex justify-center gap-2">
                        {isPending(request.status) && (
                          <>
                            <button
                              onClick={() => handleApprove(request.request_id)}
                              className="group flex items-center text-green-600 hover:text-white hover:bg-green-600 px-3 py-1.5 rounded transition text-sm border border-transparent hover:border-green-600"
                              title="Duyệt"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleReject(request.request_id)}
                              className="group flex items-center text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded transition text-sm border border-transparent hover:border-red-600"
                              title="Từ chối"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Từ chối
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-base">Không tìm thấy yêu cầu nào</p>
                      <p className="text-gray-400 text-sm">Thử điều chỉnh từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-10 bg-white text-[#033060] px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 text-xl font-bold z-50 transition-all duration-500 ${showToast ? "opacity-100" : "opacity-0"}`} style={{boxShadow: '0 8px 32px 0 rgba(3,48,96,0.15)'}}>
          {toast.type === "success" ? 
            <Check className="h-8 w-8 text-green-500" /> : 
            <X className="h-8 w-8 text-red-500" />
          }
          {toast.message}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Library Management System. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default BookApprovalPage