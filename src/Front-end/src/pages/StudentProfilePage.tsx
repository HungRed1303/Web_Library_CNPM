import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentById } from "../service/studentService";

interface Student {
  student_id: number;
  username: string;
  email: string;
  name: string;
  class_id: number | null;
}

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!id) {
          throw new Error("No student ID provided in route.");
        }
        const data = await getStudentById(Number(id));
        setStudent(data);
      } catch (err: any) {
        setError(err.message || "Failed to load student profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-blue-800 text-lg">Loading student profile...</p>
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

  if (!student) return null;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-[700px] z-10">
        <div className="bg-cream border border-blue-600/30 rounded-2xl shadow-xl shadow-blue-600/10 pt-5 pb-5 px-40 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Student Profile</h1>
            <p className="text-blue-600">Information of student ID: {student.student_id}</p>
          </div>

          <div className="space-y-4 text-blue-800">
            <div>
              <span className="font-semibold">Full Name:</span> {student.name}
            </div>
            <div>
              <span className="font-semibold">Username:</span> {student.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {student.email}
            </div>
            <div>
              <span className="font-semibold">Class ID:</span> {student.class_id ?? "N/A"}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-blue-600/70">
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
