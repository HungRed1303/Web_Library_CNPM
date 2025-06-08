const pool = require('../Database/config.js');

const getAllLibrarians = async () => {
  const result = await pool.query(
    `SELECT l.librarian_id, u.username, u.email, u.name,l.start_date, l.end_date
     FROM librarians l
     JOIN users u ON l.user_id = u.user_id`
  );
  return result.rows;
}

const getLibrarianById = async (librarian_id) => {
  const result = await pool.query(
    `SELECT l.librarian_id, u.username, u.email, u.name,l.start_date, l.end_date
     FROM librarians l
     JOIN users u ON l.user_id = u.user_id
     WHERE l.librarian_id = $1`,
    [librarian_id]
  );
  return result.rows[0];
}

const createLibrarian = async (user_id) => {
  const result = await pool.query(
    `INSERT INTO librarians (user_id, start_date)
     VALUES ($1, CURRENT_DATE)
     RETURNING *`,
    [user_id]
  );
  return result.rows[0];
};

const updateLibrarian = async (librarian_id, username, email, name, start_date, end_date) => {
  // Gán mặc định end_date = null nếu không truyền
  if (end_date === undefined) {
    end_date = null;
  }

  const result1 = await pool.query(
    `UPDATE users
     SET username = $1, email = $2, name = $3
     WHERE user_id = (SELECT user_id FROM librarians WHERE librarian_id = $4)
     `,
    [username, email, name, librarian_id]
  );
  
  if (result1.rowCount ==0){
    return null;
  }

  const result2 = await pool.query(
    `UPDATE librarians
     SET start_date = $1, end_date = $2
     WHERE librarian_id = $3`,
    [start_date, end_date, librarian_id]
  );

  if (result2.rowCount === 0) {
    return null;
  }

  return {
    librarian_id, username, email, name, start_date, end_date
  };
};


const deleteLibrarian = async (librarian_id) => {
  // 1. Truy vấn lấy user_id trước
  const result = await pool.query(
    `SELECT user_id FROM librarians WHERE librarian_id = $1`,
    [librarian_id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  const user_id = result.rows[0].user_id;

  // 2. Xóa librarian
  await pool.query(
    `DELETE FROM librarians WHERE librarian_id = $1`,
    [librarian_id]
  );

  // 3. Xóa user
  await pool.query(
    `DELETE FROM users WHERE user_id = $1`,
    [user_id]
  );

  return true;
}

module.exports = {
  getAllLibrarians,
  getLibrarianById,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian
};
