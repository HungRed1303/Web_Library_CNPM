// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/LoginPage";
import PublisherManagementPage from "./pages/PublisherManagementPage"; // ví dụ
import HomePage from "./pages/HomePage.tsx";
import CategoryManagementPage from "./pages/CategoryManagementPage"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* ----------------------- Public / Auth routes ----------------------- */}
        <Route path="/login" element={<LoginPage />} />

        {/* ----------------------- Protected (Header + Sidebar) ----------------------- */}
        <Route element={<MainLayout />}>
          <Route path="/admin/publishers" element={<PublisherManagementPage />} />
          <Route path="/admin/home" element={<HomePage />} />
          <Route path="/admin/category" element={<CategoryManagementPage />} />
          {/* Thêm các Route con ở đây */}
        </Route>

        {/* ----------------------- Catch-all ----------------------- */}
        <Route path="*" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
