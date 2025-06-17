export const loginUser = async (email, password) => {
  if (!email || !password) {
    return { success: false, error: "Email và mật khẩu là bắt buộc." };
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok && result.token && result.user) {
      try {
        localStorage.setItem("token", result.token);
      } catch (storageError) {
        console.warn("Không thể lưu token vào localStorage:", storageError);
      }

      return { success: true, user: result.user };
    } else {
      return {
        success: false,
        error: result.error || "Email hoặc mật khẩu không đúng.",
      };
    }
  } catch (err) {
    return { success: false, error: "Lỗi mạng hoặc máy chủ không phản hồi." };
  }
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "Cần nhập mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "Mật khẩu mới và xác nhận mật khẩu không khớp." };
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false, error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/password/change", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true, message: "Mật khẩu đã được thay đổi thành công." };
    } else {
      return {
        success: false,
        error: result.error || "Không thể thay đổi mật khẩu.",
      };
    }
  } catch (err) {
    return { success: false, error: "Lỗi mạng hoặc máy chủ không phản hồi." };
  }
};
/* ---------------- 2. PUBLISHERS ---------------- */
const BASE = "http://localhost:3000/api";
/**
 * @returns {Promise<{data: object[]}>}
 */
export const getAllPublishers = async () => {
  const res = await fetch(`${BASE}/publishers`);
  if (!res.ok) throw new Error("GET /publishers failed");
  return res.json();          // { data: [...] }
};

/**
 * @param {{name:string,address:string,email:string,phone_number:string}} body
 */
export const createPublisher = async (body) => {
  const res = await fetch(`${BASE}/publishers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("POST /publishers failed");
  return res.json();
};

export const updatePublisherById = async (id, body) => {
  const res = await fetch(`${BASE}/publishers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("PUT /publishers/:id failed");
  return res.json();
};

export const deletePublisherById = async (id) => {
  const res = await fetch(`${BASE}/publishers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("DELETE /publishers/:id failed");
};

/* ---------------- 3. CATEGORIES ---------------- */
/**
 * @returns {Promise<{ data: object[] }>}
 */
export const getAllCategories = async () => {
  const res = await fetch(`${BASE}/categories`);
  if (!res.ok) throw new Error("GET /categories failed");
  return res.json(); // { data: [...] }
};

/**
 * @param {{ name: string; description: string }} body
 */
export const createCategory = async (body) => {
  const res = await fetch(`${BASE}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("POST /categories failed");
  return res.json();
};

/**
 * @param {number} id
 * @param {{ name: string; description: string }} body
 */
export const updateCategoryById = async (id, body) => {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("PUT /categories/:id failed");
  return res.json();
};

/**
 * @param {number} id
 */
export const deleteCategoryById = async (id) => {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("DELETE /categories/:id failed");
};

/* ---------------- 4. BOOKS ---------------- */
/**
 * @returns {Promise<{ data: object[] }>}
 */
export const getAllBooks = async () => {
  const res = await fetch(`${BASE}/books`);
  if (!res.ok) throw new Error("GET /books failed");
  return res.json(); // { data: [...] }
};

/**
 * @param {FormData} formData - chứa các trường sách và ảnh
 */
export const createBook = async (formData) => {
  const token = localStorage.getItem("token"); // nếu có token
  const res = await fetch(`${BASE}/books`, {
    method: "POST",
    // Không set Content-Type, fetch tự set boundary multipart/form-data
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      // "Content-Type": "multipart/form-data"  <-- **Không set dòng này!**
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "POST /books failed");
  }
  return res.json();
};

/**
 * @param {number} id
 * @param {FormData} formData - chứa các trường sách và ảnh
 */
export const updateBookById = async (id, formData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/books/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      // Không set Content-Type khi gửi FormData
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "PUT /books/:id failed");
  }
  return res.json();
};

/**
 * @param {number} id
 */
export const deleteBookById = async (id) => {
  const res = await fetch(`${BASE}/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("DELETE /books/:id failed");
};

export const registerUser = async (username, email, password, name) => {
  if (!username || !email || !password || !name) {  
    return { success: false, error: "Vui lòng nhập đầy đủ thông tin." };
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, name }),
    });

    const result = await response.json();

    if (response.ok && result.user) {
      return { success: true, user: result.user };
    } else {
      return {
        success: false,
        error: result.error || "Đăng ký thất bại.",
      };
    }
  } catch (err) {
    return { success: false, error: "Lỗi mạng hoặc máy chủ không phản hồi." };
  }
};

export const forgotPassword = async (email) => {
  if (!email) {
    return { success: false, error: "Email là bắt buộc." };
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/password/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn." };
    } else {
      return {
        success: false,
        error: result.error || "Không thể gửi yêu cầu đặt lại mật khẩu.",
      };
    }
  } catch (err) {
    return { success: false, error: "Lỗi mạng hoặc máy chủ không phản hồi." };
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await fetch(`http://localhost:3000/api/auth/password/reset/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
        confirmPassword,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: "Lỗi gửi yêu cầu" };
  }
};

/* ---------------- 5. LIBRARIANS ---------------- */
// Use a direct URL for the API base in the absence of proper environment variable configuration for the browser
const API_BASE_URL = "http://localhost:3000/api";

