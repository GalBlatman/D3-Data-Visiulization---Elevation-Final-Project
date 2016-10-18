var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/data');

var app = express();

var Data = require("./models/DataModel");

app.use(bodyParser.json());   // This is the type of body we're interested in
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
})

app.get('/data', function (req, res) {
  Data.find(function (error, data) {
    res.send(data);
  });


});


app.listen(8000);