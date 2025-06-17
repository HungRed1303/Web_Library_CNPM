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

const getTotalTypeOfBooks = async ()=>{
  const result = await pool.query(`
    SELECT COUNT(*) as total
    FROM books
    `)

    return result.rows[0];
}

const getTotalBook = async () =>{
  const result1 = await pool.query(`
    SELECT SUM(b.quantity) as total
    FROM books b
    `)

  const result2 = await pool.query(`
    SELECT COUNT(*) as total
    FROM book_issues bi
    WHERE bi.status = 'issuing'
    `)
   
  const total = Number(result1.rows[0].total || 0) + Number(result2.rows[0].total || 0)

  return { "total": total};
}

const getTotalIssuedBook = async ()=>{
  const result = await pool.query(`
    SELECT COUNT(*) as total
    FROM book_issues bi
    WHERE bi.status = 'issuing'  
    `)

    return result.rows[0];
}

const getTotalStudent = async ()=>{
  const result = await pool.query(`
    SELECT COUNT(*) as total
    FROM students 
    `)

    return result.rows[0];
}

const getNumberBookByGenre =  async ()=>{
  const result = await pool.query(`
        SELECT 
      c.category_id AS id, 
      c.name AS genre, 
      COUNT(b.book_id) AS total
    FROM categories c
    LEFT JOIN book_category bc ON c.category_id = bc.category_id
    LEFT JOIN books b ON bc.book_id = b.book_id
    GROUP BY c.category_id, c.name
    ORDER BY c.name
    `)
  
    return result.rows;
}

const getTopReader = async (k)=>{
  const result = await pool.query(`
    SELECT s.student_id as student_id, u.name as name, COUNT(*)
    FROM students s join book_issues bi on s.student_id = bi.student_id
    join users u on u.user_id = s.user_id
    WHERE bi.status = 'issuing'
    GROUP BY s.student_id, u.name
    LIMIT $1
    `,[k])

    return result.rows;
}

const getIssueReturnBookWeek = async (start_date,end_date)=>{
  const result = await pool.query(`
    SELECT
    COUNT(CASE WHEN issue_date BETWEEN $1 AND $2 THEN 1 END) AS tong_luot_muon,
    COUNT(CASE WHEN return_date BETWEEN $1 AND $2 THEN 1 END) AS tong_luot_tra
    FROM book_issues;
    `,[start_date,end_date])

    return result.rows[0];
}
module.exports = {
    getBorrowDates,
    getBorrowedBooks,
    getDueDates,
    getOverdueBooks,
    getUserStatistics,
    getIssueReturnBookWeek,
    getNumberBookByGenre,
    getTopReader,
    getTotalBook,
    getTotalStudent,
    getTotalTypeOfBooks,
    getTotalIssuedBook
}