const BookIssueModel = require("../models/bookissueModel");
const BookRequestModel = require("../models/bookrequestModel");
const BookModel = require("../models/bookModel")
const StudentModel = require("../models/studentModel")
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/errorMiddlewares');
const e = require("express");

const toSQLDate = (date) => {
    // Kiểm tra nếu đã là Date object
    let dateObj;
    if (date instanceof Date) {
        dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
        // Kiểm tra nếu date không hợp lệ
        if (isNaN(dateObj.getTime())) {
            throw new Error(`Invalid date: ${date}`);
        }
    } else {
        throw new Error(`Invalid date type: ${typeof date}`);
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper function để format publication_year
const formatPublicationYear = (publicationYear) => {
    // Nếu publication_year là năm (number hoặc string), tạo Date object với ngày 1/1 của năm đó
    if (typeof publicationYear === 'number' || (typeof publicationYear === 'string' && /^\d{4}$/.test(publicationYear))) {
        return `${publicationYear}-01-01`;
    }
    // Nếu đã là format date, return as is
    if (typeof publicationYear === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(publicationYear)) {
        return publicationYear;
    }
    // Nếu là Date object
    if (publicationYear instanceof Date) {
        return toSQLDate(publicationYear);
    }
    // Default fallback
    return `${new Date().getFullYear()}-01-01`;
};

const calculateFine = (dueDate) => {
    const finePerHour = 0.1;
    const today = new Date();
    const jsDueDate = new Date(dueDate);
    if (today > jsDueDate) {
        const lateHours = Math.ceil((today - jsDueDate) / (1000 * 60 * 60));
        const fine = lateHours * finePerHour;
        return fine;
    }
    return 0;
}

const getAllBookIssue = CatchAsyncErrors(async (req, res, next) => {
    const result = await BookIssueModel.getAllBookIssue();
    res.status(200).json({
        success: true,
        data: result
    })
})

const getBookIssueById = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const result = await BookIssueModel.getBookIssueById(id);
    if (!result) {
        return next(new ErrorHandler("Book issue not found", 404));
    }
    res.status(200).json({
        success: true,
        data: result
    })
})

const deleteBookIssue = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const result = await BookIssueModel.deleteBookIssue(id);
    if (!result) {
        return next(new ErrorHandler("Book Issue Not Exist", 404));
    }
    res.status(200).json({
        success: true,
        data: result
    })
})

const getAllBookRequest = CatchAsyncErrors(async (req, res, next) => {
    const result = await BookRequestModel.getAllBookRequest();
    res.status(200).json({
        success: true,
        data: result
    })
})

const getBookRequestById = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const result = await BookRequestModel.getBookRequestById(id);

    if (!result) {
        return next(new ErrorHandler("Book Request Not Exist", 404));
    }
    res.status(200).json({
        success: true,
        data: result
    })
})

const deleteBookRequest = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const result = await BookRequestModel.deleteBookRequest(id);
    if (!result) {
        return next(new ErrorHandler("Book Request Not Exist", 404));
    }
    res.status(200).json({
        success: true,
        data: result
    })
})

const borrowBook = CatchAsyncErrors(async (req, res, next) => {
    const { book_id, student_id } = req.body;
    const book = await BookModel.getBookById(book_id);

    if (!book) {
        return next(new ErrorHandler("Book Not Exist", 400));
    }

    const student = await StudentModel.getStudentById(student_id);

    if (!student) {
        return next(new ErrorHandler("Student Not Exist", 400));
    }
    
    const bookissues = await BookIssueModel.getBookIssueByStudentBook(book_id, student_id);
    const isAlreadyBorrowed = bookissues.some(issue => issue.status === 'issuing');

    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("Book Already Borrowed", 400));
    }
    
    const request_date = toSQLDate(new Date());
    const result = await BookRequestModel.createBookRequest(book_id, student_id, request_date);
    res.status(200).json({
        success: true,
        data: result
    })
})

