export const getAdminById = async (id) => {
  const response = await fetch(`http://localhost:3000/api/admins/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // nếu cần token
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin profile");
  }

  const result = await response.json();
  return result.data;
};
