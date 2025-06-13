import React, { useState, useEffect } from 'react';
import { Search, Check, X, BookOpen } from "lucide-react";
import { getAllBookRequests, issueBook, rejectBookRequest } from '../service/bookRequestService';

type ToastType = { type: "success" | "error", message: string } | null;

type BorrowRequest = {
  request_id: number;
  student_name: string;
  book_title: string;
  request_date: string;
  status: string;
};

const BookApprovalPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<ToastType>(null);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(borrowRequests.length / itemsPerPage);

  useEffect(() => {
    fetchBookRequests();
  }, []);

  const fetchBookRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBookRequests();
      setBorrowRequests(data || []);
    } catch (error) {
      console.error('Error loading book requests:', error);
      showToastMessage("error", "Unable to load requests!");
      setBorrowRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setShowToast(true);
    const hideTimer = setTimeout(() => setShowToast(false), 2000);
    const clearTimer = setTimeout(() => setToast(null), 2500);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  };

  const handleApprove = async (id: number) => {
    try {
      await issueBook(id);
      await fetchBookRequests();
      showToastMessage("success", "Request approved!");
    } catch (error) {
      console.error('Error approving request:', error);
      showToastMessage("error", "Failed to approve request!");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectBookRequest(id);
      await fetchBookRequests();
      showToastMessage("success", "Request rejected!");
    } catch (error) {
      console.error('Error rejecting request:', error);
      showToastMessage("error", "Failed to reject request!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-[#033060] bg-blue-50 border-blue-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "Pending";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      default: return status || "Unknown";
    }
  };

  const filteredRequests = borrowRequests.filter(req => {
    const searchFields = [req.student_name, req.book_title, req.request_id?.toString()].join(" ").toLowerCase();
    const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => a.request_id - b.request_id);
  const paginatedRequests = sortedRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-8 mb-10">
        <div className="flex items-center mb-4">
          <BookOpen className="h-10 w-10 text-[#033060] mr-3" />
          <h1 className="text-4xl font-bold text-[#033060]">Book Borrow Approval</h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
            <input
              type="text"
              placeholder="Search by student, book, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-5 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow min-w-[200px]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-[#f5f8fc] text-[#033060] text-base font-bold">
              <tr>
                <th className="py-3 px-5 text-center">Request ID</th>
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-5">Book Title</th>
                <th className="py-3 px-5">Request Date</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">Loading...</td>
                </tr>
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map((request) => (
                  <tr key={request.request_id} className="border-t text-[#033060]">
                    <td className="text-center py-3 px-5 font-semibold">{request.request_id}</td>
                    <td className="py-3 px-5">{request.student_name}</td>
                    <td className="py-3 px-5">{request.book_title}</td>
                    <td className="py-3 px-5">{formatDate(request.request_date)}</td>
                    <td className="text-center py-3 px-5">
                      <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-5">
                      {request.status.toLowerCase() === 'pending' && (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleApprove(request.request_id)} className="text-green-600 hover:bg-green-100 px-3 py-1 rounded border">
                            <Check className="inline-block w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button onClick={() => handleReject(request.request_id)} className="text-red-600 hover:bg-red-100 px-3 py-1 rounded border">
                            <X className="inline-block w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">No requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="py-4 px-6 flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "text-gray-300" : "text-[#033060] hover:bg-blue-100"}`}
          >
            Previous
          </button>
          <span className="text-[#033060] font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? "text-gray-300" : "text-[#033060] hover:bg-blue-100"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-10 px-6 py-4 rounded-xl shadow-lg z-50 text-lg font-semibold flex items-center gap-3 ${toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"} ${showToast ? "opacity-100" : "opacity-0"}`}>
          {toast.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default BookApprovalPage;
