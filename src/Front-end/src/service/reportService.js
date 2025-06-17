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
        'Content-Type': 'application/json'
      },
    });
  }

  // Get borrowed books report
  async getBorrowedBooks() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'borrowed_books' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching borrowed books report:', error);
      throw error;
    }
  }

  // Get borrow dates report
  async getBorrowDates() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'borrow_date' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching borrow dates report:', error);
      throw error;
    }
  }

  // Get due dates report
  async getDueDates() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'due_date' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching due dates report:', error);
      throw error;
    }
  }

  // Get overdue books report
  async getOverdueBooks() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'overdue' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue books report:', error);
      throw error;
    }
  }

  // Get user statistics report
  async getUserStatistics() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report', {
        params: { type: 'user_stats' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics report:', error);
      throw error;
    }
  }

  // Get total types of books
  async getTotalTypeOfBooks() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report/type-of-book', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching total types of books:', error);
      throw error;
    }
  }

  // Get total issued books
  async getTotalIssuedBook() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report/issue-book', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching total issued books:', error);
      throw error;
    }
  }

  // Get total students
  async getTotalStudent() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report/student', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching total students:', error);
      throw error;
    }
  }

  // Get total books
  async getTotalBook() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report/book', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching total books:', error);
      throw error;
    }
  }

  // Get number of books by genre
  async getNumberBookByGenre() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report/book-by-genre', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching number of books by genre:', error);
      throw error;
    }
  }

  // Get top readers
  async getTopReader(topK) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report/top-reader', {
        params: { top_k: topK },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top readers:', error);
      throw error;
    }
  }

  // Get issue/return book statistics for a week
  async getIssueReturnBookWeek(startDate, endDate) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    try {
      const response = await this.axiosInstance.get('/report/issue-return-book', {
        params: {
          start_date: startDate,
          end_date: endDate
        },
        headers: {
          Authorization: `Bearer ${token}`
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