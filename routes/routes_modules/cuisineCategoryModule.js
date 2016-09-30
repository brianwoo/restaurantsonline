//var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var CuisineCategory = require("../../models/cuisineCategory");

var category = {
  
   findAll: function(req, res, next) {
   
      
      CuisineCategory.find({})
      .exec(function (err, obj) {
            if (err) { next(err); return; }
         
            res.json(obj);
          
      });

   }

};


module.exports = category;