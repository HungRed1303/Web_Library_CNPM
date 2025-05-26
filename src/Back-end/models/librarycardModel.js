const pool = require("../Database/config")

const getAllLibraryCard = async ()=>{
    const result = await pool.query(`
        SELECT *
        FROM library_cards
        `);

    return result.rows;
}

const getLibraryCardByStudentId = async (student_id)=>{
    const result = await pool.query(`
        SELECT *
        FROM library_cards lc
        WHERE lc.student_id = $1
        `,[student_id]);
    
    return result.rows[0];
}

const createLibraryCard = async (student_id,start_date,end_date,status = "pending")=>{
   const result = await pool.query(`
    INSERT INTO library_cards (student_id,start_date,end_date,status)
    VALUES ($1,$2,$3,$4)
    RETURNING *;
    `
    ,[student_id,start_date,end_date,status])
    return result.rows[0];
}


const updateLibraryCard = async (library_card_id,student_id, start_date,end_date, status)=>{
    const card = await pool.query(`
        SELECT *
        FROM library_cards 
        WHERE card_id = $1`,[library_card_id]);

    if(card.rowCount === 0){
     return null;
    }
    
    const result = await pool.query(`
        UPDATE library_cards
        SET student_id = $1, start_date = $2, end_date= $3,status = $4
        WHERE card_id = $5`
        ,[student_id,start_date,end_date,status,library_card_id]);

   return {
   student_id,start_date,end_date,status,library_card_id
   }
}

const deleteLibraryCard = async (library_card_id)=>{
    const card = await pool.query(`
        SELECT *
        FROM library_cards 
        WHERE card_id = $1`,[library_card_id]);

    if(card.rowCount === 0){
     return null;
    }
    
     await pool.query(`
        DELETE FROM library_cards
        WHERE card_id = $1
        `,[library_card_id]);

   return true
}

module.exports = {
    getAllLibraryCard,
    getLibraryCardByStudentId,
    createLibraryCard,
    updateLibraryCard,
    deleteLibraryCard
}