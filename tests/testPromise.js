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
function lookupRestaurant(x) {
   return new Promise(function(resolve, reject) {

         // setup returnVal to pass down the chain.
         var returnVal = {
            restId: 1,
            foodCategoryName: "tester1"
         };

         resolve(returnVal);
   });
}  


// create a promise
function lookupFoodCategory(val) {
   return new Promise(function(resolve, reject) {

      var restId = val.restId;
      var foodCategoryName = val.foodCategoryName;
      
      resolve(val);
   });
} 


describe('Test Menu', function() { 
      
    
  it ('test Add Menu Pastas', function(done) {
             
      lookupRestaurant("River Cafe", "Pastas")
      .then(function(val) {
         console.log("1");
         //return lookupFoodCategory(val);
         return Promise.reject("error!");
      })
      .then(function(val) {
         console.log("2");
         done();
         return lookupFoodCategory(val);
      })
      .catch(function(err) {
         console.log("err = " + err);
         done(err);
      });  
  });
    
   
    
});