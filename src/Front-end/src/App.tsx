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

import HomePageUser          from "./pages/HomePageUser";     // public home
import HomePage              from "./pages/HomePage";         // protected home (Admin/Lecturer)
import PublisherManagementPage  from "./pages/PublisherManagementPage";
import CategoryManagementPage   from "./pages/CategoryManagementPage";
import BookManagementPage       from "./pages/BookManagementPage";
import BooksPage               from "./pages/BooksPage";       // public books
import LibrarianManagementPage  from "./pages/LibrarianManagementPage";
import StudentManagementPage    from "./pages/StudentManagementPage";
import ViewBorrowingHistoryPage  from "./pages/ViewBorrowingHistoryPage";
import ApproveBookRequestPage from "./pages/ApproveBookRequestPage"; // Placeholder for approve book request page
import ApproveRequestLibraryCardPage from "./pages/ApproveRequestLibraryCardPage";

import StudentProfilePage from "./pages/StudentProfilePage"; // Placeholder for student profile page
import AdminProfilePage from "./pages/AdminProfilePage"; // Placeholder for admin profile page
import LibrarianProfilePage from "./pages/LibrarianProfilePage"; // Placeholder for librarian profile page

import BookDetailPage from "./pages/DetailBookPage";
import ReturnBookPage from "./pages/ReturnBookPage";
import ReportPage from "./pages/ReportPage"; // Placeholder for report page

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route element={<UserLayout />}>
          <Route path="/home" element={<HomePageUser />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/student/profile/:id" element={<StudentProfilePage />} />
          <Route path="/books/detail-book/:id" element={<BookDetailPage />} />

        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/students/borrowingHistory" element={<ViewBorrowingHistoryPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password/forgot" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/password/change" element={<ChangePasswordPage />} />

        {/* ---------- User Routes (Role = "S") ---------- */}
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
          <Route path="/profile/admins/:id" element={<AdminProfilePage />} />
        </Route>
          
        
        {/* ---------- Admin + Lecturer Routes (Role = "A" or "L") ---------- */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["A", "L"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile/librarians/:id" element={<LibrarianProfilePage />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/categories"  element={<CategoryManagementPage />} />
          <Route path="/managebooks" element={<BookManagementPage />} />

          <Route path="/report"   element={<ReportPage />} />
          <Route path="/students" element={<StudentManagementPage />} />
          <Route path="/publishers" element={<PublisherManagementPage />} />
          <Route path="/approve-book-request" element={<ApproveBookRequestPage/>} />
          <Route path="/approve-request-library-card" element={<ApproveRequestLibraryCardPage/>} />

          <Route path="/return-book" element = {<ReturnBookPage/>}/>
        </Route>
        
        {/* ---------- Catch-All Route ---------- */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
