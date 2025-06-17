const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const BookIssueModel = require('../models/bookissueModel')

const viewBorrowingHistoryById = CatchAsyncErrors(async (req,res,next)=>{
    const student_id = req.params.id;
    const bookissue = await BookIssueModel.getBookIssueByIdStudent(student_id);
    if(!bookissue){
        return next(new ErrorHandler("Borrowing history not found",404));
    }
    res.status(200).json({
        success:true,
        data: bookissue
    })
})

module.exports = {viewBorrowingHistoryById}
