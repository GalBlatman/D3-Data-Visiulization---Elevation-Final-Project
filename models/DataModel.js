var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DataSchema = new Schema({
  nodes: [{
    id: String,
    group: Number
  }],
  links: [{
    sourse: String,
    target: String,
    value: Number,
    label: Number    
  }]
});

var Data = mongoose.model("Data", DataSchema, "investments");
module.exports = Data;



