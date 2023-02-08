const express = require('express');
var app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');

//CORS handling for RESTful API - communication from another PORTS
//catch all requests and pass CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); //access to any origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin. X-Requested-With, Content-Type, Accept, Authorization'
  );//set accepted Header Types
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});//return empty JSON with HTTP status 'OK'
  }//if request method is 'OPTION' we set which we allow 

  next();//PASS Incoming Request to the next Route
});
const taskRoutes = require('./api/routes/tasks');

//logger(Morgan Package)
app.use(logger('dev'));

app.use(bodyParser.urlencoded({extended: false}));//only simple bodies
app.use(bodyParser.json());//want json to be used.

//use() - middleware stack
app.use('/tasks', taskRoutes);

//handling ERRORS
app.use((req, res, next) => {
  const error = new Error('Not found'); //Client can communicate but we cannot response on request
  error.status = 404;
  next(error); // forward this error
});
//above if cannot properly response on Request

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
}); //above if some kind of server error was happen

module.exports = app;
