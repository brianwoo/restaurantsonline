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

var Table = require('../models/table');
var Restaurant = require('../models/restaurant');

//chai.use(chaiHttp);


describe('Test Table', function() { 
    
  it('test ADD Tables', function(done) {
      
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
    
});