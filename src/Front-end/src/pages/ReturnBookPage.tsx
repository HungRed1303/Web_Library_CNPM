import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, User, BookOpen, AlertCircle, CheckCircle, Clock, DollarSign } from "lucide-react";
import {getAllBookIssue,handleReturnBook} from '../service/returnBookService'

type ToastType = { type: "success" | "error", message: string } | null;

interface BookIssue {
  issue_id: number;
  book_id: number;
  student_id: number;
  student_name?: string;
  book_title?: string;
  issue_date: string;
  due_date: string;
  return_date?: string | null;
  fine_amount: number | null;
  status: "issuing" | "returned" | "overdue";
  reminder_sent: boolean;
  reminder_sent_at: string | null;
  overdue_reminder_sent: boolean;
  overdue_reminder_sent_at: string | null;
}

// Mock data based on your API structure
const mockData: BookIssue[] = [
  {
    issue_id: 5,
    book_id: 1,
    student_id: 7,
    issue_date: "2025-05-24T17:00:00.000Z",
    due_date: "2025-06-07T17:00:00.000Z",
    return_date: null,
    fine_amount: null,
    status: "issuing",
    reminder_sent: false,
    reminder_sent_at: null,
    overdue_reminder_sent: false,
    overdue_reminder_sent_at: null,
    student_name: "Hung Khah",
    book_title: "Book A"
  },
  {
    issue_id: 6,
    book_id: 2,
    student_id: 8,
    issue_date: "2025-05-20T17:00:00.000Z",
    due_date: "2025-06-03T17:00:00.000Z",
    return_date: "2025-06-10T17:00:00.000Z",
    fine_amount: 35,
    status: "returned",
    reminder_sent: true,
    reminder_sent_at: "2025-06-01T17:00:00.000Z",
    overdue_reminder_sent: true,
    overdue_reminder_sent_at: "2025-06-05T17:00:00.000Z",
    student_name: "John Smith",
    book_title: "Advanced Mathematics"
  },
  {
    issue_id: 7,
    book_id: 3,
    student_id: 9,
    issue_date: "2025-05-15T17:00:00.000Z",
    due_date: "2025-05-28T17:00:00.000Z",
    return_date: null,
    fine_amount: null,
    status: "overdue",
    reminder_sent: true,
    reminder_sent_at: "2025-05-26T17:00:00.000Z",
    overdue_reminder_sent: true,
    overdue_reminder_sent_at: "2025-05-30T17:00:00.000Z",
    student_name: "Alice Johnson",
    book_title: "Physics Fundamentals"
  }
];

// API Service Functions

