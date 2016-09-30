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

var CuisineCategory = require('../models/cuisineCategory');
var Restaurant = require('../models/restaurant');

//chai.use(chaiHttp);


describe('Test Cuisine Categories', function() {
    
  it('test get ALL cuisine categories', function(done) {
      CuisineCategory.find({})
        .exec(function(err, obj) {
          console.log(obj);
          done();
      })
  });     
    
  it('test ADD restaurants', function(done) {
      
      CuisineCategory.find({ $or: 
            [{categoryDesc: "Japanese"}, {categoryDesc: "Italian"}] })
      .sort({categoryDesc: 'asc'})
      .exec(function(err, obj) {
          
          var japCuisine = obj[1]._id;
          var itCuisine = obj[0]._id;
          console.log("Japanese=" + japCuisine);
          console.log("Italian=" + itCuisine);
          
          var restaurant1 = {
            name : "Ki Modern Japanese & Bar",
            address : "308 4 Ave SW, Calgary, AB T2P 0H7",
            lat : 51.05000,
            lon : -114.06821,
            cuisineDesc : [ "Japanese", "Sushi", "Izakaya Dishes" ],
            cost : { low: 15, high: 50 },
            paymentOptions : [ "VISA", "AMEX", "Mastercard" ],
            website : "http://www.ki-modern.com",
            phone : "392-234-5534",
            description : "This urbane eatery with an open-air bar offers refined Japanese eats such as sushi & izakaya dishes.",
            photos : [ "images/kimodern1.jpg", "images/kimodern2.jpg", "images/kimodern3.jpg" ],
            mainPhoto: "images/kimodernMain.jpg",
            businessHours : {
                monday : { open: "11am", close: "11pm" },
                tuesday : { open: "11am", close: "11pm" }, 
                wednesday : { open: "11am", close: "11pm" },
                thursday : { open: "11am", close: "11pm" },
                friday : { open: "11am", close: "11pm" },
                saturday : { open: "11am", close: "11pm" },
                sunday : { open: "11am", close: "11pm" }
            },
            cuisineCategory : japCuisine
          }; 
          
          var restaurant2 = {
            name : "La Caille",
            address : "100 La Caille Pl SW, Calgary, AB T2P 5E2",
            lat : 51.05223,
            lon : -114.07910,
            cuisineDesc : [ "Italian", "Fusion", "Gelato" ],
            cost : { low: 25, high: 50 },
            paymentOptions : [ "VISA", "AMEX", "Mastercard" ],
            website : "http://www.lacaille.com",
            phone : "392-493-9943",
            description : "Fine dining restaurant offering seasonal French dishes & a chef's tasting menu with wine pairings.",
            photos : [ "images/lacaille1.jpg", "images/lacaille2.jpg" ],
            mainPhoto: "images/lacailleMain.jpg",
            businessHours : {
                monday : { open: "9am", close: "11pm" },
                tuesday : { open: "9am", close: "11pm" }, 
                wednesday : { open: "9am", close: "11pm" },
                thursday : { open: "9am", close: "11pm" },
                friday : { open: "9am", close: "11pm" },
                saturday : { open: "9am", close: "11pm" },
                sunday : { open: "9am", close: "11pm" }
            }, 
            cuisineCategory : itCuisine
          };           
          
          var restaurant3 = {
            name : "River Cafe",
            address : "25 Prince's Island SW, Calgary, AB T2P 0R1",
            lat : 51.05334,
            lon : -114.07622,
            cuisineDesc : [ "Italian", "Coffee", "Pizza" ],
            cost : { low: 30, high: 75 },
            paymentOptions : [ "VISA", "AMEX", "Mastercard" ],
            website : "http://www.river-cafe.com",
            phone : "392-493-8888",
            description : "Upscale locally sourced meat & seafood entrees in an chic restored park concession building.",
            photos : [ "images/rivercafe1.jpg", "images/rivercafe2.jpg" ],
            mainPhoto: "images/rivercafeMain.jpg",
            businessHours : {
                monday : { open: "11am", close: "11pm" },
                tuesday : { open: "11am", close: "11pm" }, 
                wednesday : { open: "11am", close: "11pm" },
                thursday : { open: "11am", close: "11pm" },
                friday : { open: "11am", close: "11pm" },
                saturday : { open: "11am", close: "11pm" },
                sunday : { open: "11am", close: "11pm" }
            },
            cuisineCategory : itCuisine              
          };                     
          
          Restaurant.create(restaurant1, function (err, obj) {
              if (err) {done(err); throw err;}
              console.log('restaurant1 created!');
              
              Restaurant.create(restaurant2, function (err, obj) {
                if (err) {done(err); throw err;}
                  console.log('restaurant2 created!');
              
                  Restaurant.create(restaurant3, function (err, obj) {
                    if (err) {done(err); throw err;}
                    console.log('restaurant3 created!');
                    done();
                  });
              });
          });
      });
  });    
    
    
/*    
  it('test get ALL restaurants', function(done) {
      Restaurant.find({})
        .exec(function(err, obj) {
          console.log(obj);
          done();
      })
  });    
  */  

/*    
  it('insert', function(done) {
      
      var category = {
        categoryDesc: "Dummy"
      };
      
      CuisineCategory.create(category, function (err, dish) {
        if (err) throw err;
        console.log('category created!' + dish);
      });
      
      done();
  });    
  */  
    
});