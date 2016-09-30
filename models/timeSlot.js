// grab the things we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var timeSlotSchema = new Schema({
    
    timeSlot: {
        type: Number,
        required: true,
        notEmpty: true
    },
    
    from: {
        type: String,
        required: true,
        notEmpty: true
    },    
    
    to: {
        type: String,
        required: true,
        notEmpty: true
    }
    
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

// make this available to our Node applications
module.exports = TimeSlot;