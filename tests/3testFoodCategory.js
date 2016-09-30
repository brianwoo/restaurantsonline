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

var FoodCategory = require('../models/foodCategory');
var Restaurant = require('../models/restaurant');

//chai.use(chaiHttp);


describe('Test Food Categories', function() { 
    
  it('test ADD Food Categories', function(done) {
      
      Restaurant.find({name: "River Cafe"})
      .exec(function(err, obj) {
          
          var restId = obj[0]._id;
          console.log("Restaurant=" + restId);

          var foodCat1 = {  
              restaurant: restId,
              categoryName: "Appetizers",
              seqNum: 1
          };
          
          var foodCat2 = {  
              restaurant: restId,
              categoryName: "Pizzas",
              seqNum: 3
          };
          
          var foodCat3 = {  
              restaurant: restId,
              categoryName: "Pastas",
              seqNum: 2
          };
          
          var foodCat4 = {  
              restaurant: restId,
              categoryName: "Dessert",
              seqNum: 4
          };          
                             
          
          FoodCategory.create(foodCat1, function (err, obj) {
              if (err) {done(err); throw err;}
              console.log('foodCat1 created!');
              
              FoodCategory.create(foodCat2, function (err, obj) {
                if (err) {done(err); throw err;}
                  console.log('foodCat2 created!');
              
                  FoodCategory.create(foodCat3, function (err, obj) {
                    if (err) {done(err); throw err;}
                    console.log('foodCat3 created!');
                      
                    FoodCategory.create(foodCat4, function (err, obj) {
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