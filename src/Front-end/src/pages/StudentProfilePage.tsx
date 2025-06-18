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

      // Update student
      await updateStudent(Number(id), editedStudent);
      
      // Refresh data from server
      const refreshedData = await getStudentById(Number(id));
      const normalizedRefreshedData = {
        ...refreshedData,
        class_id: refreshedData.class_id !== null ? String(refreshedData.class_id) : null,
      };
      
      // Update state with fresh data
      setStudent(normalizedRefreshedData);
      setEditedStudent(normalizedRefreshedData);
      setIsEditing(false);
      setSuccessMessage("Student profile updated successfully!");
      
      // Auto-hide success message after 3 seconds
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
      <div className="w-full max-w-[800px] z-10">
        <div className="bg-cream border border-blue-600/30 rounded-2xl shadow-xl shadow-blue-600/10 pt-8 pb-8 px-8 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-2">Student Profile</h1>
            <p className="text-blue-600">Information of student ID: {student.student_id}</p>
          </div>

          {error && isEditing && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="space-y-6 text-blue-800">
            {/* Full Name Field */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="font-semibold text-blue-800 w-32 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0">
                Full Name:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedStudent?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                />
              ) : (
                <span className="flex-1 py-3 text-blue-700">{student.name}</span>
              )}
            </div>
            
            {/* Username Field */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="font-semibold text-blue-800 w-32 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0">
                Username:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedStudent?.username || ""}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter username"
                />
              ) : (
                <span className="flex-1 py-3 text-blue-700">{student.username}</span>
              )}
            </div>
            
            {/* Email Field */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="font-semibold text-blue-800 w-32 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0">
                Email:
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedStudent?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email"
                />
              ) : (
                <span className="flex-1 py-3 text-blue-700">{student.email}</span>
              )}
            </div>
            
            {/* Class ID Field */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="font-semibold text-blue-800 w-32 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0">
                Class ID:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedStudent?.class_id || ""}
                  onChange={(e) => handleInputChange("class_id", e.target.value || null)}
                  className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter class code"
                />
              ) : (
                <span className="flex-1 py-3 text-blue-700">{student.class_id || "N/A"}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updating}
                  className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-blue-600/70">
            {/* Footer text if needed */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;