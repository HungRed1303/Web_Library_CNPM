const CatchAsyncErrors = require('../middlewares/catchAsyncErrors')
const {ErrorHandler}= require('../middlewares/errorMiddlewares')
const WishlistModel = require("../models/wishlistModel")

const toSQLDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const getWishListByStudentId = CatchAsyncErrors(async (req,res,next)=>{
    const student_id = req.params.id;
    const books = await WishlistModel.getAllWishListByIdStudent(student_id);
    if(!books){
        return next(new ErrorHandler("Book not exist in wishlist",404));
    }
    res.status(200).json({
        success: true,
        data: books
    }) 
})

const insertBookWishList = CatchAsyncErrors(async (req,res,next)=>{
    const {student_id,book_id} = req.body;
   const created_date = toSQLDate(new Date());
    const result = await WishlistModel.insertBookWishList(student_id,book_id,created_date);
    res.status(200).json({
        success: true,
        data: result
    })
})

const deleteBookWishList = CatchAsyncErrors(async (req,res,next)=>{
    const {student_id,book_id} = req.body;
    const result = await WishlistModel.deleteBookWishList(student_id,book_id);

    if(!result){
        return next(new ErrorHandler("Book not exist in wishlist",404));

    }
    res.status(200).json({
        success: true,
        data: result
    })
})

module.exports ={
    getWishListByStudentId,
    insertBookWishList,
    deleteBookWishList
}