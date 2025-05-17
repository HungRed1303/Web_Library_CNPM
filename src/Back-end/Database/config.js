require('dotenv').config(); // Load biến môi trường từ .env
const { Pool } = require('pg');

// Tạo pool kết nối
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Hàm kết nối DB (kiểm tra kết nối)
const connectToDB = async () => {
  try {
    await pool.connect(); // Gọi connect từ pool đã khởi tạo
    console.log("Connected to PostgreSQL database");
    return pool;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

module.exports = connectToDB;
