// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reservationStatusSchema = new Schema({
    
    statusDesc: {
        type: String,
        required: true,
        notEmpty: true
    }
    
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var ReservationStatus = mongoose.model('ReservationStatus', reservationStatusSchema);

// make this available to our Node applications
module.exports = ReservationStatus;