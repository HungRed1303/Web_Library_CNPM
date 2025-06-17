import { jwtDecode } from 'jwt-decode';

export const getBookById = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found");
  }

    try {
      const response = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch book requests')
      }

      const result = await response.json();
      return result.data
    } catch (error) {
      console.log("Error getBookById", error);
      throw error;
    }
  }

export const actualHandleBorrowBook = async (book_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const decoded = jwtDecode(token);
    const user_id = decoded.id;

    console.log("User ID:", user_id);

    if (!user_id) {
      throw new Error("Không tìm thấy user_id trong token");
    }

    const studentRes = await fetch(`http://localhost:3000/api/students/user-id/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!studentRes.ok) {
      throw new Error("Không thể lấy thông tin student_id từ user_id");
    }

    const studentData = await studentRes.json();
    const student_id = studentData?.data?.student_id;

    if (!student_id) {
      throw new Error("Dữ liệu student_id không hợp lệ");
    }

    const borrowRes = await fetch('http://localhost:3000/api/borrow/borrow-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ book_id, student_id })
    });

    if (!borrowRes.ok) {
      throw new Error('Mượn sách thất bại');
    }

    const result = await borrowRes.json();
    return result.data;
  } catch (error) {
    console.error("Error handleBorrowBook:", error);
    throw error;
  }
};
