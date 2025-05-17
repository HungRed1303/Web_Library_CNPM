require('dotenv').config();
const express = require('express');
const connectToDB = require('./Database/config');

const app = express();
const port = 3000;

app.get('/users', async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
