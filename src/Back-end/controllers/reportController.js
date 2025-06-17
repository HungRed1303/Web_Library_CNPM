const ReportModel = require('../models/reportModel');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');

function toSQLDate(date) {
  const d = new Date(date); // chuyển đổi để đảm bảo là Date object
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

const getTotalTypeOfBook = CatchAsyncErrors(async(req,res)=>{
  const result =await ReportModel.getTotalTypeOfBooks();

  if(!result){
    return next( new ErrorHandler("There is no type of book",404));
  }

  res.status(200).json({
    success: true,
    data: result
  })
})

const getTotalIssuedBook = CatchAsyncErrors(async(req,res)=>{
  const result =await ReportModel.getTotalIssuedBook();

  if(!result){
    return next( new ErrorHandler("There is no issued book",404));
  }

  res.status(200).json({
    success: true,
    data: result
  })
})

const getTotalStudent = CatchAsyncErrors(async(req,res)=>{
  const result =await ReportModel.getTotalStudent();

  if(!result){
    return next( new ErrorHandler("There is no student",404));
  }

  res.status(200).json({
    success: true,
    data: result
  })
})

const getTotalBook = CatchAsyncErrors(async(req,res)=>{
  const result =await ReportModel.getTotalBook();

  if(!result){
    return next( new ErrorHandler("There is no student",404));
  }

  res.status(200).json({
    success: true,
    data: result
  })
})
const getNumberBookByGenre = CatchAsyncErrors(async(req,res)=>{
  const result =await ReportModel.getNumberBookByGenre();

  if(!result){
    return next( new ErrorHandler("There is no book",404));
  }

  res.status(200).json({
    success: true,
    data: result
  })
})

const getTopReader =  CatchAsyncErrors(async(req,res)=>{
  const {top_k} = req.body
  const result =await ReportModel.getTopReader(top_k);

  if(!result){
    return next( new ErrorHandler("There is no reader",404));
  }

  res.status(200).json({
    success: true,
    data: result
  })
})

const getIssueReturnBookWeek = CatchAsyncErrors(async(req,res)=>{
  const {start_date,end_date} = req.body
  const new_start_date = toSQLDate(start_date)
  const new_end_date = toSQLDate(end_date)
  const result =await ReportModel.getIssueReturnBookWeek(new_start_date,new_end_date);

  if(!result){
    return next( new ErrorHandler("There is no issue/return book",404));
  }

  res.status(200).json({
    success: true,
    data: result
  })
})


module.exports = {
    viewReport,
    getTotalTypeOfBook,
    getTotalIssuedBook,
    getTotalStudent,
    getTotalBook,
    getNumberBookByGenre,
    getTopReader,
    getIssueReturnBookWeek
}