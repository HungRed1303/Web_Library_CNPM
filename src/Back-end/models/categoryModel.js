const pool = require("../Database/config")

const getAllCategory = async ()=>{
    const result =await pool.query(`
        SELECT category_id, name, description
        FROM categories
        `);

    return result.rows;
}

const getCategoryById = async (category_id)=>{
    const result = await pool.query(`
        SELECT c.name, c.description
        FROM categories c
        WHERE c.category_id = $1
        `,
        [category_id]);

        return result.rows[0];
}

const createCategory = async (name, description) =>{
    const result = await pool.query(`
        INSERT INTO categories (name,description)
        VALUES ($1,$2)
        RETURNING *
        `,[name,description])

        return result.rows[0];
}

const updateCategory = async (category_id,name,description)=>{
   const result = await pool.query(`
    UPDATE categories
    SET name = $1, description = $2
    WHERE category_id = $3
    RETURNING *
    `,[name,description,category_id]);

    if(result.rowCount == 0){
        return null;
    }
    
    return {category_id,name,description};
}

const deleteCategory = async (category_id)=>{
    const result = await pool.query(`
        SELECT * 
        FROM categories
        WHERE categories.category_id = $1
        `,[category_id]);

    if (result.rowCount == 0){
        return null;
    }

    await pool.query(`
        DELETE FROM categories
         WHERE category_id =$1`,[category_id]);

    return true;
}

module.exports= {
    getAllCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}