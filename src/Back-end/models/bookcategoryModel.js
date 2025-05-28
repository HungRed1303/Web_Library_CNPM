const pool = require("../Database/config.js")

const createBookCategory = async (book_id, category_id)=>{
 const result = await pool.query(`
    INSERT INTO book_category (book_id,category_id)
    VALUES ($1,$2)
    `,
    [book_id,category_id]);

    return result.rows[0];
}

const deleteBookCategory = async (book_id)=>{
    const result = await pool.query(`    
        SELECT * 
        FROM book_category bc
        WHERE bc.book_id = $1 
        `,[book_id]);

        if(result.rowCount == 0){
            return null;
        }
    
    await pool.query(`
        DELETE FROM book_category
        WHERE book_id =$1
        `,
        [book_id]);

        return true;
}
module.exports = {
    createBookCategory,
    deleteBookCategory
}