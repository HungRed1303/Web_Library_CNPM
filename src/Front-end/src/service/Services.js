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
