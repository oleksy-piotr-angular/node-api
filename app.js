const express = require("express");
var app = express();
//use() - middleware stack
app.use((req, res, next) => {
  res.status(200).json({
    message: "It works",
  });
});


module.exports = app;