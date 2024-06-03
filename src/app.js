// imports
const express = require("express");
const cors = require('cors');
const httpStatus = require('http-status');
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require("./middlewares/error");

const routes = require('./routes/v1');


// app
const app = express();

// Serve static files from the "public" directory
app.use('/static', express.static(path.join(__dirname,'public')));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
