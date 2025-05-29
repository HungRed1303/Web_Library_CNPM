const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const LibraryCardModel =require('../models/librarycardModel')

const toSQLDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const requestLibraryCard = CatchAsyncErrors(async(req,res,next)=>{
    const {student_id} = req.body;
    const student = await LibraryCardModel.getLibraryCardByStudentId(student_id);
    if(student){
        return next(new ErrorHandler("Library Card was request or existed",400));
    }
   
   const start_date = new Date();
   const end_date = new Date(start_date); // sao chép để tránh thay đổi start_date gốc
   end_date.setFullYear(end_date.getFullYear() + 1);
   const formatted_start = toSQLDate(start_date);
   const formatted_end = toSQLDate(end_date);

  const result = await LibraryCardModel.createLibraryCard(student_id,formatted_start,formatted_end, "pending");
  res.status(200).json({
    success:true,
    data:result
  })
})

const extendLibraryCard = CatchAsyncErrors(async(req,res,next)=>{
    const {student_id} = req.body;
    studentcard = await LibraryCardModel.getLibraryCardByStudentId(student_id);
    if(!studentcard){
        return next(new ErrorHandler("Library Card was not existed",404));
    }
   
   const start_date = new Date(studentcard.start_date);
   const end_date = new Date(studentcard.end_date); // sao chép để tránh thay đổi start_date gốc
   end_date.setFullYear(end_date.getFullYear() + 1);
   const formatted_start = toSQLDate(start_date);
   const formatted_end = toSQLDate(end_date);

  const result = await LibraryCardModel.updateLibraryCard(studentcard.card_id,student_id,formatted_start,formatted_end, "completed");
  res.status(200).json({
    success:true,
    data:result
  })
})

const acceptLibraryCard = CatchAsyncErrors(async(req,res,next)=>{
    const {student_id} = req.body;
    studentcard = await LibraryCardModel.getLibraryCardByStudentId(student_id);
    if(!studentcard){
        return next(new ErrorHandler("Library Card was not existed",404));
    }
   
   const start_date = new Date(studentcard.start_date);
   const end_date = new Date(studentcard.end_date); // sao chép để tránh thay đổi start_date gốc
   
   const formatted_start = toSQLDate(start_date);
   const formatted_end = toSQLDate(end_date);

  const result = await LibraryCardModel.updateLibraryCard(studentcard.card_id,student_id,formatted_start,formatted_end, "completed");
  res.status(200).json({
    success:true,
    data:result
  })
})

const deleteLibraryCard = CatchAsyncErrors( async (req,res,next)=>{
    const {student_id} = req.body;
    const card = await LibraryCardModel.getLibraryCardByStudentId(student_id);
    if(!card){
        return next( new ErrorHandler("Card Not Existed",404));

    }

    const result = await LibraryCardModel.deleteLibraryCard(card.card_id);
    
    res.status(200).json({
        success:true,
        data: result
    })
})
module.exports = {
    requestLibraryCard,
    extendLibraryCard,
    acceptLibraryCard,
    deleteLibraryCard
}