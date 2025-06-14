const pool = require('../Database/config.js');

const getAllAdmin = async () => {
  const result = await pool.query(
    `SELECT a.admin_id, u.username, u.email, u.name
     FROM admins a
     JOIN users u ON a.user_id = u.user_id`
  );
  return result.rows;
}

const getAdminById = async (admin_id) => {
  const result = await pool.query(
    `SELECT a.admin_id, u.username, u.email, u.name
     FROM admins a
     JOIN users u ON a.user_id = u.user_id
     WHERE a.admin_id = $1`,
    [admin_id]
  );
  return result.rows[0];
}

const createAdmin = async (user_id) => {
  const result = await pool.query(
    `INSERT INTO admins (user_id)
     VALUES ($1)
     RETURNING *
     `,
    [user_id]
  );
  return result.rows[0];
}

const updateAdmin = async (admin_id, username, email, name) => {
  const result1 = await pool.query(
    `UPDATE users
     SET username = $1, email = $2, name = $3
     WHERE user_id = (SELECT user_id FROM admins WHERE admin_id = $4)
     `,
        [username, email, name, admin_id]
  );
  // Nếu affectedRows = 0 tức là không tìm thấy admin
  if (result1.rowCount === 0) {
    return null;
  }

  // Trả về dữ liệu hoặc true tùy nhu cầu
  return {
    username, email, name, admin_id
  };
}

const deleteAdmin = async (admin_id) => {
  // 1. Truy vấn lấy user_id trước
  const result = await pool.query(
    `SELECT user_id FROM admins WHERE admin_id = $1`,
    [admin_id]
  );

  if (result.rowCount === 0) {
    return null; // Không tìm thấy admin
  }

  const user_id = result.rows[0].user_id;

  // 2. Xóa admin
  await pool.query(
    `DELETE FROM admins WHERE admin_id = $1`,
    [admin_id]
  );

  // 3. Xóa user
  await pool.query(
    `DELETE FROM users WHERE user_id = $1`,
    [user_id]
  );

  return true;
}

const findByUserId = async (userId) => {
  console.log('AdminModel.findByUserId called with userId:', userId);
  
  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE user_id = $1',
      [userId]
    );
    console.log('Query result rows:', result.rows);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  findByUserId
};
