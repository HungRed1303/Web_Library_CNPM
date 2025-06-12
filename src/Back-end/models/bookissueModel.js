const pool = require("../Database/config");

const getAllBookIssue = async ()=>{
    const result  = await pool.query(`
        SELECT *
        FROM book_issues
        `);
    
        return result.rows;
}

const getBookIssueById = async (id)=>{
    const result = await pool.query(`
        SELECT * 
        FROM book_issues
        WHERE issue_id = $1`,
        [id]);
      
         if(result.rowCount == 0){
            return null;
        }
        return result.rows[0];
}

const getBookIssueByIdStudent = async (id)=>{
    const result = await pool.query(`
        SELECT * 
        FROM book_issues bi join students st on bi.student_id =st.student_id
        join books b on bi.book_id = b.book_id
        join users u on st.user_id =u.user_id
        WHERE bi.student_id = $1`,
        [id]);

 
     
        return result.rows;
}

const getBookIssueByStudentBook = async (book_id,student_id)=>{
   const result = await pool.query(`
    SELECT *
    FROM book_issues
    WHERE book_id = $1 and student_id = $2
    `,
    [book_id,student_id]);
    
 

    return result.rows;
}

const createBookIssue = async (book_id,student_id,issue_date,due_date,return_date,fine_amount,status ="pending")=>{
  const result = await pool.query(`
    INSERT INTO book_issues (book_id,student_id,issue_date,due_date,return_date,fine_amount,status)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *
    `,[book_id,student_id,issue_date,due_date,return_date,fine_amount,status]);

    return result.rows[0];
}

const updateBookIssue = async (issue_id,book_id,student_id,issue_date,due_date,return_date,fine_amount,status = "pending")=>{
    const bookissue = await pool.query(`
        SELECT *
        FROM book_issues
        WHERE issue_id = $1
        `,[issue_id]);

        if(bookissue.rowCount == 0){
            return null;
        }

    const result = await pool.query(`
        UPDATE book_issues
        SET book_id = $1, student_id = $2, issue_date = $3, due_date = $4, return_date = $5, fine_amount = $6, status =$7
        WHERE issue_id = $8`,[book_id,student_id,issue_date,due_date,return_date,fine_amount,status,issue_id]);

   if(result.rowCount == 0){
    return null;
   }

   return {
   issue_id,book_id,student_id,issue_date,due_date,return_date,fine_amount,status
   }

}


const deleteBookIssue = async (id)=>{
   const bookissue = await pool.query(`
        SELECT *
        FROM book_issues
        WHERE issue_id = $1
        `,[id]);

    if(bookissue.rowCount == 0){
            return null;
    }
    
     await pool.query(`
        DELETE FROM book_issues
        WHERE issue_id = $1
        `,[id]);

    return true;
}

module.exports = {
    getAllBookIssue,
    getBookIssueById,
    getBookIssueByStudentBook,
    createBookIssue,
    updateBookIssue,
    deleteBookIssue,
    getBookIssueByIdStudent
}