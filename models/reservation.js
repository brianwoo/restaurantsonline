// grab the things we need
var mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

var Schema = mongoose.Schema;

var reservationSchema = new Schema({
    
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    },    
        
    date: {
        type: DateOnly,
        required: true,
        notEmpty: true
    },
    
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot'
    },     
    
    numPeople: {
        type: Number,
        required: true,
        notEmpty: true
    },
    
    specialReq: {
        type: String
    },
    
    status: {
        type: String,
        required: true,
        notEmpty: true
    },     
    
}, {
    timestamps: true
});


reservationSchema.virtual('prettyDate').get(function() {
   
   var months = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec"
   };
   
   var year = this.date.year;
   var monthNum = this.date.month;
   var month = months[monthNum];
   var date = this.date.date;
   
  //console.log("converting number 3");
  return month + " " + date + ", " + year;
});

reservationSchema.set("toJSON", {virtuals: true});

// the schema is useless so far
// we need to create a model using it
var Reservation = mongoose.model('Reservation', reservationSchema);

// make this available to our Node applications
module.exports = Reservation;