const CatchAsyncErrors = require("../middlewares/catchAsyncErrors");
const {ErrorHandler} = require("../middlewares/errorMiddlewares");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const isAuthenticated = CatchAsyncErrors(async (req,res,next)=>{
    let token = req.cookies.token;
    
    // Fallback to Authorization header
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '');
    }
    
    if(!token){
        return next(new ErrorHandler("User is not authenticated.",400));
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = await UserModel.findUserById(decoded.id);
    next();
});

const isAuthorized = (...roles)=>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next (
                new ErrorHandler(
                    `User with this role ${req.user.role} not allowed to access this resource`,
                    400
                )
            );
        }
        next();
    }
}

module.exports ={
    isAuthenticated,
    isAuthorized
}

