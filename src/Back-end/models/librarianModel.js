const pool = require('../Database/config.js');

const getAllLibrarians = async () => {
  const result = await pool.query(
    `SELECT u.user_id as id, u.username, u.email, u.name, l.start_date, l.end_date
     FROM librarians l
     JOIN users u ON l.user_id = u.user_id
     WHERE u.role = 'L'`
  );
  return result.rows;
}

const getLibrarianById = async (id) => {
  const result = await pool.query(
    `SELECT u.user_id as id, u.username, u.email, u.name, l.start_date, l.end_date
     FROM librarians l
     JOIN users u ON l.user_id = u.user_id
     WHERE u.user_id = $1 AND u.role = 'L'`,
    [id]
  );
  return result.rows[0];
}

const createLibrarian = async (username, email, name, password) => {
  // Start transaction
  await pool.query('BEGIN');

  try {
    // Insert into users table
    const userResult = await pool.query(
      `INSERT INTO users (username, email, name, password, role)
       VALUES ($1, $2, $3, $4, 'L')
       RETURNING user_id`,
      [username, email, name, password]
    );

    const userId = userResult.rows[0].user_id;

    // Insert into librarians table
    await pool.query(
      `INSERT INTO librarians (user_id, start_date)
       VALUES ($1, CURRENT_DATE)`,
      [userId]
    );

    await pool.query('COMMIT');

    return {
      id: userId,
      username,
      email,
      name
    };
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
};

const updateLibrarian = async (id, username, email, name) => {
  const result = await pool.query(
    `UPDATE users
     SET username = $1, email = $2, name = $3
     WHERE user_id = $4 AND role = 'L'
     RETURNING user_id as id, username, email, name`,
    [username, email, name, id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

const deleteLibrarian = async (id) => {
  // Start transaction
  await pool.query('BEGIN');

  try {
    // Delete from librarians table
    await pool.query(
      `DELETE FROM librarians WHERE user_id = $1`,
      [id]
    );

    // Delete from users table
    const result = await pool.query(
      `DELETE FROM users WHERE user_id = $1 AND role = 'L'
       RETURNING user_id`,
      [id]
    );

    if (result.rowCount === 0) {
      await pool.query('ROLLBACK');
      return null;
    }

    await pool.query('COMMIT');
    return true;
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

module.exports = {
  getAllLibrarians,
  getLibrarianById,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian
};
