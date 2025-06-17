const BASE = "http://localhost:3000/api";
/* ---------------- 4. BOOKS ---------------- */
/**
 * @returns {Promise<{ data: object[] }>}
 */
export const getAllBooks = async () => {
  const token = localStorage.getItem("token"); // nếu có token
  const res = await fetch(`${BASE}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/books/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("DELETE /books/:id failed");
};