import React, { useState, useEffect } from "react";
import { Book, Calendar, DollarSign, Search, AlertCircle, RefreshCw } from "lucide-react";
import { borrowingHistoryService } from "../service/Services";

// Define proper TypeScript interfaces
interface BorrowingRecord {
  id: number;
  book_title: string;
  author: string;
  isbn: string;
  borrowed_date: string;
  due_date: string;
  returned_date: string | null;
  status: 'borrowed' | 'returned' | 'overdue';
  fine_amount: number;
}

interface Stats {
  totalBorrowed: number;
  currentlyBorrowed: number;
  returned: number;
  overdue: number;
  totalFines: number;
}

export default function BorrowingHistoryPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingRecord[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    returned: 0,
    overdue: 0,
    totalFines: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Get student ID from URL path (to match backend route /:id)
  useEffect(() => {
    // Method 1: From URL path (recommended to match backend)
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (id && id !== 'borrowing-history' && !isNaN(Number(id))) {
      setStudentId(id);
    } else {
      // Method 2: Fallback to query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const queryId = urlParams.get('studentId');
      if (queryId) {
        setStudentId(queryId);
      } else {
        setError("Missing student ID in URL. Please provide studentId as path parameter or query parameter.");
        setLoading(false);
      }
    }
  }, []);

  // Fetch borrowing history on component mount
  useEffect(() => {
    if (studentId) {
      fetchBorrowingHistory();
    }
  }, [studentId]);

  const fetchBorrowingHistory = async (): Promise<void> => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);
      
      const records = await borrowingHistoryService.getBorrowingHistoryByStudentId(Number(studentId));
      
      // Validate and sanitize data
      const sanitizedRecords = (records || []).map(record => ({
        ...record,
        book_title: record.book_title || 'Unknown Title',
        author: record.author || 'Unknown Author',
        isbn: record.isbn || 'N/A',
        fine_amount: Number(record.fine_amount) || 0,
      }));
      
      setBorrowingHistory(sanitizedRecords);
      setStats(borrowingHistoryService.calculateStats(sanitizedRecords));
    } catch (err) {
      console.error('Error fetching borrowing history:', err);
      
      // Better error handling
      if (err instanceof Error) {
        if (err.message.includes('404')) {
          setError(`No borrowing history found for student ID: ${studentId}`);
        } else if (err.message.includes('Network Error')) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to fetch borrowing history. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Safe filter with null checks
  const filteredHistory = borrowingHistory.filter((record) => {
    const searchLower = searchTerm.toLowerCase();
    const bookTitle = (record.book_title || '').toLowerCase();
    const author = (record.author || '').toLowerCase();
    const isbn = (record.isbn || '').toLowerCase();
    
    return bookTitle.includes(searchLower) ||
           author.includes(searchLower) ||
           isbn.includes(searchLower);
  });

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
          {!error.includes("Missing student ID") && (
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
          <h1 className="text-5xl font-extrabold text-[#033060] drop-shadow" style={{letterSpacing: '1px', textShadow: '0 2px 8px #b6c6e3'}}>
            {studentId ? "Student Borrowing History" : "Your Borrowing History"}
          </h1>
        </div>
        <p className="text-gray-600 text-lg text-center">
          {studentId 
            ? `Complete borrowing history for Student ID: ${studentId}`
            : "Track your borrowed books, due dates, and fines"}
        </p>
        <button
          onClick={fetchBorrowingHistory}
          className="mt-4 bg-[#033060] text-white px-4 py-2 rounded-lg hover:bg-[#024050] transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-7xl mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
          <input
            type="text"
            placeholder="Search by book title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow focus:border-[#033060] focus:ring-2 focus:ring-blue-100 w-full outline-none transition-all duration-150"
            style={{boxShadow: '0 1px 4px 0 #e0e7ef'}}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-4" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#033060] font-semibold text-base">Total Borrowed</h3>
            <Book className="h-6 w-6 text-[#033060]" />
          </div>
          <div className="text-2xl font-bold text-[#033060]">{stats.totalBorrowed}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-4" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#033060] font-semibold text-base">Currently Borrowed</h3>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.currentlyBorrowed}</div>
          <p className="text-xs text-gray-500 mt-1">Returned: {stats.returned}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-4" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#033060] font-semibold text-base">Overdue Books</h3>
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#dbeafe] p-4" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#033060] font-semibold text-base">Total Fines</h3>
            <DollarSign className="h-6 w-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">${stats.totalFines.toFixed(2)}</div>
        </div>
      </div>

      {/* Borrowing History Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border border-[#dbeafe] overflow-hidden" style={{boxShadow: '0 4px 32px 0 rgba(3,48,96,0.08)'}}>
        <div className="p-6 border-b border-[#dbeafe]">
          <h2 className="text-2xl font-bold text-[#033060]">Borrowing History Details</h2>
          <p className="text-gray-600">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'record' : 'records'} found
          </p>
        </div>
        
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No Records Found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'No books match your search criteria.' : 'No borrowing history available.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f8fc] border-b border-[#dbeafe]">
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Book Details</th>
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Borrowed Date</th>
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Due Date</th>
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Returned Date</th>
                  <th className="py-3 px-5 text-left text-[#033060] font-bold text-base">Status</th>
                  <th className="py-3 px-5 text-right text-[#033060] font-bold text-base">Fine</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((record) => (
                  <tr key={record.id} className="border-b border-[#dbeafe] hover:bg-[#f1f5fa] transition">
                    <td className="py-3 px-5">
                      <div>
                        <div className="font-semibold text-[#033060] text-base">{record.book_title}</div>
                        <div className="text-sm text-gray-600">by {record.author}</div>
                        <div className="text-xs text-gray-500">ISBN: {record.isbn}</div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-[#033060] text-base">
                      {borrowingHistoryService.formatDate(record.borrowed_date)}
                    </td>
                    <td className="py-3 px-5 text-[#033060] text-base">
                      {borrowingHistoryService.formatDate(record.due_date)}
                    </td>
                    <td className="py-3 px-5 text-[#033060] text-base">
                      {record.returned_date 
                        ? borrowingHistoryService.formatDate(record.returned_date)
                        : '-'
                      }
                    </td>
                    <td className="py-3 px-5">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${
                        borrowingHistoryService.getStatusColorClass(record.status)
                      }`}>
                        {borrowingHistoryService.getStatusDisplayText(record.status)}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right font-medium">
                      <span className={record.fine_amount === 0 ? "text-green-600" : "text-red-600"}>
                        ${record.fine_amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}