const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/errorMiddlewares');
const StudentModel = require('../models/studentModel');
const LibrarianModel = require('../models/librarianModel');
const AdminModel = require('../models/adminModel');
const sendEmail = require('../utils/sendEmail');
const { generationForgotPasswordEmailTemplate } = require('../utils/emailTemplates');
const { getResetPasswordToken } = require('../models/userModel');

const register = CatchAsyncErrors(async (req, res, next) => {
  const { username, email, password, name, role = 'S' } = req.body;

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
  if (!email || !password) {
    return next(new ErrorHandler('Email and password are required', 400));
  }
  const user = await UserModel.findUserByEmail(email);
  if (!user) return next(new ErrorHandler('Invalid email or password', 401));
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler('Invalid email or password', 401));

  const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  // --- Bổ sung lấy student_id nếu là sinh viên ---
  let student_id = null;
  if (user.role === 'S') {
    const student = await StudentModel.getStudentByUserId(user.user_id);
    if (student) student_id = student.student_id;
  }

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
      student_id,
    },
  });
});

const verifyOTP = CatchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findUserByEmail(email);
    if (!user) return next(new ErrorHandler('User not found', 404));

    // Verify OTP logic here
    // Assuming you have a method to verify OTP
    const isOtpValid = await UserModel.verifyOtp(user.user_id, otp);
    if (!isOtpValid) return next(new ErrorHandler('Invalid OTP', 400));

    // If OTP is valid, update user status or perform any other action
    await UserModel.updateUserStatus(user.user_id, 'verified');

  } catch (error) {
    return next(new ErrorHandler('Error verifying OTP', 500));
  }

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    user: {
      id: user.user_id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

const forGotPassword = CatchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler('Email is required', 400));
  }

  const user = await UserModel.findUserByEmail(email);
  if (!user) return next(new ErrorHandler('User not found', 404));

  // Tạo reset token
  const { resetToken, hashedToken, expires } = getResetPasswordToken();

  // Cập nhật vào DB
  await UserModel.updateResetToken(email, hashedToken, expires);

  // Tạo link đặt lại mật khẩu
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = await generationForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Web Librarian Password Recovery",
      message
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    console.error('Error sending reset password email:', error); // Log lỗi chi tiết ra console
    // Nếu lỗi gửi email, xóa token trong DB
    await UserModel.clearResetToken(email);
    return next(new ErrorHandler('Error sending reset password email', 500));
  }

});

const resetPassword = CatchAsyncErrors(async (req, res, next) => {
  const token = req.params.token;
  const { newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return next(new ErrorHandler('Token and new password are required', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler('Passwords do not match', 400));
  }

  // Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Tìm user theo token
  const user = await UserModel.findUserByResetToken(token);
  if (!user) return next(new ErrorHandler('Invalid or expired token', 400));

  // Cập nhật mật khẩu mới
  await UserModel.updatePassword(user.email, hashedPassword);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
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

const changePassword = CatchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.user_id;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler('All fields are required', 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler('New passwords do not match', 400));
  }

  const user = await UserModel.findUserById(userId);
  if (!user) return next(new ErrorHandler('User not found', 404));

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return next(new ErrorHandler('Old password is incorrect', 401));

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await UserModel.updatePassword(user.email, hashedNewPassword);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  register,
  login,
  forGotPassword,
  resetPassword,
  logout,
  changePassword,
};