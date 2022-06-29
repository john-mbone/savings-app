var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var savingsRouter = require('./routes/savings');
var membersRouter = require('./routes/members');
var transactionsRouter = require('./routes/transactions');
const auth = require("./middlewares/auth");

var app = express();
app.use(logger('dev'));
app.use(express.json());

// Protected APIs
app.use('/savings', auth, savingsRouter)
app.use('/transactions', auth, transactionsRouter)


// Unprotected APIs
app.use('/members', membersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.status(404).json({ status: false, message: `Path ${req.originalUrl} not found` })
});

module.exports = app;
