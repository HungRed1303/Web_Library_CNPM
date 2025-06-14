import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdminById } from "../service/adminService";

interface Admin {
  admin_id: number;
  username: string;
  email: string;
  name: string;
}

const AdminProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        if (!id) throw new Error("No admin ID provided in route.");
        const data = await getAdminById(Number(id));
        setAdmin(data);
      } catch (err: any) {
        setError(err.message || "Failed to load admin profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-blue-800 text-lg">Loading admin profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-[700px] z-10">
        <div className="bg-cream border border-blue-600/30 rounded-2xl shadow-xl shadow-blue-600/10 pt-5 pb-5 px-40 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Admin Profile</h1>
            <p className="text-blue-600">Information of admin ID: {admin.admin_id}</p>
          </div>

          <div className="space-y-4 text-blue-800">
            <div>
              <span className="font-semibold">Full Name:</span> {admin.name}
            </div>
            <div>
              <span className="font-semibold">Username:</span> {admin.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {admin.email}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-blue-600/70"></p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
