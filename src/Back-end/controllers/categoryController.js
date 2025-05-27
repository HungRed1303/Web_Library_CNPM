const CategoryModel = require("../models/categoryModel")
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors')
const {ErrorHandler}= require('../middlewares/errorMiddlewares');
const { get } = require("../routes/categoryRoute");

const getAllCategory = CatchAsyncErrors(async (req,res,next)=>{
    const categories = await CategoryModel.getAllCategory();
    res.status(200).json({
        success: true,
        data: categories
    })
});

const getCategoryById = CatchAsyncErrors(async (req, res,next)=>{
   const category_id = req.params.id;
   const category = await CategoryModel.getCategoryById(category_id);
   if(!category){
    return next(new ErrorHandler("Category Not Found",404))
   }
   res.status(200).json({
    success:true,
    data: category
   })
})

const createCategory = CatchAsyncErrors(async (req,res,next)=>{
    const {name,description} = req.body;
    const category = await CategoryModel.createCategory(name,description);
    
    res.status(200).json({
        success:true,
        data: category
    });
})

const updateCategory = CatchAsyncErrors(async (req,res,next)=>{
    const category_id = req.params.id;
    const {name,description} = req.body;
    const category = await CategoryModel.updateCategory(category_id,name,description);
    if(!category){
        return next(new ErrorHandler("Category Not Found",404));
    }
    res.status(200).json({
        success:true,
        data: category
    });
})

const deleteCategory = CatchAsyncErrors(async (req,res,next)=>{
    const category_id = req.params.id;
    const category = await CategoryModel.deleteCategory(category_id);
    if(!category){
        return next(new ErrorHandler("Category Not Found",404));
    }
    res.status(200).json({
        success:true,
        data: category
    })
})
module.exports ={
    getAllCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}