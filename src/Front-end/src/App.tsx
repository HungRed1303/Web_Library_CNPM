// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import PublisherManagementPage from "./pages/PublisherManagementPage";
import HomePage from "./pages/HomePage.tsx";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import BookManagementPage from "./pages/BookManagementPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ViewReportPage from "./pages/ViewReportPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password/forgot" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Route chỉ cho Admin */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["A"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/publishers" element={<PublisherManagementPage />} />
        </Route>

        {/* Routes cho Admin và Lecturer */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["A", "L"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/category" element={<CategoryManagementPage />} />
          <Route path="/books" element={<BookManagementPage />} />
          <Route path="/reports" element={<ViewReportPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>

  );
}

export default App;

