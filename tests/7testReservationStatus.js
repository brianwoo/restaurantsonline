var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var mongoose = require("mongoose");
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

var ReservationStatus = require('../models/reservationStatus');

//chai.use(chaiHttp);


describe('Test ReservationStatus', function() {

    it('Add ReservationStatus', function(done) {
      
        var reservationStatus = [
           { statusDesc: "Seated"},
           { statusDesc: "Completed"},
           { statusDesc: "Reserved"}
        ];
        
        
        async.map(reservationStatus, function(eachStatus, callback) {
                    
            ReservationStatus.create(eachStatus, function (err, obj) {
                if (err) { 
                    //console.log(err); 
                    callback(err); 
                }
                else {
                    console.log('reservationStatus created! ' + obj.statusDesc);    
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
                
  });    
    
        
});