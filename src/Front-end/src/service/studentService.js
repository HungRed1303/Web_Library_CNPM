const API_BASE_URL = "http://localhost:3000/api";
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


export const updateStudent = async (studentId, studentData) => {
  const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  
  return response.json();
};