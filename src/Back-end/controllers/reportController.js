const ReportModel = require('../models/reportModel');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');

const viewReport = CatchAsyncErrors(async (req, res) => {
  const { type } = req.body;
  let result;

    switch(type) {
      case 'borrowed_books':
        result = await ReportModel.getBorrowedBooks(); break;
      case 'borrow_date':
        result = await ReportModel.getBorrowDates(); break;
      case 'due_date':
        result = await ReportModel.getDueDates(); break;
      case 'overdue':
        result = await ReportModel.getOverdueBooks(); break;
      case 'user_stats':
        result = await ReportModel.getUserStatistics(); break;
      default:
        return next(new ErrorHandler("Not Filled",400))
    }

    res.status(200).json({ success: true, data: result });
  
});

module.exports = {
    viewReport
}