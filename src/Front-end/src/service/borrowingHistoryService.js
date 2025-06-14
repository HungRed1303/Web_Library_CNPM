const API_BASE_URL = "http://localhost:3000/api";
/* ---------------- 7. BORROWING HISTORY ---------------- */
// services/borrowingHistoryService.ts
import axios from 'axios';

/**
 * @typedef {Object} BorrowingRecord
 * @property {number} id
 * @property {number} student_id
 * @property {number} book_id
 * @property {string} book_title
 * @property {string} author
 * @property {string} isbn
 * @property {string} borrowed_date
 * @property {string} due_date
 * @property {string=} returned_date
 * @property {'borrowed'|'returned'|'overdue'} status
 * @property {number} fine_amount
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} BorrowingHistoryResponse
 * @property {boolean} success
 * @property {BorrowingRecord[]} data
 * @property {string=} message
 */

/**
 * @typedef {Object} BorrowingStats
 * @property {number} totalBorrowed
 * @property {number} currentlyBorrowed
 * @property {number} returned
 * @property {number} overdue
 * @property {number} totalFines
 */

class BorrowingHistoryService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Get borrowing history by student ID
  async getBorrowingHistoryByStudentId(studentId) {
    try {
      const response = await this.axiosInstance.get(`/borrowinghistory/${studentId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch borrowing history');
      }
    } catch (error) {
      console.error('Error fetching borrowing history:', error);
      throw error;
    }
  }

  // Get current user's borrowing history
  async getCurrentUserBorrowingHistory() {
    try {
      const response = await this.axiosInstance.get('/borrowing-history');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch borrowing history');
      }
    } catch (error) {
      console.error('Error fetching current user borrowing history:', error);
      throw error;
    }
  }

  // Calculate borrowing statistics
  calculateStats(records) {
    const stats = {
      totalBorrowed: records.length,
      currentlyBorrowed: 0,
      returned: 0,
      overdue: 0,
      totalFines: 0,
    };
    records.forEach(record => {
      switch (record.status) {
        case 'borrowed':
          stats.currentlyBorrowed++;
          break;
        case 'returned':
          stats.returned++;
          break;
        case 'overdue':
          stats.overdue++;
          break;
      }
      stats.totalFines += record.fine_amount;
    });
    return stats;
  }

  // Format date for display
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get status color class
  getStatusColorClass(status) {
    switch (status) {
      case 'returned':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'borrowed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  // Get status display text
  getStatusDisplayText(status) {
    switch (status) {
      case 'returned':
        return 'Returned';
      case 'borrowed':
        return 'Currently Borrowed';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  }
}

export const borrowingHistoryService = new BorrowingHistoryService();
export default borrowingHistoryService;
