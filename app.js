var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); 

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

module.exports = app;
