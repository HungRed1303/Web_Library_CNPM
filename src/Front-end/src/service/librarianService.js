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
