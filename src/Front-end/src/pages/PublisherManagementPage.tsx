import React from "react";
import { useNavigate } from "react-router-dom";
import PublisherManagementForm from "../components/PublisherManagementForm";

const PublisherManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black font-[Tahoma] text-white p-6">
      {/* nút quay lại (nếu cần) */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 border border-pink-500 rounded shadow-[0_0_8px_#ff00ff] hover:bg-pink-500 hover:text-black transition"
      >
        Back
      </button>

      {/* form quản lý */}
      <PublisherManagementForm />
    </div>
  );
};

export default PublisherManagementPage;
