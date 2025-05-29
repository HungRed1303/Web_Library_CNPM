const pool = require("../Database/config")

const getBorrowedBooks = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS total_borrowed
     FROM book_issues
  `);
  return result.rows[0];
};

const getBorrowDates = async () => {
  const result = await pool.query(`
    SELECT u.username,b.title,bi.student_id, bi.book_id, bi.issue_date 
    FROM book_issues bi join students st on bi.student_id = st.student_id
    join books b on b.book_id = bi.book_id
    join users u on u.user_id = st.user_id
  `);
  return result.rows;
};

const getDueDates = async () => {
  const result = await pool.query(`
    SELECT u.username,b.title,bi.student_id, bi.book_id, bi.due_date
     FROM book_issues bi join students st on bi.student_id = st.student_id
    join books b on b.book_id = bi.book_id
    join users u on u.user_id = st.user_id
  `);
  return result.rows;
};

const getOverdueBooks = async () => {
  const result = await pool.query(`
    SELECT u.username,b.title,bi.student_id, bi.book_id, bi.due_date
    FROM book_issues bi join students st on bi.student_id = st.student_id
    join books b on b.book_id = bi.book_id
    join users u on u.user_id = st.user_id
    WHERE return_date IS NULL AND due_date < CURRENT_DATE
  `);
  return result.rows;
};

const getUserStatistics = async () => {
  const result = await pool.query(`
    SELECT u.username, bi.student_id, COUNT(*) AS books_borrowed
    FROM book_issues bi join students st on bi.student_id = st.student_id
    join books b on b.book_id = bi.book_id
    join users u on u.user_id = st.user_id
    GROUP BY bi.student_id, u.username
    ORDER BY books_borrowed DESC
  `);
  return result.rows;
};

module.exports = {
    getBorrowDates,
    getBorrowedBooks,
    getDueDates,
    getOverdueBooks,
    getUserStatistics
}