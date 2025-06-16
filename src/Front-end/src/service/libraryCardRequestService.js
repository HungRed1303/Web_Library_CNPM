const API_BASE_URL = "http://localhost:3000/api";
import axios from 'axios';

/**
 * @typedef {Object} LibraryCardRequest
 * @property {number} card_id
 * @property {number} student_id
 * @property {string} start_date
 * @property {string} end_date
 * @property {'pending'|'accepted'} status
 */

/**
 * @typedef {Object} LibraryCardRequestResponse
 * @property {boolean} success
 * @property {LibraryCardRequest} data
 * @property {string=} message
 */

class LibraryCardRequestService {
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

  // Request a new library card
  async requestLibraryCard(studentId) {
    try {
      const response = await this.axiosInstance.post(`/librarycard/request/${studentId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to request library card');
      }
    } catch (error) {
      console.error('Error requesting library card:', error);
      throw error;
    }
  }

  // Get library card status by student ID
  async getLibraryCardStatus(studentId) {
    try {
      const response = await this.axiosInstance.get(`/librarycard/${studentId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch library card status');
      }
    } catch (error) {
      console.error('Error fetching library card status:', error);
      throw error;
    }
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
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  // Get status display text
  getStatusDisplayText(status) {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending Review';
      default:
        return status;
    }
  }
}

export const libraryCardRequestService = new LibraryCardRequestService();
export default libraryCardRequestService; 