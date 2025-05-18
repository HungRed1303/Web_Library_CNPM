const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');

const register = CatchAsyncErrors(async (req, res, next) => {
  const { username, email, password, name, role } = req.body;

  const existingUser = await UserModel.findUserByEmail(email);
  if (existingUser) {
    return next(new ErrorHandler('Email already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserModel.createUser(username, hashedPassword, email, name, role);

  res.status(201).json({
    success: true,
    user: {
      id: newUser.user_id,
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

  res.json({
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

module.exports = {
  register,
  login,
};