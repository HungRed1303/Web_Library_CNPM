import { jwtDecode } from 'jwt-decode';


/**
 * Thêm sách vào wishlist
 * @param {{ student_id: number, book_id: number }} data
 */
export const addBookToWishlist = async (data) => {
  const token = localStorage.getItem('token');
  const { student_id, book_id } = data;

  const res = await fetch('http://localhost:3000/api/wishlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ student_id, book_id }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'POST /wishlist failed');
  }

  return res.json();
};

/**
 * Lấy danh sách sách trong wishlist của một student_id
 * @param {number} student_id
 * @returns {Promise<{ data: object[] }>}
 */
export const getWishListByStudentId = async (student_id) => {
  const token = localStorage.getItem('token');

  
  const res = await fetch(`http://localhost:3000/api/wishlist/${student_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'GET /wishlist failed');
  }
  return res.json();
};

/**
 * Xóa sách khỏi wishlist
 * @param {number} student_id
 * @param {number} book_id
 * @returns {Promise<any>}
 */
export const deleteBookFromWishlist = async (student_id, book_id) => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/api/wishlist', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ student_id, book_id })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'DELETE /wishlist failed');
  }
  return res.json();
};