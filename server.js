const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const color = require('colors');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db')
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// load env vars 
dotenv.config({ path: './config/config.env' });

// DataBase 
connectDB();
const app = express();

// Body parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File Uploading
app.use(fileUpload());

// set static folder

app.use(express.static(path.join(__dirname, 'public')));


// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

app.use(errorHandler);





const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // close server & exit process
    server.close(() => process.exit(1));
})