const BookReturnManagement = () => {
  const [books, setBooks] = useState<BookIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toast, setToast] = useState<ToastType>(null);
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Fetch data from database
  useEffect(() => {
    fetchBookIssues();
  }, []);

  const fetchBookIssues = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBookIssue();
      console.log("Raw data:", data);
      
      // Process data to determine status and calculate fines
      const processedData = data.map((item: BookIssue) => {
        const status = determineStatus(item);
        const fine_amount = calculateFineAmount(item);
        
        console.log(`Issue ${item.issue_id}: status=${status}, fine=${fine_amount}`);
        
        return {
          ...item,
          status,
          fine_amount
        };
      });
      
      console.log("Processed data:", processedData);
      setBooks(processedData || []);
    } catch (error) {
      console.error('Error loading book issues:', error);
      showToastMessage("error", "Unable to load book issues!");
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const determineStatus = (book: BookIssue): "issuing" | "returned" | "overdue" => {
    // If book has return_date, it's returned
    if (book.return_date) {
      return "returned";
    }
    
    // If no return_date, check if it's overdue
    const dueDate = new Date(book.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    dueDate.setHours(0, 0, 0, 0);
    
    if (today > dueDate) {
      return "overdue";
    }
    
    // Otherwise it's still issued
    return "issuing";
  };

  const calculateFineAmount = (book: BookIssue): number => {
    // If book is returned and has a fine amount, use it
    if (book.return_date && book.fine_amount !== null) {
      return book.fine_amount;
    }
    
    // If book is not returned, calculate current fine
    if (!book.return_date) {
      const finePerHour = 0.1;
      const today = new Date();
      const jsDueDate = new Date(book.due_date);
      
      if (today > jsDueDate) {
        const diffTime = today.getTime() - jsDueDate.getTime();
        const lateHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const fine = lateHours * finePerHour;
        return Math.round(fine * 100) / 100;
      }
    }
    
    return 0;
  };

  const showToastMessage = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    setTimeout(() => setToast(null), 2500);
  };

  // Fixed function to calculate days overdue
  const calculateDaysOverdue = (book: BookIssue): number => {
    // If book is returned, calculate overdue days at the time of return
    if (book.return_date) {
      const returnDate = new Date(book.return_date);
      const dueDate = new Date(book.due_date);
      returnDate.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffTime = returnDate.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    
    // If book is not returned, calculate current overdue days
    const today = new Date();
    const dueDate = new Date(book.due_date);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const updateBookStatus = async (issueId: number): Promise<void> => {
    try {
      // Call the API to return the book
      await handleReturnBook(issueId);
      
      // Update local state after successful API call
      setBooks((prevBooks) =>
        prevBooks.map((book) => {
          if (book.issue_id === issueId && book.status !== "returned") {
            const fine = calculateFineAmount(book);
            return {
              ...book,
              status: "returned" as const,
              return_date: new Date().toISOString(),
              fine_amount: fine,
            };
          }
          return book;
        })
      );
      
      showToastMessage("success", "Book returned successfully!");
      
      // Refresh data from server to get updated information
      await fetchBookIssues();
    } catch (error) {
      console.error('Error returning book:', error);
      showToastMessage("error", "Failed to return book!");
    }
  };

  const filteredBooks = useMemo(() => {
    console.log("Filtering books:", { 
      totalBooks: books.length, 
      searchTerm, 
      statusFilter,
      books: books.map(b => ({ id: b.issue_id, status: b.status, name: b.student_name, title: b.book_title }))
    });
    
    const filtered = books.filter((book) => {
      const studentName = book.student_name || '';
      const bookTitle = book.book_title || '';
      const issueId = book.issue_id.toString();
      
      // Search filter
      const matchesSearch =
        studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issueId.includes(searchTerm);

      // Status filter - fix the mapping
      let matchesStatus = true;
      if (statusFilter !== "all") {
        if (statusFilter === "issued") {
          matchesStatus = book.status === "issuing";
        } else {
          matchesStatus = book.status === statusFilter;
        }
      }

      const result = matchesSearch && matchesStatus;
      
      if (searchTerm || statusFilter !== "all") {
        console.log(`Book ${book.issue_id}: searchMatch=${matchesSearch}, statusMatch=${matchesStatus}, result=${result}`);
      }
      
      return result;
    }).sort((a, b) => a.issue_id - b.issue_id); // Sort by issue_id descending (newest first)
    
    console.log("Filtered result:", filtered.length, "books");
    return filtered;
  }, [books, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "issuing":
        return (
          <span className="px-3 py-1 rounded-lg border text-sm font-medium text-blue-600 bg-blue-50 border-blue-200 inline-flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Issued
          </span>
        );
      case "returned":
        return (
          <span className="px-3 py-1 rounded-lg border text-sm font-medium text-green-600 bg-green-50 border-green-200 inline-flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Returned
          </span>
        );
      case "overdue":
        return (
          <span className="px-3 py-1 rounded-lg border text-sm font-medium text-red-600 bg-red-50 border-red-200 inline-flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  const stats = {
    total: books.length,
    issued: books.filter((b) => b.status === "issuing").length,
    overdue: books.filter((b) => b.status === "overdue").length,
    returned: books.filter((b) => b.status === "returned").length,
    totalFines: books.reduce((sum, book) => sum + (book.fine_amount || 0), 0),
  };

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8fc] via-[#eaf3fb] to-[#e3ecf7] py-10 px-4 md:px-8 font-[Tahoma] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center mb-4">
          <BookOpen className="h-10 w-10 text-[#033060] mr-3" />
          <h1 className="text-4xl font-bold text-[#033060]">Book Return Management</h1>
        </div>
        <p className="text-gray-600 text-lg">Manage book returns, track due dates, and calculate fines</p>
      </div>

      {/* Stats Cards */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-[#033060] mb-2">{stats.total}</div>
          <div className="text-gray-600">Total Books</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.issued}</div>
          <div className="text-gray-600">Currently Issued</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.overdue}</div>
          <div className="text-gray-600">Overdue</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.returned}</div>
          <div className="text-gray-600">Returned</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-orange-600 mb-2">${stats.totalFines}</div>
          <div className="text-gray-600">Total Fines</div>
        </div>
      </div>

  
      {/* Search and Filter */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#033060] h-5 w-5" />
            <input
              type="text"
              placeholder="Search by student name, book title, or issue ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-xl border border-[#dbeafe] bg-white shadow w-full"
            />
          </div>
          <div className="flex gap-2">
            {["all", "issued", "overdue", "returned"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 text-lg rounded-xl border shadow transition-colors ${
                  statusFilter === status
                    ? "bg-[#033060] text-white border-[#033060]"
                    : "bg-white text-[#033060] border-[#dbeafe] hover:bg-blue-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-[#f5f8fc] text-[#033060] text-base font-bold">
              <tr>
                <th className="py-4 px-6 text-center">Issue ID</th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Book Title</th>
                <th className="py-4 px-6">Issue Date</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6 text-center">Days Overdue</th>
                <th className="py-4 px-6 text-center">Fine Amount</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#033060]"></div>
                      <div className="text-gray-600">Loading book issues...</div>
                    </div>
                  </td>
                </tr>
              ) : paginatedBooks.length > 0 ? (
                paginatedBooks.map((book) => {
                  const daysOverdue = calculateDaysOverdue(book);
                  const fineAmount = book.fine_amount || 0;
                  
                  return (
                    <tr key={book.issue_id} className="border-t text-[#033060]">
                      <td className="text-center py-4 px-6 font-semibold">{book.issue_id}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-semibold">{book.student_name || 'N/A'}</div>
                            <div className="text-sm text-gray-600">ID: {book.student_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-semibold">{book.book_title || 'N/A'}</div>
                            <div className="text-sm text-gray-600">Book ID: {book.book_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{formatDate(book.issue_date)}</td>
                      <td className="py-4 px-6">{formatDate(book.due_date)}</td>
                      <td className="text-center py-4 px-6">
                        {daysOverdue > 0 ? (
                          <span className={`font-semibold ${
                            book.status === "returned" ? "text-green-600" : "text-red-600"
                          }`}>
                            {daysOverdue} days
                          </span>
                        ) : (
                          <span className="text-green-600">0 days</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6">
                        {fineAmount > 0 ? (
                          <span className={`font-semibold flex items-center justify-center gap-1 ${
                            book.status === "returned" ? "text-green-600" : "text-red-600"
                          }`}>
                            <DollarSign className="w-4 h-4" />
                            {fineAmount}
                          </span>
                        ) : (
                          <span className="text-green-600 flex items-center justify-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            0
                          </span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6">
                        {getStatusBadge(book.status)}
                      </td>
                      <td className="text-center py-4 px-6">
                        <div className="flex justify-center gap-2">
                          {book.status !== "returned" && (
                            <button
                              onClick={() => updateBookStatus(book.issue_id)}
                              className="text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg border border-green-200 flex items-center gap-2 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark Returned
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-lg font-semibold mb-2">No books found</div>
                    <div>Try adjusting your search criteria or filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredBooks.length > 0 && (
          <div className="py-4 px-6 flex justify-between items-center border-t">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "text-gray-300" : "text-[#033060] hover:bg-blue-100"
              }`}
            >
              Previous
            </button>
            <span className="text-[#033060] font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages ? "text-gray-300" : "text-[#033060] hover:bg-blue-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-10 px-6 py-4 rounded-xl shadow-lg z-50 text-lg font-semibold flex items-center gap-3 transition-opacity ${
            toast.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          } ${showToast ? "opacity-100" : "opacity-0"}`}
        >
          {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default BookReturnManagement;