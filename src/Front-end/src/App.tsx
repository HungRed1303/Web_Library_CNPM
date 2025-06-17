// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import UserLayout from "./components/UserLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ChangePasswordPage from "./pages/ChangePasswordPage"; // Public

import HomePageUser from "./pages/HomePageUser"; // Public
import HomePage from "./pages/HomePage"; // Protected

import PublisherManagementPage from "./pages/PublisherManagementPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import BookManagementPage from "./pages/BookManagementPage";
import ViewReportPage from "./pages/ViewReportPage";
import LibrarianManagementPage from "./pages/LibrarianManagementPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import ViewBorrowingHistoryPage from "./pages/ViewBorrowingHistoryPage";
import BooksPage from "./pages/BooksPage"; // Thêm trang BookPage nếu cần
import WishListPage from "./pages/WishListPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<HomePageUser />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password/forgot" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/password/change" element={<ChangePasswordPage />} />

        {/* ---------- Protected Routes ---------- */}
        {/* ---------- Admin Only Routes (Role = "A") ---------- */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["A"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/librarians" element={<LibrarianManagementPage />} />
        </Route>

        {/* ---------- Admin + Lecturer Routes (Role = "A" or "L") ---------- */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["A", "L"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/category" element={<CategoryManagementPage />} />
          <Route path="/book" element={<BookManagementPage />} />
          <Route path="/reports" element={<ViewReportPage />} />
          <Route path="/publishers" element={<PublisherManagementPage />} />
          <Route path="/students" element={<StudentManagementPage />} />
          <Route path="/students/borrowingHistory" element={<ViewBorrowingHistoryPage />} />
        </Route>

        {/* ---------- Catch-All Route ---------- */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
