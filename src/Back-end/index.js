require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/authRoute');
const studentRoute = require('./routes/studentRoutes');
const adminRoute = require('./routes/adminRoute');
const librarianRoute = require('./routes/librarianRoutes');
const {errorMiddleware} = require('./middlewares/errorMiddlewares');


const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/students', studentRoute);
app.use('/api/admins', adminRoute);
app.use('/api/librarians', librarianRoute);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
console.log('JWT_SECRET:', process.env.JWT_SECRET);
app.use(errorMiddleware);