const issueBook = CatchAsyncErrors(async (req, res, next) => {
    const request_id = req.params.id;
    const request = await BookRequestModel.getBookRequestById(request_id);
    if (!request) {
        return next(new ErrorHandler("Request Not Exist", 400));
    }
    
    const { book_id, student_id, request_date } = request;

    const student = await StudentModel.getStudentById(student_id);
    if (!student) {
        return next(new ErrorHandler("Student Not Exist", 400));
    }
    
    const book = await BookModel.getBookById(book_id);
    if (!book) {
        return next(new ErrorHandler("Book Not Exist", 400));
    }
    
    if (book.quantity === 0) {
        return next(new ErrorHandler("Book Not Available", 400));
    }
    
    const bookissues = await BookIssueModel.getBookIssueByStudentBook(book_id, student_id);
    const isAlreadyBorrowed = bookissues.some(issue => issue.status === 'issuing');

    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("Book Already Borrowed", 400));
    }
    
    const quantity = book.quantity - 1;
    let availability = quantity > 0 ? "available" : "unavailable";
    
    // Fix: Sử dụng formatPublicationYear thay vì toSQLDate cho publication_year
    const publication_year = formatPublicationYear(book.publication_year);
    const result0 = await BookModel.updateBook(
        book_id, 
        book.title, 
        book.publisher_id, 
        publication_year, 
        quantity, 
        availability, 
        book.price, 
        book.author,
        book.image_url
    );

    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const sqlIssueDate = toSQLDate(issueDate);
    const sqlDueDate = toSQLDate(dueDate);

    const status1 = "issuing";
    const status2 = "approved";

    const result1 = await BookIssueModel.createBookIssue(
        book_id, 
        student_id, 
        sqlIssueDate, 
        sqlDueDate, 
        null, 
        null, 
        status1
    );
    const result2 = await BookRequestModel.updateBookRequest(
        request_id, 
        book_id, 
        student_id, 
        request_date, 
        status2
    );

    res.status(200).json({
        success: true,
        data0: result0,
        data1: result1,
        data2: result2
    })
})

const rejectBookRequest = CatchAsyncErrors(async (req, res, next) => {
    const request_id = req.params.id;
    const request = await BookRequestModel.getBookRequestById(request_id);

    if (!request) {
        return next(new ErrorHandler("Request Not Exist", 400));
    }

    const { book_id, student_id, request_date } = request;
    const student = await StudentModel.getStudentById(student_id);
    if (!student) {
        return next(new ErrorHandler("Student Not Exist", 400));
    }
    const book = await BookModel.getBookById(book_id);
    if (!book) {
        return next(new ErrorHandler("Book Not Exist", 400));
    }
    
    const status = "rejected";
    const result = await BookRequestModel.updateBookRequest(
        request_id,
        book_id,
        student_id,
        request_date,
        status
    );

    res.status(200).json({
        success: true,
        message: "Book request rejected",
        data: result,
    });
});

const returnBook = CatchAsyncErrors(async (req, res, next) => {
    const issue_id = req.params.id;
    const issue = await BookIssueModel.getBookIssueById(issue_id);
    if (!issue) {
        return next(new ErrorHandler("Issue Not Exist", 400));
    }
    
    const { book_id, student_id, issue_date, due_date, return_date, fine_amount, status } = issue;
    const student = await StudentModel.getStudentById(student_id);

    if (!student) {
        return next(new ErrorHandler("Student Not Exist", 400));
    }
    
    const book = await BookModel.getBookById(book_id);
    if (!book) {
        return next(new ErrorHandler("Book Not Exist", 400));
    }
    
    const bookissues = await BookIssueModel.getBookIssueByStudentBook(book_id, student_id);
    const isAlreadyBorrowed = bookissues.some(issue1 => issue1.status === 'issuing');

    if (!isAlreadyBorrowed) {
        return next(new ErrorHandler("You have not borrowed this book", 400));
    }
    
    let quantity = book.quantity + 1;
    let availability = quantity > 0 ? "available" : "unavailable";
    
    // Fix: Sử dụng formatPublicationYear thay vì toSQLDate cho publication_year
    const publication_year = formatPublicationYear(book.publication_year);
    const result0 = await BookModel.updateBook(
        book_id, 
        book.title, 
        book.publisher_id, 
        publication_year, 
        quantity, 
        availability, 
        book.price, 
        book.author,
        book.image_url
    );

    const returnDate = toSQLDate(new Date());
    const fine = calculateFine(due_date);
    const newstatus = "returned";

    const result = await BookIssueModel.updateBookIssue(
        issue_id, 
        book_id, 
        student_id, 
        issue_date, 
        due_date, 
        returnDate, 
        fine, 
        newstatus
    );

    res.status(200).json({
        success: true,
        data0: result0,
        data1: result
    })
})

module.exports = {
    getAllBookIssue,
    getAllBookRequest,
    getBookIssueById,
    getBookRequestById,
    deleteBookIssue,
    deleteBookRequest,
    borrowBook,
    issueBook,
    returnBook,
    rejectBookRequest
}