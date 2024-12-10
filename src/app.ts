const express = require('express');
const path = require("path");
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
// const httpStatus = require('http-status');
import httpStatus from 'http-status'
const morgan = require('./config/morgan');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, '../../site/build')));
// app.use("/admin", express.static(path.join(__dirname, '../../admin/build')));



//admin url
// app.route('/admin/*')
//   .get(function (req, res) {
//     res.sendFile(path.join(__dirname, '../../admin/build/index.html'));
//   });

// limit repeated failed requests to auth endpoints
if (process.env.NODE_ENV === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

app.route('/').get((res: any) => {
  res.sendFile(path.join(__dirname, './Welcome.html'))
})

// front site url
// app.route('/*')
//   .get(function (req, res) {
//     res.sendFile(path.join(__dirname, '../../site/build/index.html'));
//   });

// send back a 404 error for any unknown api request
app.use((next: any) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
