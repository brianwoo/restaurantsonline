var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();


var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var config = require('../config');
var async = require('async');

// Connect to MongoDB through Mongoose
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to database server");
});

var Reservation = require('../models/reservation');
var Restaurant = require('../models/restaurant');
var Table = require('../models/table');
var Timeslot = require('../models/timeSlot');
//var ReservationStatus = require('../models/reservationStatus');

//chai.use(chaiHttp);


describe('Test Reservation', function() {

    it('Add Reservation', function(done) {
      
      //** search restaurant 
      Restaurant.find({name: "River Cafe"})
      .exec(function(err, obj) {
         if (err) {done(err); throw err;}
         
         var restaurant = obj[0]._id;
                  
         //**  search table
         Table.find()
         .and([{restaurant: obj[0]._id}, {tableNum: "4"}])
         .exec(function(err, obj) {
            if (err) {done(err); throw err;}
            
            var table = obj[0]._id;            
                        
            //**  search timeslot
            Timeslot.find()
            .where("timeSlot", 1)
            .exec(function(err, obj) {
               if (err) {console.log(err); done(err); throw err;}

               var timeslot = obj[0]._id;

               console.log("table = " + table);
               console.log("timeSlot = " + timeslot);
               console.log("res=" + restaurant);
               //console.log("status=" + status);

               var reservation = [
                  { 
                     restaurant: restaurant,
                     table: table,
                     date: new Date(),
                     bookedBy: new ObjectId("572a3bb647c48445439ece4a"),
                     timeSlot: timeslot,
                     numPeople: 4,
                     specialReq: "This is my special Req",
                     status: "Reserved"
                  }
               ];

               async.map(reservation, function(eachReso, callback) {

                  Reservation.create(eachReso, function (err, obj) {
                      if (err) { 
                          callback(err); 
                      }
                      else {
                          console.log('reservation created! ' + obj.specialReq);    
                          callback();
                      }

                  });

               }, function(err) {

                      // if any of the file processing produced an error, err would equal that error
                      if( err ) {
                          // One of the iterations produced an error.
                          // All processing will now stop.
                          console.log('failed to process', err);
                          done(err); 
                      } else {
                          console.log('All items have been processed successfully');
                          done();
                      }
               });               
               
               
               //console.log("table = " + table);
               //console.log("timeSlot = " + timeslot);
               //console.log("res=" + restaurant);
               
               //**  search status
               /*
               ReservationStatus.find()
               .where("statusDesc", "Reserved")
               .exec(function(err, obj) {
                  if (err) {console.log(err); done(err); throw err;}

                  var status = obj[0]._id;
                  

                  
                  //console.log("obj=" + obj);
               });               
               */
               
               
               //console.log("obj=" + obj);
            });
         });
         

         
         
      });
      
       

        
       
        /*
        async.map(reservation, function(eachReso, callback) {
                    
            Reservation.create(eachReso, function (err, obj) {
                if (err) { 
                    //console.log(err); 
                    callback(err); 
                }
                else {
                    console.log('reservation created! ' + obj.statusDesc);    
                    callback();
                }
                
            });
            
        }, function(err) {
                
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('failed to process', err);
                    done(err); 
                } else {
                    console.log('All items have been processed successfully');
                    done();
                }
        });
        */
                
  });    
    
        
});