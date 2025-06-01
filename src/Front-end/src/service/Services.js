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