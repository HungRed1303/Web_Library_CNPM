const { LogIn } = require('lucide-react');
const pool = require('../Database/config.js');
const crypto = require('crypto');

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

const findUserById = async (id)=>{
  const result = await pool.query(`
    SELECT *
    FROM users 
    WHERE user_id = $1`,
    [id]);
    return result.rows[0];
}

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

function getResetPasswordToken() {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  return {
    resetToken,
    hashedToken,
    expires,
  };
}

async function updateResetToken(email, hashedToken, expires) {
  const result = await pool.query(`
    UPDATE users 
    SET reset_token = $1, reset_token_expire = $2
    WHERE email = $3
  `, [hashedToken, expires, email]);
  return result.rowCount;
}


async function clearResetToken(email) {
  const result = await pool.query(`
    UPDATE users
    SET reset_token = NULL, reset_token_expire = NULL
    WHERE email = $1
    RETURNING *;
  `, [email]);
  return result.rows[0];
}

async function findUserByResetToken(token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const result = await pool.query(`
    SELECT * FROM users
    WHERE reset_token = $1 AND reset_token_expire > NOW()
  `, [hashedToken]);

  return result.rows[0];
}

async function updatePassword(email, hashedPassword) {
  const result = await pool.query(`
    UPDATE users
    SET password = $1, reset_token = NULL, reset_token_expire = NULL
    WHERE email = $2
  `, [hashedPassword, email]);

  return result.rowCount > 0;
}

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
  getResetPasswordToken,
  updateResetToken,
  clearResetToken,
  findUserByResetToken,
  updatePassword
};