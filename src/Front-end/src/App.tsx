// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute        from "./components/ProtectedRoute";
import UnauthorizedPage      from "./pages/UnauthorizedPage";

import MainLayout            from "./components/MainLayout";
import UserLayout            from "./components/UserLayout";   // Đổi tên cho rõ ràng

import LoginPage             from "./pages/LoginPage";
import RegisterPage          from "./pages/RegisterPage";
import ForgotPasswordPage    from "./pages/ForgotPasswordPage";
import ResetPasswordPage     from "./pages/ResetPasswordPage";

import HomePageUser          from "./pages/HomePageUser";     // public home
import HomePage              from "./pages/HomePage";         // protected home (Admin/Lecturer)
import PublisherManagementPage  from "./pages/PublisherManagementPage";
import CategoryManagementPage   from "./pages/CategoryManagementPage";
import BookManagementPage       from "./pages/BookManagementPage";
import ViewReportPage           from "./pages/ViewReportPage";

function App() {
  return (
    <Router>
      <Routes>
        {/** =====================
            Các route công khai (public routes)
            Dùng UserLayout để bọc chung header/footer cho user chưa đăng nhập
        ====================== **/}
        <Route element={<UserLayout />}>
          {/* Nếu bạn muốn /home là trang công khai, giữ nguyên /home */}
          <Route path="/home" element={<HomePageUser />} />
        </Route>

        {/* Các route login/register/forgot/reset */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password/forgot" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/** =====================
            Các route yêu cầu đăng nhập (protected)
            Dùng MainLayout để bọc chung header/sidebar cho Admin/Lecturer
        ====================== **/}

        {/* Chỉ Admin (role = "A") */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["A"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/publishers" element={<PublisherManagementPage />} />
        </Route>

        {/* Admin và Lecturer (role = "A" hoặc "L") */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["A", "L"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Lưu ý: ta đổi đường dẫn `/home` cho protected user thành `/dashboard` để không trùng với public */}
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/categorys"  element={<CategoryManagementPage />} />
          <Route path="/books"      element={<BookManagementPage />} />
          <Route path="/reports"   element={<ViewReportPage />} />
        </Route>

        {/** =====================
            Catch-all: tất cả đường dẫn khác redirect về `/home`
        ====================== **/}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
