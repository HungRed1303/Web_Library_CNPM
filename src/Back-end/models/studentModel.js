const pool = require('../Database/config.js');

const getAllStudent = async () => {
  const result = await pool.query(
    `SELECT s.student_id, u.username, u.email, u.name, s.class_id   
     FROM students s
     JOIN users u ON s.user_id = u.user_id`
  );
  return result.rows;
}

const getStudentById = async (student_id) => {
  const result = await pool.query(
    `SELECT s.student_id, u.username, u.email, u.name, s.class_id
     FROM students s
     JOIN users u ON s.user_id = u.user_id
     WHERE s.student_id = $1`,
    [student_id]
  );
  return result.rows[0];
}

const createStudent = async (user_id) => {
    const result = await pool.query(
        `INSERT INTO students (user_id)
         VALUES ($1)`,
        [user_id]
    );
    return result.rows[0];
}

const updateStudent = async (student_id, username, email, name, class_id) => {
    const result1 = await pool.query(
        `UPDATE users
         SET username = $1, email = $2, name = $3
         WHERE user_id = (SELECT user_id FROM students WHERE student_id = $4)`,
        [username, email, name, student_id]
    );
     
    if(result1.rowCount === 0){
        return null;
    }
    const result2 = await pool.query(
        `UPDATE students
         SET class_id = $1
         WHERE student_id = $2`,
        [class_id, student_id]
    );

    // Nếu affectedRows = 0 tức là không tìm thấy student
    if (result2.rowCount === 0) {
        return null;
    }

    // Trả về dữ liệu hoặc true tùy nhu cầu
    return {
        username, email, name, class_id, student_id
    };
}


const deleteStudent = async (student_id) => {
    // 1. Truy vấn lấy user_id trước
    const result = await pool.query(
        `SELECT user_id FROM students WHERE student_id = $1`,
        [student_id]
    );

    if (result.rowCount === 0) {
        return null; // hoặc throw error: student not found
    }

    const user_id = result.rows[0].user_id;

    // 2. Xóa student
    await pool.query(
        `DELETE FROM students WHERE student_id = $1`,
        [student_id]
    );

    // 3. Xóa user tương ứng
    await pool.query(
        `DELETE FROM users WHERE user_id = $1`,
        [user_id]
    );

    return true;
}

const findByUserId = async (userId) => {
  console.log('StudentModel.findByUserId called with userId:', userId);
  
  try {
    const result = await pool.query(
      'SELECT * FROM students WHERE user_id = $1',
      [userId]
    );
    console.log('Query result rows:', result.rows);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const getStudentByUserId = async (user_id) =>{
      const result = await pool.query(
    `SELECT s.student_id, u.username, u.email, u.name, s.class_id
     FROM students s
     JOIN users u ON s.user_id = u.user_id
     WHERE s.user_id = $1`,
    [user_id]
  );
  return result.rows[0];
}

module.exports = {
    getAllStudent,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    findByUserId,
    getStudentByUserId
}