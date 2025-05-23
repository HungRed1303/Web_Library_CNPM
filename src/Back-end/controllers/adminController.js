const AdminModel = require('../models/adminModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');

const getAllAdmin = CatchAsyncErrors(async (req, res, next) => {
    const admins = await AdminModel.getAllAdmin();
    res.status(200).json({
        success: true,
        data: admins
    });
});

const getAdminById = CatchAsyncErrors(async (req, res, next) => {
    const admin_id = req.params.id;
    const admin = await AdminModel.getAdminById(admin_id);
    if (!admin) {
        return next(new ErrorHandler('Admin not found', 404));
    }
    res.status(200).json({
        success: true,
        data: admin
    });
});


const updateAdmin = CatchAsyncErrors(async (req, res, next) => {
    const admin_id = req.params.id;
    const { username, email, name } = req.body;
    const admin = await AdminModel.updateAdmin(admin_id, username, email, name);
    if (!admin) {
        return next(new ErrorHandler('Admin not found', 404));
    }
    res.status(200).json({
        success: true,
        data: admin
    });
});

const deleteAdmin = CatchAsyncErrors(async (req, res, next) => {
    const admin_id = req.params.id;
    const admin = await AdminModel.deleteAdmin(admin_id);
    if (!admin) {
        return next(new ErrorHandler('Admin not found', 404));
    }
    res.status(200).json({
        success: true,
        data: admin
    });
});

module.exports = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
};