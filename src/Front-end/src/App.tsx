import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterForm from "./components/RegisterForm";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;



