import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLibrarianById } from "../service/librarianService";

interface Librarian {
  librarian_id: number;
  username: string;
  email: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
}

const LibrarianProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [librarian, setLibrarian] = useState<Librarian | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLibrarian = async () => {
      try {
        if (!id) throw new Error("No librarian ID provided in route.");
        const data = await getLibrarianById(Number(id));
        setLibrarian(data);
      } catch (err: any) {
        setError(err.message || "Failed to load librarian profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrarian();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-blue-800 text-lg">Loading librarian profile...</p>
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

  if (!librarian) return null;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-[700px] z-10">
        <div className="bg-cream border border-blue-600/30 rounded-2xl shadow-xl shadow-blue-600/10 pt-5 pb-5 px-40 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Librarian Profile</h1>
            <p className="text-blue-600">Information of librarian ID: {librarian.librarian_id}</p>
          </div>

          <div className="space-y-4 text-blue-800">
            <div>
              <span className="font-semibold">Full Name:</span> {librarian.name}
            </div>
            <div>
              <span className="font-semibold">Username:</span> {librarian.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {librarian.email}
            </div>
            <div>
              <span className="font-semibold">Start Date:</span> {librarian.start_date ?? "N/A"}
            </div>
            <div>
              <span className="font-semibold">End Date:</span> {librarian.end_date ?? "N/A"}
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

export default LibrarianProfile;
