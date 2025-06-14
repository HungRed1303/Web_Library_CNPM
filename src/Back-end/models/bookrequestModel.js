const pool = require("../Database/config");

const getAllBookRequest = async ()=>{
    const result  = await pool.query(`
        SELECT br.request_id, br.student_id, br.book_id, br.request_date, br.status, u.name AS student_name, b.title AS book_title
        FROM book_requests br
        JOIN students st ON br.student_id = st.student_id
        JOIN users u ON st.user_id = u.user_id
        AND u.role = 'S'
        JOIN books b ON br.book_id = b.book_id
        ORDER BY br.request_date DESC
        `);
        return result.rows;
}

const getBookRequestById = async (id)=>{
    const result = await pool.query(`
        SELECT br.request_id,br.student_id,br.book_id, br.request_date, br.status, u.name AS student_name, b.title AS book_title
        FROM book_requests br
        JOIN students st ON br.student_id = st.student_id
        JOIN books b ON br.book_id = b.book_id
        JOIN users u ON st.user_id = u.user_id
        WHERE request_id = $1`,
        [id]);

      if(result.rowCount == 0){
            return null;
        }
        
        return result.rows[0];
}

const createBookRequest = async (book_id,student_id,request_date,status = "pending")=>{
  const result = await pool.query(`
    INSERT INTO book_requests (book_id,student_id,request_date,status)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,[book_id,student_id,request_date,status]);

    return result.rows[0];
}

const updateBookRequest = async (request_id,book_id,student_id,request_date,status = "pending")=>{
    const bookrequest = await pool.query(`
        SELECT *
        FROM book_requests
        WHERE request_id = $1
        `,[request_id]);

        if(bookrequest.rowCount == 0){
            return null;
        }

    const result = await pool.query(`
        UPDATE book_requests
        SET book_id = $1, student_id = $2, request_date = $3, status = $4
        WHERE request_id = $5`,[book_id,student_id,request_date,status,request_id]);

   if(result.rowCount == 0){
    return null;
   }

   return {
    request_id, book_id, student_id, request_date, status
   }

}

const deleteBookRequest = async (id)=>{
   const bookrequest = await pool.query(`
        SELECT *
        FROM book_requests
        WHERE request_id = $1
        `,[id]);

    if(bookrequest.rowCount == 0){
            return null;
    }
    
     await pool.query(`
        DELETE FROM book_requests
        WHERE request_id = $1
        `,[id]);

    return true;
}

module.exports = {
    getAllBookRequest,
    getBookRequestById,
    createBookRequest,
    updateBookRequest,
    deleteBookRequest
}