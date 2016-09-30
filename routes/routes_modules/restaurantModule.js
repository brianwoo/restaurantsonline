//var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Restaurant = require("../../models/restaurant");

var restaurant = {
  
   findAll: function(req, res, next) {
   
      Restaurant.find({})
      .select("name address cuisineCategory cuisineDesc cost mainPhoto")
      .exec(function (err, obj) {
            if (err) { next(err); return; }
         
            res.json(obj);
          
    });
   },
   
   findById: function(req, res, next) {
      
      Restaurant.findById(req.params.rId)
      .exec(function (err, obj) {
            if (err) { next(err); return; }
         
            res.json(obj);
      });
   },
   
};


module.exports = restaurant;