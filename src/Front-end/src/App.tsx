// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import PublisherManagementPage from "./pages/PublisherManagementPage";
import HomePage from "./pages/HomePage.tsx";
import CategoryManagementPage from "./pages/CategoryManagementPage"; 
import BookManagementPage from "./pages/BookManagementPage";
import LibrarianManagementPage from "./pages/LibrarianManagementPage.tsx";
import StudentManagementPage from "./pages/StudentManagementPage";
import ViewBorrowingHistoryPage from "./pages/ViewBorrowingHistoryPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ----------------------- Public / Auth routes ----------------------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/librarians" element={<LibrarianManagementPage />} />
        <Route path="/students" element={<StudentManagementPage />} />
        <Route path="/borrowingHistory" element={<ViewBorrowingHistoryPage />} />
        {/* ----------------------- Protected (Header + Sidebar) ----------------------- */}
        <Route element={<MainLayout />}>
          <Route path="/admin/publishers" element={<PublisherManagementPage />} />
          <Route path="/admin/home" element={<HomePage />} />
          <Route path="/admin/category" element={<CategoryManagementPage />} />
          <Route path="/admin/book" element={<BookManagementPage />} />
          {/* Thêm các Route con ở đây */}
        </Route>
        {/* ----------------------- Catch-all ----------------------- */}
        <Route path="*" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
