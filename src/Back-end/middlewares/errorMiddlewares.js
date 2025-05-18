const e = require("express");

// Định nghĩa lớp ErrorHandler kế thừa từ Error
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware xử lý lỗi chung cho toàn bộ hệ thống
const errorMiddleware = (err, req, res, next) => {
  // Thiết lập mặc định nếu không có sẵn
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  // Ghi log để tiện theo dõi lỗi
  console.error(err);

  // PostgreSQL error handling (dựa trên SQLSTATE error code)
  if (err.code === '23505') {
    // Vi phạm khóa unique (duplicate key)
    err = new ErrorHandler('Duplicate key value violates unique constraint', 400);
  }

  if (err.code === '23503') {
    // Vi phạm khóa ngoại
    err = new ErrorHandler('Foreign key violation', 400);
  }

  if (err.code === '22P02') {
    // Sai định dạng dữ liệu, ví dụ nhập UUID sai
    err = new ErrorHandler('Invalid input syntax', 400);
  }

  if (err.code === '42601') {
    // Sai cú pháp SQL
    err = new ErrorHandler('SQL syntax error', 400);
  }

  if (err.code === '42883') {
    // Gọi hàm không tồn tại trong PostgreSQL
    err = new ErrorHandler('Function does not exist', 400);
  }

  // Gửi response lỗi
  return res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};

// Xuất mặc định ErrorHandler nếu bạn muốn sử dụng nó nơi khác
module.exports = {
  ErrorHandler,
  errorMiddleware
};

