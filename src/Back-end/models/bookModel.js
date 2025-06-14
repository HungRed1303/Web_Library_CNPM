const pool = require('../Database/config')

const getAllBook = async () => {
  const result = await pool.query(`
    SELECT b.book_id, b.title, b.publisher_id, p.name AS publisher_name,
           EXTRACT(YEAR FROM b.publication_year) AS publication_year, 
           b.quantity, b.availability, b.price, b.author, b.image_url,
           ARRAY_AGG(c.name) AS categories
    FROM books b
    LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
    LEFT JOIN book_category bc ON b.book_id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.category_id
    GROUP BY b.book_id, p.name
  `);
  return result.rows;
};




const getBookById = async (book_id)=>{
  
  const result = await pool.query(`
    SELECT b.book_id, b.title, b.publisher_id, p.name AS publisher_name,
           EXTRACT(YEAR FROM b.publication_year) AS publication_year, 
           b.quantity, b.availability, b.price, b.author, b.image_url,
           ARRAY_AGG(c.name) AS categories
    FROM books b
    LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
    LEFT JOIN book_category bc ON b.book_id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.category_id
    WHERE b.book_id = $1
    GROUP BY b.book_id, p.name
  `, [book_id]);

  return result.rows[0];
};

const getBook = async (book_id) => {
    const result = await pool.query(`
    SELECT b.image_url, b.title, b.author, b.publication_year
    FROM books b
    WHERE b.book_id = $1
  `, [book_id]);

  return result.rows[0];
};

const findBooks = async (title, author, category) => {
  let baseQuery = `
    SELECT b.*, c.name AS category_name
    FROM books b
    JOIN book_category bc ON b.book_id = bc.book_id
    JOIN categories c ON bc.category_id = c.category_id
    WHERE 1=1
  `;

  const params = [];
  let index = 1;

  if (title) {
    baseQuery += ` AND LOWER(b.title) LIKE LOWER($${index++})`;
    params.push(`%${title}%`);
  }
  if (author) {
    baseQuery += ` AND LOWER(b.author) LIKE LOWER($${index++})`;
    params.push(`%${author}%`);
  }
  if (category) {
    baseQuery += ` AND LOWER(c.name) LIKE LOWER($${index++})`;
    params.push(`%${category}%`);
  }

  const result = await pool.query(baseQuery, params);
  return result.rows;
};





const createBook = async (title, publisher_id, publication_year, quantity, availability, price, author, image_url) => {
  const result = await pool.query(`
    INSERT INTO books (title, publisher_id, publication_year, quantity, availability, price, author, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [title, publisher_id, publication_year, quantity, availability, price, author, image_url]);

  return result.rows[0];
};


const updateBook = async (book_id, title, publisher_id, publication_year, quantity, availability, price, author, image_url) => {

  const result = await pool.query(`
    UPDATE books
    SET title = $1, publisher_id = $2, publication_year = $3, quantity = $4,
        availability = $5, price = $6, author = $7, image_url = $8
    WHERE book_id = $9
    RETURNING *
  `, [title, publisher_id, publication_year, quantity, availability, price, author, image_url, book_id]);

  if (result.rowCount === 0) return null;

  return result.rows[0];
};


const deleteBook = async (book_id) => {
   const result = await pool.query(`
    SELECT *
    FROM books
    WHERE books.book_id = $1
    `,
    [book_id]);

    if(result.rowCount == 0){
        return null;
    }

    await pool.query(`
        DELETE FROM books 
        WHERE book_id = $1
        `,
        [book_id]);

     return true;
}

module.exports={
    getAllBook,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    findBooks,
    getBook
}