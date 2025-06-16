const API_BASE_URL = "http://localhost:3000/api";
import axios from 'axios';

/**
 * @typedef {Object} ReportData
 * @property {boolean} success
 * @property {Object} data
 */

class ReportService {
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
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Get borrowed books report
  async getBorrowedBooks() {
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'borrowed_books' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching borrowed books report:', error);
      throw error;
    }
  }

  // Get borrow dates report
  async getBorrowDates() {
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'borrow_date' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching borrow dates report:', error);
      throw error;
    }
  }

  // Get due dates report
  async getDueDates() {
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'due_date' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching due dates report:', error);
      throw error;
    }
  }

  // Get overdue books report
  async getOverdueBooks() {
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'overdue' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue books report:', error);
      throw error;
    }
  }

  // Get user statistics report
  async getUserStatistics() {
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'user_stats' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics report:', error);
      throw error;
    }
  }

  // Get total types of books
  async getTotalTypeOfBooks() {
    try {
      const response = await this.axiosInstance.get('/report/type-of-book');
      return response.data;
    } catch (error) {
      console.error('Error fetching total types of books:', error);
      throw error;
    }
  }

  // Get total issued books
  async getTotalIssuedBook() {
    try {
      const response = await this.axiosInstance.get('/report/issue-book');
      return response.data;
    } catch (error) {
      console.error('Error fetching total issued books:', error);
      throw error;
    }
  }

  // Get total students
  async getTotalStudent() {
    try {
      const response = await this.axiosInstance.get('/report/student');
      return response.data;
    } catch (error) {
      console.error('Error fetching total students:', error);
      throw error;
    }
  }

  // Get total books
  async getTotalBook() {
    try {
      const response = await this.axiosInstance.get('/report/book');
      return response.data;
    } catch (error) {
      console.error('Error fetching total books:', error);
      throw error;
    }
  }

  // Get number of books by genre
  async getNumberBookByGenre() {
    try {
      const response = await this.axiosInstance.get('/report/book-by-genre');
      return response.data;
    } catch (error) {
      console.error('Error fetching number of books by genre:', error);
      throw error;
    }
  }

  // Get top readers
  async getTopReader(topK) {
    try {
      const response = await this.axiosInstance.get('/report/top-reader', {
        params: { top_k: topK }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top readers:', error);
      throw error;
    }
  }

  // Get issue/return book statistics for a week
  async getIssueReturnBookWeek(startDate, endDate) {
    try {
      const response = await this.axiosInstance.get('/report/issue-return-book', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching issue/return book statistics:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
export default reportService; 