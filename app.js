var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var moment = require('moment'); // require
//console.log(moment())
 
const { Pool } = require('pg')
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "cobadb",
    password: "12345",
    port: 5432
})

//var indexRouter = require('./routes/index')(pool);
var usersRouter = require('./routes/users')(pool);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
