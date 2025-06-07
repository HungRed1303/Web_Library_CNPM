const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const BookIssueModel = require('../models/bookissueModel')

const viewBorroingHistoryById = CatchAsyncErrors(async (req,res,next)=>{
    const student_id = req.params.id;
    const bookissue = await BookIssueModel.getBookIssueByIdStudent(student_id);

    res.status(200).json({
        success:true,
        data: bookissue
    })
})

module.exports = {
    viewBorroingHistoryById
}