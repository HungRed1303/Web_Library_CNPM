const BASE = "http://localhost:3000/api";
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