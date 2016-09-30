//var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var FoodCategory = require("../../models/foodCategory");

var category = {
  
   findAll: function(req, res, next) {
   
      var restaurantId = req.params.rId;
      
      FoodCategory.find()
      .where('restaurant', restaurantId)
      .sort({seqNum: 1})
      .exec(function (err, obj) {
            if (err) { next(err); return; }
         
            res.json(obj);
          
      });

   }

};


module.exports = category;