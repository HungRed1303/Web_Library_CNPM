const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const StudentModel = require('../models/studentModel');
const LibrarianModel = require('../models/librarianModel');
const AdminModel = require('../models/adminModel');

const register = CatchAsyncErrors(async (req, res, next) => {
  const { username, email, password, name, role } = req.body;

  const existingUser = await UserModel.findUserByEmail(email);
  if (existingUser) {
    return next(new ErrorHandler('Email already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user chính trong bảng users
  const newUser = await UserModel.createUser(username, hashedPassword, email, name, role);

  // Ghi vào bảng phụ dựa theo role
  const user_id = newUser.user_id;
  if (role === 'S') {
    await StudentModel.createStudent(user_id);
  } else if (role === 'L') {
    await LibrarianModel.createLibrarian(user_id);  // bạn cần có hàm này
  } else if (role === 'A') {
    await AdminModel.createAdmin(user_id);          // bạn cần có hàm này
  }

  res.status(201).json({
    success: true,
    user: {
      id: user_id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
  });
});


const login = CatchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findUserByEmail(email);
  if (!user) return next(new ErrorHandler('Invalid email or password', 401));
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler('Invalid email or password', 401));

  const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res
  .cookie("token",token,{
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
    ),
    httpOnly: true
  })
  .json({
    success: true,
    token,
    user: {
      id: user.user_id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

const logout = CatchAsyncErrors(async (req,res,next)=>{
  res
  .status(200)
  .cookie("token", "",{
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  .json({
    success: true,
    message:"Logged out successfully"
  })
});

module.exports = {
  register,
  login,
  logout
};