export const getAllLibrarians = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/librarians`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `GET /librarians failed with status ${res.status}`);
  }
  const response = await res.json();
  return response.data;
};

export const getLibrarianById = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/librarians/${id}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `GET /librarians/${id} failed with status ${res.status}`);
  }
  const response = await res.json();
  return response.data;
};

export const createLibrarian = async (body) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/librarians`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `POST /librarians failed with status ${res.status}`);
  }
  const response = await res.json();
  return response.data;
};

export const updateLibrarianById = async (id, body) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/librarians/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `PUT /librarians/${id} failed with status ${res.status}`);
  }
  const response = await res.json();
  return response.data;
};

export const deleteLibrarianById = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/librarians/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `DELETE /librarians/${id} failed with status ${res.status}`);
  }
  const response = await res.json();
  return response.data;
};

/* ---------------- 6. STUDENTS ---------------- */
/**
 * Fetches all students from the backend.
 * @returns {Promise<Array<{
 *   student_id: number;
 *   username: string;
 *   email: string;
 *   name: string;
 *   class_id: number | null;
 * }>>} Array of student objects
 */
export const getAllStudents = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token missing. Please login.');
  }
  const res = await fetch(`${API_BASE_URL}/students`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const responseBody = await res.json();
  if (!res.ok) {
    throw new Error(responseBody.message || `GET /students failed with status ${res.status}`);
  }
  if (responseBody && responseBody.success && Array.isArray(responseBody.data)) {
    return responseBody.data;
  } else {
    console.error('Unexpected data format from backend for /students:', responseBody);
    throw new Error(responseBody.message || 'Unexpected response format from server.');
  }
};

/**
 * Fetches a student by ID.
 * @param {number} id - The student ID
 * @returns {Promise<{
 *   student_id: number;
 *   username: string;
 *   email: string;
 *   name: string;
 *   class_id: number | null;
 * }>}
 */
export const getStudentById = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token missing. Please login.');
  }
  const res = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const responseBody = await res.json();
  if (!res.ok) {
    throw new Error(responseBody.message || `GET /students/${id} failed with status ${res.status}`);
  }
  if (responseBody && responseBody.success && responseBody.data && typeof responseBody.data === 'object') {
    return responseBody.data;
  } else {
    console.error('Unexpected data format from backend for /students/:id:', responseBody);
    throw new Error(responseBody.message || 'Unexpected response format from server.');
  }
};

/**
 * Creates a new student.
 * @param {{ username: string; name: string; email: string; class_id: string; }} body - The student data to create
 * @returns {Promise<{
 *   student_id: number;
 *   username: string;
 *   email: string;
 *   name: string;
 *   class_id: number | null;
 * }>}
 */
export const createStudent = async (body) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token missing. Please login.');
  }
  const res = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const responseBody = await res.json();
  if (!res.ok) {
    throw new Error(responseBody.message || `POST /students failed with status ${res.status}`);
  }
  if (responseBody && responseBody.success && responseBody.data && typeof responseBody.data === 'object') {
    return responseBody.data;
  } else {
    console.error('Unexpected data format from backend for POST /students:', responseBody);
    throw new Error(responseBody.message || 'Unexpected response format from server.');
  }
};

/**
 * Updates a student by ID.
 * @param {number} id - The student ID
 * @param {{ username: string; name: string; email: string; class_id: string; }} body - The student data to update
 * @returns {Promise<{
 *   student_id: number;
 *   username: string;
 *   email: string;
 *   name: string;
 *   class_id: number | null;
 * }>}
 */
export const updateStudentById = async (id, body) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token missing. Please login.');
  }
  const res = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const responseBody = await res.json();
  if (!res.ok) {
    throw new Error(responseBody.message || `PUT /students/${id} failed with status ${res.status}`);
  }
  if (responseBody && responseBody.success && responseBody.data && typeof responseBody.data === 'object') {
    return responseBody.data;
  } else {
    console.error('Unexpected data format from backend for PUT /students/:id:', responseBody);
    throw new Error(responseBody.message || 'Unexpected response format from server.');
  }
};

/**
 * Deletes a student by ID.
 * @param {number} id - The student ID
 * @returns {Promise<{
 *   student_id?: number; // Assuming backend might return the deleted ID or a success object
 *   success?: boolean;
 * }>}
 */
export const deleteStudentById = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token missing. Please login.');
  }
  const res = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const responseBody = await res.json();
  if (!res.ok) {
    throw new Error(responseBody.message || `DELETE /students/${id} failed with status ${res.status}`);
  }
  // Assuming backend returns { success: true, data: ... } or similar on successful delete
  // If backend returns data on successful delete, return responseBody.data
  return responseBody.data; // Or return responseBody if backend doesn't wrap in data
};

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

/**
 * Thêm sách vào wishlist kèm note
 * @param {{ student_id: number, book_id: number, note: string }} data
 */
export const addBookToWishlist = async (data) => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/api/wishlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'POST /wishlist failed');
  }
  return res.json();
};

/**
 * Lấy danh sách sách trong wishlist của một student_id
 * @param {number} student_id
 * @returns {Promise<{ data: object[] }>}
 */
export const getWishListByStudentId = async (student_id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:3000/api/wishlist?student_id=${student_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'GET /wishlist failed');
  }
  return res.json();
};

/**
 * Xóa sách khỏi wishlist
 * @param {number} student_id
 * @param {number} book_id
 * @returns {Promise<any>}
 */
export const deleteBookFromWishlist = async (student_id, book_id) => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/api/wishlist', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ student_id, book_id })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'DELETE /wishlist failed');
  }
  return res.json();
};
