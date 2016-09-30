var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();

var mongoose = require("mongoose");
var config = require('../config');

// Connect to MongoDB through Mongoose
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to database server");
});

var Menu = require('../models/menu');
var Restaurant = require('../models/restaurant');
var FoodCategory = require('../models/foodCategory');

//chai.use(chaiHttp);


// create a lookupRestaurant promise
function lookupRestaurant(restName, foodCategoryName) {
   return new Promise(function(resolve, reject) {

      Restaurant.find({name: restName})
      .exec(function(err, obj) {

         var restId = obj[0]._id;
         //console.log("Restaurant=" + restId);

         // setup returnVal to pass down the chain.
         var returnVal = {
            restId: restId,
            foodCategoryName: foodCategoryName 
         };

         resolve(returnVal);

      })
   });
};  


// create a promise
function lookupFoodCategory(val) {
   return new Promise(function(resolve, reject) {

      var restId = val.restId;
      var foodCategoryName = val.foodCategoryName;

      FoodCategory.find({restaurant: restId, categoryName: foodCategoryName})
      .exec(function(err, foodCategory) {

         //console.log("Restaurant=" + restId);
         //console.log("foodCategory=" + foodCategory[0]._id);

         // setup returnVal to pass down the chain.
         var returnVal = {
            restId: restId,
            foodCategoryId: foodCategory[0]._id
         };

         resolve(returnVal);

      })
   });
}; 


describe('Test Menu', function() { 
      
    
  it ('test Add Menu Pastas', function(done) {
             
      lookupRestaurant("River Cafe", "Pastas")
      .then(function(val) {
         return lookupFoodCategory(val);
         
      }).then(function(val) {
         
         var menu = [
            { restaurant: val.restId, foodCategory: val.foodCategoryId, dishName: "Seafood Pasta", 
             dishDesc: "Jumbo shrimps with zesty garlic sauce", dishPrice: "$25.95", seqNum: 3},
            { restaurant: val.restId, foodCategory: val.foodCategoryId, dishName: "Chicken and Mushrooms Pasta", 
             dishDesc: "Chicken penne with mushrooms in spicy tomato sauce", dishPrice: "$23.00", seqNum: 2 },            
         ];
         
         for (var i=0; i < menu.length; i++) {
            Menu.create(menu[i], function (err, obj) {
               if (err) {console.log(err); done(err); reject(err); throw err;}
               console.log('menu created!');  
               //resolve(val);
            });            
         }
         
         done();
      });  
  });
    
   
  it ('test Add Menu Appetizers', function(done) {
             
      lookupRestaurant("River Cafe", "Appetizers")
      .then(function(val) {
         return lookupFoodCategory(val);
         
      }).then(function(val) {
         
         var menu = [
            { restaurant: val.restId, foodCategory: val.foodCategoryId, dishName: "Caesar's Salad", 
             dishDesc: "Fresh Lettice with signature Caesar's dressing", dishPrice: "$10.00", seqNum: 1 }          
         ];
         
         for (var i=0; i < menu.length; i++) {
            Menu.create(menu[i], function (err, obj) {
               if (err) {console.log(err); done(err); reject(err); throw err;}
               console.log('menu created!');  
               //resolve(val);
            });            
         }
         
         done();
      });  
  });   
   
  it ('test Add Menu Pizzas', function(done) {
             
      lookupRestaurant("River Cafe", "Pizzas")
      .then(function(val) {
         return lookupFoodCategory(val);
         
      }).then(function(val) {
         
         var menu = [
            { restaurant: val.restId, foodCategory: val.foodCategoryId, dishName: "Chicken Deluxe Pizza", 
             dishDesc: "Our signature pizza with tender chicken meat", dishPrice: "$17.00", seqNum: 4}          
         ];
         
         for (var i=0; i < menu.length; i++) {
            Menu.create(menu[i], function (err, obj) {
               if (err) {console.log(err); done(err); reject(err); throw err;}
               console.log('menu created!');  
               //resolve(val);
            });            
         }
         
         done();
      });  
  });   
    
   
  it ('test Add Menu Dessert', function(done) {
             
      lookupRestaurant("River Cafe", "Dessert")
      .then(function(val) {
         return lookupFoodCategory(val);
         
      }).then(function(val) {
         
         var menu = [
            { restaurant: val.restId, foodCategory: val.foodCategoryId, dishName: "Chocolate Icecream", 
             dishDesc: "Chocolate icecream with real Belgium dark chocolate", dishPrice: "$15.00", seqNum: 5}          
         ];
         
         for (var i=0; i < menu.length; i++) {
            Menu.create(menu[i], function (err, obj) {
               if (err) {console.log(err); done(err); reject(err); throw err;}
               console.log('menu created!');  
            });            
         }
         
         done();
      });  
  });    
    /*
  it('test ADD Menu', function(done) {
      
      Restaurant.find({name: "River Cafe"})
      .exec(function(err, obj) {
          
          var restId = obj[0]._id;
          console.log("Restaurant=" + restId);

          var table1 = {  
              restaurant: restId,
              tableNum: "1",
              fitNumPeopleMin: 1,
              fitNumPeopleMax: 2
          };
          
          var table2 = {  
              restaurant: restId,
              tableNum: "2",
              fitNumPeopleMin: 1,
              fitNumPeopleMax: 2
          };
          
          var table3 = {  
              restaurant: restId,
              tableNum: "3",
              fitNumPeopleMin: 3,
              fitNumPeopleMax: 4
          };
          
          var table4 = {  
              restaurant: restId,
              tableNum: "4",
              fitNumPeopleMin: 3,
              fitNumPeopleMax: 4
          };          
          
          var table5 = {  
              restaurant: restId,
              tableNum: "5",
              fitNumPeopleMin: 5,
              fitNumPeopleMax: 8
          };          
          
          var table6 = {  
              restaurant: restId,
              tableNum: "6",
              fitNumPeopleMin: 5,
              fitNumPeopleMax: 8
          };          
                              
          Table.create(table1, function (err, obj) {
              if (err) {done(err); throw err;}
              console.log('foodCat1 created!');
              
              Table.create(table2, function (err, obj) {
                if (err) {done(err); throw err;}
                  console.log('foodCat2 created!');
              
                  Table.create(table3, function (err, obj) {
                    if (err) {done(err); throw err;}
                    console.log('foodCat3 created!');
                      
                    Table.create(table4, function (err, obj) {
                        if (err) {done(err); throw err;}
                        console.log('foodCat4 created!');       
                        
                        Table.create(table5, function (err, obj) {
                            if (err) {done(err); throw err;}
                            console.log('foodCat4 created!');    
                      
                            Table.create(table6, function (err, obj) {
                                if (err) {done(err); throw err;}
                                console.log('foodCat4 created!');  
                                done();
                            });
                        });        
                    });
                  });
              });
          });
      });    
    
  });
  */
    
});
