import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PublisherManagementPage from "./pages/PublisherManagementPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/admin/publishers' element={<PublisherManagementPage />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;



