var chai = require('chai');
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

var CuisineCategory = require('../models/cuisineCategory');
var Restaurant = require('../models/restaurant');

//chai.use(chaiHttp);


describe('Test Cuisine Categories', function() {

  it('insert', function(done) {
      
    var category1 = { categoryDesc: "Japanese" };
    var category2 = { categoryDesc: "Korean" };
    var category3 = { categoryDesc: "Italian" };
    var category4 = { categoryDesc: "BBQ" };
      
    CuisineCategory.create(category1, function (err, dish) {
        if (err) throw err;
        console.log('category created!' + dish);
    });
      
    CuisineCategory.create(category2, function (err, dish) {
        if (err) throw err;
        console.log('category created!' + dish);
    });
    
    CuisineCategory.create(category3, function (err, dish) {
        if (err) throw err;
        console.log('category created!' + dish);
    });
    
    CuisineCategory.create(category4, function (err, dish) {
        if (err) throw err;
        console.log('category created!' + dish);
    });
      
    done();
  });    
    
    
    
  it('test get ALL cuisine categories', function(done) {
      CuisineCategory.find({})
        .exec(function(err, obj) {
          console.log(obj);
          done();
      })
  });     
    
/*    
  */  
    
});