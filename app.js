const express = require("express");
const morgan = require("morgan");
var app = express();
const logger = require("morgan");

const taskRoutes = require("./api/routes/tasks");
//logger
app.use(morgan("dev"));

//use() - middleware stack
app.use("/tasks", taskRoutes);

//handling ERRORS
app.use((req, res, next) => {
  const error = new Error("Not found");//Client can communicate but we cannot response on request
  error.status = 404;
  next(error); // forward this error
});
//above if cannot properly response on Request

app.use((error, req, res, next) => {
 res.status(error.status || 500);
 res.json({
  error: {
    message: error.message,
  }
 });
});//above if some kind of server error was happen

module.exports = app;