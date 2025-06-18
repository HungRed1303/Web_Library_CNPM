import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentById, updateStudent } from "../service/studentService";

interface Student {
  student_id: number;
  username: string;
  email: string;
  name: string;
  class_id: string | null;
}

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!id) {
          throw new Error("No student ID provided in route.");
        }
        const data = await getStudentById(Number(id));
        const normalizedData = {
          ...data,
          class_id: data.class_id !== null ? String(data.class_id) : null,
        };
        setStudent(normalizedData);
        setEditedStudent(normalizedData);
      } catch (err: any) {
        setError(err.message || "Failed to load student profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedStudent({ ...student! });
    setError("");
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedStudent({ ...student! });
    setError("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    if (!editedStudent) return;

    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");
      
      // Validate required fields
      if (!editedStudent.name.trim()) {
        throw new Error("Full name is required.");
      }
      if (!editedStudent.username.trim()) {
        throw new Error("Username is required.");
      }
      if (!editedStudent.email.trim()) {
        throw new Error("Email is required.");
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedStudent.email)) {
        throw new Error("Please enter a valid email address.");
      }
      // Ngay lập tức load lại dữ liệu từ server
      const refreshedData = await getStudentById(Number(id));
      const normalizedRefreshedData = {
        ...refreshedData,
        class_id: refreshedData.class_id !== null ? String(refreshedData.class_id) : null,
      };
      
      // Cập nhật state với dữ liệu mới nhất từ server
      setStudent(normalizedRefreshedData);
      setEditedStudent(normalizedRefreshedData);
      setIsEditing(false);
      setSuccessMessage("Student profile updated successfully!");
      const normalizedRefreshedData2 = {
        ...refreshedData,
        class_id: refreshedData.class_id !== null ? String(refreshedData.class_id) : null,
      };
      setStudent(normalizedRefreshedData2);
      setEditedStudent(normalizedRefreshedData2);
      setIsEditing(false);
      setSuccessMessage("Student profile updated successfully!");
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || "Failed to update student profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field: keyof Student, value: string | null) => {
    if (!editedStudent) return;
    
    setEditedStudent({
      ...editedStudent,
      [field]: value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-blue-800 text-lg">Loading student profile...</p>
      </div>
    );
  }

  if (error && !isEditing) {
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

          {error && isEditing && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <div className="space-y-4 text-blue-800">
            <div>
              <span className="font-semibold">Full Name:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedStudent?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="ml-2 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter full name"
                />
              ) : (
                student.name
              )}
            </div>
            
            <div>
              <span className="font-semibold">Username:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedStudent?.username || ""}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="ml-2 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter username"
                />
              ) : (
                student.username
              )}
            </div>
            
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {isEditing ? (
                <input
                  type="email"
                  value={editedStudent?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="ml-2 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter email"
                />
              ) : (
                student.email
              )}
            </div>
            
            <div>
              <span className="font-semibold">Class ID:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedStudent?.class_id || ""}
                  onChange={(e) => handleInputChange("class_id", e.target.value || null)}
                  className="ml-2 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter class code"
                />
              ) : (
                student.class_id ?? "N/A"
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Profile
              </button>
            )}
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