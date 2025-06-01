require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/authRoute');
const studentRoute = require('./routes/studentRoutes');
const adminRoute = require('./routes/adminRoute');
const librarianRoute = require('./routes/librarianRoutes');
const publisherRoute = require('./routes/publisherRoute');
const bookRoute = require('./routes/bookRoute');
const categoryRoute = require("./routes/categoryRoute")
const borrowRoute = require("./routes/borrowRoute")
const findRoute = require("./routes/findRoute")
const wishlistRoute = require("./routes/wishlistRoute")
const librarycardRoute = require("./routes/librarycardRoute")
const borrowinghistoryRoute = require("./routes/borrowinghistoryRoute")
const reportRoute = require("./routes/reportRoute")
const {errorMiddleware} = require('./middlewares/errorMiddlewares');
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const { notifyStudents } = require('./services/notifyStudents');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use(cookieParser()); 



app.use('/api/auth', authRoute);
app.use('/api/students', studentRoute);
app.use('/api/admins', adminRoute);
app.use('/api/librarians', librarianRoute);
app.use('/api/publishers', publisherRoute); 
app.use('/api/books',bookRoute);
app.use('/api/categories',categoryRoute);
app.use('/api/borrow',borrowRoute);
app.use('/api/find',findRoute);
app.use('/api/wishlist',wishlistRoute);
app.use('/api/librarycard',librarycardRoute);
app.use('/api/borrowinghistory',borrowinghistoryRoute);
app.use('/api/report',reportRoute);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// notifyStudents(); 

