const StudentModel = require('../models/studentModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');


const getAllStudent = CatchAsyncErrors(async (req, res, next) => {
    const students = await StudentModel.getAllStudent();
    res.status(200).json({
        success: true,
        data: students
    });
});

const getStudentById = CatchAsyncErrors(async (req, res, next) => {
    const student_id = req.params.id;
    const student = await StudentModel.getStudentById(student_id);
    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }
    res.status(200).json({
        success: true,
        data: student
    });
});

const updateStudent = CatchAsyncErrors(async (req, res, next) => {
    const student_id = req.params.id;
    const { username, email, name, class_id } = req.body;
    const student = await StudentModel.updateStudent(student_id, username, email, name, class_id);
    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }
    res.status(200).json({
        success: true,
        data: student
    });
});

const deleteStudent = CatchAsyncErrors(async (req, res, next) => {
    const student_id = req.params.id;
    const student = await StudentModel.deleteStudent(student_id);
    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }
    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    getAllStudent,
    getStudentById,
    updateStudent,
    deleteStudent
};