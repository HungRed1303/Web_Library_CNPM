const pool = require("../Database/config")

const getAllWishListByIdStudent = async (id)=>{
    const result = await pool.query(`
        SELECT *
        FROM books b join wishlist w on b.book_id = w.book_id
        WHERE w.student_id = $1
        `,
        [id]);

    return result.rows;
}

const insertBookWishList = async (student_id,book_id,created_date)=>{
    const result = await pool.query(`
        INSERT INTO wishlist (student_id,book_id,created_date)
        VALUES ($1,$2,$3)
        `,
        [student_id,book_id,created_date]);

    return result.rows[0]; 
}

const deleteBookWishList = async(student_id, book_id)=>{
    const wishlist = await pool.query(`
        SELECT *
        FROM wishlist w
        WHERE w.student_id = $1 and w.book_id = $2
        `,
        [student_id,book_id]);

        if(wishlist.rowCount ==0 ){
            return null;
        }
     
   const result = await pool.query(`
    DELETE FROM wishlist
    WHERE student_id = $1 and book_id = $2
    `,
    [student_id,book_id]);
    return true;
}

module.exports={
    getAllWishListByIdStudent,
    insertBookWishList,
    deleteBookWishList
}