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



