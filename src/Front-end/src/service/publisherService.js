/* ---------------- 2. PUBLISHERS ---------------- */
const BASE = "http://localhost:3000/api";
/**
 * @returns {Promise<{data: object[]}>}
 */
export const getAllPublishers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/publishers`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("GET /publishers failed");
  return res.json();          // { data: [...] }
};

/**
 * @param {{name:string,address:string,email:string,phone_number:string}} body
 */
export const createPublisher = async (body) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/publishers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("POST /publishers failed");
  return res.json();
};

export const updatePublisherById = async (id, body) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/publishers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("PUT /publishers/:id failed");
  return res.json();
};

export const deletePublisherById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/publishers/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
  if (!res.ok) throw new Error("DELETE /publishers/:id failed");
};