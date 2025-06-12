const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const BookIssueModel = require('../models/bookissueModel')

<<<<<<< HEAD
const viewBorrowingHistoryById = CatchAsyncErrors(async (req,res,next)=>{
=======
const viewBorroingHistoryById = CatchAsyncErrors(async (req,res,next)=>{
>>>>>>> 703fd227c6ec1c364b3a44c7bdb7e4a6c36232d1
    const student_id = req.params.id;
    const bookissue = await BookIssueModel.getBookIssueByIdStudent(student_id);
    


    res.status(200).json({
        success:true,
        data: bookissue
    })
})

module.exports = {viewBorrowingHistoryById}
