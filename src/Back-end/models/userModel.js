const pool = require('../Database/config.js');

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

const createUser = async (username, password, email, name, role = 'S') => {
  const result = await pool.query(
    `INSERT INTO users (username, password, email, name, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [username, password, email, name, role]
  );
  if (result.rowCount === 0) {
    return null; // Không thể tạo user
  }
  return result.rows[0];
};


module.exports = {
  findUserByEmail,
  findUserByUsername,
  createUser,
};