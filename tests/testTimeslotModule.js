var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();

var mongoose = require("mongoose");
var config = require('../config');

// Connect to MongoDB through Mongoose
//mongoose.connect(config.mongoUrl);
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function () {
    //// we're connected!
    //console.log("Connected correctly to database server");
//});


var timeslotModule = require("../routes/routes_modules/timeslotModule");



describe('Test timeslotModule', function() { 
      
    
   it ('test 1 table and 1 timeslot booked', function(done) {
             
     var tables = ["57083bd7d9e9145274b69210"];
     var resInfo = [
      {
        "table": "57083bd7d9e9145274b69210",
        "timeSlot": {
           "updatedAt": "2016-05-11T23:43:35.341Z",
           "createdAt": "2016-05-11T23:43:35.341Z",
           "timeSlot": 1,
           "from": "12:00am",
           "to": "12:30am",
           "_id": "5733c3a79e8f6931598e452d",
           "__v": 0
         },
        "_id": "573648e64e7558890d0f2755"
      }       
     ];
     
     
     var timeslotsAvailable = 
         timeslotModule.findAvailableTimeSlot(tables, resInfo);
     
     //console.log("map=" + JSON.stringify(timeslotsAvailable));
     
     assert.notInclude(timeslotsAvailable, 1, "1 shouldn't have been included");
     assert.equal(timeslotsAvailable.length, 47, "");
     
     done();
     
   });
    
   
   it ('test 2 tables and 1 timeslot booked', function(done) {
             
     var tables = ["57083bd7d9e9145274b69210", "57083bd7d9e9145274b69213"];
     var resInfo = [
      {
        "table": "57083bd7d9e9145274b69210",
        "timeSlot": {
           "updatedAt": "2016-05-11T23:43:35.341Z",
           "createdAt": "2016-05-11T23:43:35.341Z",
           "timeSlot": 1,
           "from": "12:00am",
           "to": "12:30am",
           "_id": "5733c3a79e8f6931598e452d",
           "__v": 0
         },
        "_id": "573648e64e7558890d0f2755"
      }       
     ];
     
     
     var timeslotsAvailable = 
         timeslotModule.findAvailableTimeSlot(tables, resInfo);
     
     //console.log("map=" + JSON.stringify(timeslotsAvailable));
     
     assert.include(timeslotsAvailable, 1, "1 should've been included");
     assert.equal(timeslotsAvailable.length, 48, "");
     
     done();
     
   });   
   
   
   it ('test no table available', function(done) {
             
     var tables = [];
     var resInfo = [
      {
        "table": "57083bd7d9e9145274b69210",
        "timeSlot": {
           "updatedAt": "2016-05-11T23:43:35.341Z",
           "createdAt": "2016-05-11T23:43:35.341Z",
           "timeSlot": 1,
           "from": "12:00am",
           "to": "12:30am",
           "_id": "5733c3a79e8f6931598e452d",
           "__v": 0
         },
        "_id": "573648e64e7558890d0f2755"
      }       
     ];
     
     
     var timeslotsAvailable = 
         timeslotModule.findAvailableTimeSlot(tables, resInfo);
     
     //console.log("map=" + JSON.stringify(timeslotsAvailable));
     
     assert.equal(timeslotsAvailable.length, 0, "");
     
     done();
     
   });    
   
   
   
   it ('test no reservations in DB', function(done) {
             
     var tables = ["57083bd7d9e9145274b69210", "57083bd7d9e9145274b69213"];
     var resInfo = [];
     
     
     var timeslotsAvailable = 
         timeslotModule.findAvailableTimeSlot(tables, resInfo);
     
     //console.log("map=" + JSON.stringify(timeslotsAvailable));
     
     assert.equal(timeslotsAvailable.length, 48, "");
     
     done();
     
   }); 
   
      
    
});
