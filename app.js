var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); 

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

var userDB = require("./userDB")

userDB.init()

app.get("/users", function(req, res){

	var users = userDB.all()

	res.json(users)
})

app.get("/users/driver", function(req, res){

	var users = userDB.driver()

	res.json(users)
})

app.get("/users/rider", function(req, res){
	var users = userDB.rider()
	res.json(users)
})

app.get("/users/:userId", function(req, res){
	var user = userDB.find(req.params.userId)
	res.json(user)
})

module.exports = app;