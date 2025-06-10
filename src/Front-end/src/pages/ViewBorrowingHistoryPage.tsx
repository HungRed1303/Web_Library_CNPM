import React, { useState, useEffect } from "react";
import { Book, Calendar, DollarSign, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import borrowingHistoryService from "../service/Services";
import { useNavigate } from "react-router-dom";

export default function BorrowingHistoryPage() {
  const [borrowingHistory, setBorrowingHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    returned: 0,
    overdue: 0,
    totalFines: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [studentId, setStudentId] = useState<any>(null);
  const navigate = useNavigate();

  // Mock getting student ID from URL params or props
  useEffect(() => {
    // In real app, this would come from URL params or props
    const urlParams = new URLSearchParams(window.location.search);
    setStudentId(urlParams.get('studentId'));
  }, []);

  // Fetch borrowing history on component mount
  useEffect(() => {
    if (studentId) {
      fetchBorrowingHistory();
    } else {
      setError("Missing studentId in URL");
      setLoading(false);
    }
  }, [studentId]);

  const fetchBorrowingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      let records = [];
      if (studentId) {
        records = await borrowingHistoryService.getBorrowingHistoryByStudentId(Number(studentId));
      }
      setBorrowingHistory(records);
      setStats(calculateStats(records));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch borrowing history');
      console.error('Error fetching borrowing history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Map dữ liệu từ backend sang các trường hiển thị rõ ràng
  const mappedHistory = borrowingHistory.map(record => ({
    book_title: record.title,
    author: record.author,
    isbn: record.isbn,
    borrowed_date: record.issue_date,
    due_date: record.due_date,
    returned_date: record.return_date,
    status: record.status,
    fine_amount: record.fine_amount,
    id: record.issue_id || record.id // fallback nếu có id khác
  }));

  // Lấy tên sinh viên từ dữ liệu nếu có
  const studentName = borrowingHistory.length > 0 ? (borrowingHistory[0].name || borrowingHistory[0]["username"] || borrowingHistory[0].email || null) : null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-[#033060] animate-spin mx-auto mb-4" />
          <p className="text-lg text-[#033060]">Loading borrowing history...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#033060] mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {error !== "Missing studentId in URL" && (
            <button
              onClick={fetchBorrowingHistory}
              className="bg-[#033060] text-white px-6 py-2 rounded-lg hover:bg-[#024050] transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#eaf3fb] to-[#dbeafe] rounded-2xl shadow-lg p-10 mb-10 border border-[#dbeafe] flex flex-col items-center" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="flex items-center mb-1">
          <Book className="h-12 w-12 text-[#033060] mr-3" />
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow text-center" style={{letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3'}}>
            Student Borrowing History
          </h1>
        </div>
        <p className="text-gray-600 text-lg text-center">
          {studentName
            ? `Borrowing history for ${studentName}`
            : (studentId ? `Borrowing history for student ID ${studentId}` : "Track your borrowed books, due dates, and fines")}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[#033060] font-semibold text-sm md:text-base">Total Borrowed</h3>
            <Book className="h-5 w-5 text-[#033060]" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-[#033060]">{stats.totalBorrowed}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[#033060] font-semibold text-sm md:text-base">Currently Borrowed</h3>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-blue-600">{stats.currentlyBorrowed}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[#033060] font-semibold text-sm md:text-base">Overdue Books</h3>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-2 md:p-3" style={{boxShadow: '0 2px 12px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[#033060] font-semibold text-sm md:text-base">Total Fines</h3>
            <DollarSign className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-red-600">${stats.totalFines.toFixed(2)}</div>
        </div>
      </div>

      {/* Borrowing History Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="p-6 border-b border-[#dbeafe]">
          <h2 className="text-2xl font-bold text-[#033060]">Borrowing History Details</h2>
          <p className="text-gray-600">
            {/* {filteredHistory.length} {filteredHistory.length === 1 ? 'record' : 'records'} found */}
          </p>
        </div>
        
        {mappedHistory.length === 0 ? (
          <div className="p-12 text-center">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Records Found</h3>
            <p className="text-gray-400">
              No borrowing history available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-20">Issue ID</th>
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-64">Book Title</th>
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base w-40">Author</th>
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-32">Borrowed Date</th>
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-32">Due Date</th>
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-32">Returned Date</th>
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-28">Status</th>
                  <th className="py-3 px-5 text-center text-[#033060] font-bold text-base w-24">Fine</th>
                </tr>
              </thead>
              <tbody>
                {mappedHistory.map((record) => (
                  <tr key={record.id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                    <td className="py-3 px-5 text-center w-20">{record.id || '-'}</td>
                    <td className="py-3 px-5 text-left break-words whitespace-normal max-w-xs w-64">{record.book_title || '-'}</td>
                    <td className="py-3 px-5 text-left break-words whitespace-normal max-w-xs w-40">{record.author || '-'}</td>
                    <td className="py-3 px-5 text-center text-[#033060] text-base w-32">{record.borrowed_date ? borrowingHistoryService.formatDate(record.borrowed_date) : '-'}</td>
                    <td className="py-3 px-5 text-center text-[#033060] text-base w-32">{record.due_date ? borrowingHistoryService.formatDate(record.due_date) : '-'}</td>
                    <td className="py-3 px-5 text-center text-[#033060] text-base w-32">{record.returned_date ? borrowingHistoryService.formatDate(record.returned_date) : '-'}</td>
                    <td className="py-3 px-5 text-center w-28">{borrowingHistoryService.getStatusDisplayText(record.status)}</td>
                    <td className="py-3 px-5 text-center font-medium w-24">
                      <span className={Number(record.fine_amount) === 0 ? "text-green-600" : "text-red-600"}>
                        ${Number(record.fine_amount || 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return button ở góc dưới bên trái */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 bg-[#f5f8fc] text-[#033060] border border-[#dbeafe] px-2 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-[#eaf3fb] transition-colors font-semibold text-sm md:text-base"
          style={{minWidth: '36px', minHeight: '36px'}}
          aria-label="Return to student management"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden md:inline">Return</span>
        </button>
      </div>
    </div> 
  );
}

// Hàm calculateStats đã được cập nhật để sử dụng fine_amount từ database
function calculateStats(records: any[]) {
  const stats = {
    totalBorrowed: records.length,
    currentlyBorrowed: 0,
    returned: 0,
    overdue: 0,
    totalFines: 0,
  };
  
  records.forEach(record => {
    if (record.status === 'borrowed' || record.status === 'pending') {
      stats.currentlyBorrowed++;
    }
    if (record.status === 'returned' || record.status === 'completed') {
      stats.returned++;
    }
    if (record.status === 'overdue') {
      stats.overdue++;
    }
    // Sử dụng fine_amount trực tiếp từ database
    stats.totalFines += Number(record.fine_amount) || 0;
  });
  
  return stats;
}

// Sửa getStatusDisplayText để trả về tiếng Anh đúng chuẩn SQL
borrowingHistoryService.getStatusDisplayText = function(status: string) {
  switch (status) {
    case 'returned':
    case 'completed':
      return 'Returned';
    case 'borrowed':
      return 'Borrowed';
    case 'pending':
      return 'Pending';
    case 'overdue':
      return 'Overdue';
    default:
      return status;
  }
};

// Sửa hàm formatDate để trả về dd/mm/yyyy
borrowingHistoryService.formatDate = function(dateString: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};