require('dotenv').config();
const { Pool } = require('pg');

// Tạo pool kết nối
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Kiểm tra kết nối 1 lần khi khởi động
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL connection failed:', err);
  } else {
    console.log('✅ PostgreSQL connected at:', res.rows[0].now);
  }
});

// Export pool để dùng ở model
module.exports = pool;
