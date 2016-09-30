//var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Menu = require("../../models/menu");

var menu = {
  
   findAll: function(req, res, next) {
   
      var restaurantId = req.params.rId;
      
      Menu.find()
      .populate("foodCategory", "categoryName _id")
      .sort({"seqNum" : 1})
      .where('restaurant', restaurantId)
      .exec(function (err, obj) {
            if (err) { next(err); return; }
         
            //console.log(obj[1].dishPrice.toFixed(2));
            res.json(obj);
          
      });

   },
   
   
   findAllMenuItems: function(req, res, next) {
   
      var restaurantId = req.params.rId;
      
      Menu.aggregate([
        {"$match" : {
              "restaurant": mongoose.Types.ObjectId(restaurantId)
        }},      
        // Grouping pipeline
        { "$group": { 
            "_id": '$foodCategory',
            "menu": { $push:{ "seqNum": '$seqNum', dishName: "$dishName" }}
        }},
        // Sorting pipeline
        { "$sort": { "menu.seqNum": 1 }},          

      ],
      function(err,result) {

       // Result is an array of documents
       console.log(JSON.stringify(result));
       res.json(result);
      }
     );
   },
      
};


module.exports = menu;