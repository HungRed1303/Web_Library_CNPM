const pool = require('../Database/config.js');

const getAllPublishers = async () => {
  const result = await pool.query(
    `SELECT p.publisher_id, p.name, p.address, p.email, p.phone_number
     FROM publishers p`
  );
  return result.rows;
}

const getPublisherById = async (publisher_id) => {
  const result = await pool.query(
    `SELECT p.publisher_id, p.name, p.address, p.email, p.phone_number
     FROM publishers p
     WHERE p.publisher_id = $1`,
    [publisher_id]
  );
  return result.rows[0];
}

const createPublisher = async (name, address, email, phone_number) => {
  const result = await pool.query(
    `INSERT INTO publishers (name, address, email, phone_number)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, address, email, phone_number]
  );
  return result.rows[0];
}

const updatePublisher = async (publisher_id, name, address, mail, phone_number) => {
  const result = await pool.query(
    `UPDATE publishers
     SET name = $1, address = $2, phone_number = $3
     WHERE publisher_id = $4
     RETURNING *`,
    [name, address, mail, phone_number, publisher_id]
  );
  return result.rows[0];
}

const deletePublisher = async (publisher_id) => {
  const result = await pool.query(
    `DELETE FROM publishers
     WHERE publisher_id = $1
     RETURNING *`,
    [publisher_id]
  );
  return result.rows[0];
}

module.exports = {
  getAllPublishers,
  getPublisherById,
  createPublisher,
  updatePublisher,
  deletePublisher
};