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

var TimeSlot = require('../models/timeSlot');

//chai.use(chaiHttp);


describe('Test TimeSlot', function() {

    it('Add TimeSlot', function(done) {
      
        var timeSlots = [
            { timeSlot: 1, from: "12:00am", to: "12:30am" },
            { timeSlot: 2, from: "12:30am", to: "1:00am" },
            { timeSlot: 3, from: "1:00am", to: "1:30am" },
            { timeSlot: 4, from: "1:30am", to: "2:00am" },      
            { timeSlot: 5, from: "2:00am", to: "2:30am" },
            { timeSlot: 6, from: "2:30am", to: "3:00am" },      
            { timeSlot: 7, from: "3:00am", to: "3:30am" },
            { timeSlot: 8, from: "3:30am", to: "4:00am" },      
            { timeSlot: 9, from: "4:00am", to: "4:30am" },
            { timeSlot: 10, from: "4:30am", to: "5:00am" },      
            { timeSlot: 11, from: "5:00am", to: "5:30am" },
            { timeSlot: 12, from: "5:30am", to: "6:00am" },      
            { timeSlot: 13, from: "6:00am", to: "6:30am" },
            { timeSlot: 14, from: "6:30am", to: "7:00am" },      
            { timeSlot: 15, from: "7:00am", to: "7:30am" },
            { timeSlot: 16, from: "7:30am", to: "8:00am" },      
            { timeSlot: 17, from: "8:00am", to: "8:30am" },
            { timeSlot: 18, from: "8:30am", to: "9:00am" },      
            { timeSlot: 19, from: "9:00am", to: "9:30am" },
            { timeSlot: 20, from: "9:30am", to: "10:00am" },
            { timeSlot: 21, from: "10:00am", to: "10:30am" },
            { timeSlot: 22, from: "10:30am", to: "11:00am" },
            { timeSlot: 23, from: "11:00am", to: "11:30am" },
            { timeSlot: 24, from: "11:30am", to: "12:00pm" },            
            { timeSlot: 25, from: "12:00pm", to: "12:30pm" },
            { timeSlot: 26, from: "12:30pm", to: "1:00pm" },
            { timeSlot: 27, from: "1:00pm", to: "1:30pm" },
            { timeSlot: 28, from: "1:30pm", to: "2:00pm" },      
            { timeSlot: 29, from: "2:00pm", to: "2:30pm" },
            { timeSlot: 30, from: "2:30pm", to: "3:00pm" },      
            { timeSlot: 31, from: "3:00pm", to: "3:30pm" },
            { timeSlot: 32, from: "3:30pm", to: "4:00pm" },      
            { timeSlot: 33, from: "4:00pm", to: "4:30pm" },
            { timeSlot: 34, from: "4:30pm", to: "5:00pm" },      
            { timeSlot: 35, from: "5:00pm", to: "5:30pm" },
            { timeSlot: 36, from: "5:30pm", to: "6:00pm" },      
            { timeSlot: 37, from: "6:00pm", to: "6:30pm" },
            { timeSlot: 38, from: "6:30pm", to: "7:00pm" },      
            { timeSlot: 39, from: "7:00pm", to: "7:30pm" },
            { timeSlot: 40, from: "7:30pm", to: "8:00pm" },      
            { timeSlot: 41, from: "8:00pm", to: "8:30pm" },
            { timeSlot: 42, from: "8:30pm", to: "9:00pm" },      
            { timeSlot: 43, from: "9:00pm", to: "9:30pm" },
            { timeSlot: 44, from: "9:30pm", to: "10:00pm" },
            { timeSlot: 45, from: "10:00pm", to: "10:30pm" },
            { timeSlot: 46, from: "10:30pm", to: "11:00pm" },
            { timeSlot: 47, from: "11:00pm", to: "11:30pm" },
            { timeSlot: 48, from: "11:30pm", to: "12:00am" }
                       
            ];
        
        
        async.map(timeSlots, function(eachTimeSlot, callback) {
                    
            TimeSlot.create(eachTimeSlot, function (err, obj) {
                if (err) { 
                    //console.log(err); 
                    callback(err); 
                }
                else {
                    console.log('timeSlot created! ' + obj.timeSlot);    
                    callback();
                }
                
            });
            
        }, function(err) {
                
                // if any of the file processing produced an error, err would equal that error
                if( err ) {
                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('A file failed to process', err);
                    done(err); 
                } else {
                    console.log('All files have been processed successfully');
                    done();
                }
        });
                
  });    
    
        
});