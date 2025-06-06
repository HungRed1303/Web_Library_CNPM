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

    if (response.ok && result.token) {
      try {
        localStorage.setItem("token", result.token);
      } catch (storageError) {
        console.warn("Không thể lưu token vào localStorage:", storageError);
      }

      return { success: true, role: result.user.role };
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

