// grab the things we need
var mongoose = require('mongoose');

// Will add the Currency type to the Mongoose Schema types
//require("mongoose-currency").loadType(mongoose);
//var Currency = mongoose.Types.Currency;

var Schema = mongoose.Schema;


var tableSchema = new Schema({
    
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    
    tableNum: {
        type: String,
        required: true,
        notEmpty: true
    },
        
    fitNumPeopleMin: {
        type: Number,
        required: true,
        notEmpty: true
    },    

    fitNumPeopleMax: {
        type: Number,
        required: true,
        notEmpty: true
    }
    
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var table = mongoose.model('Table', tableSchema);

// make this available to our Node applications
module.exports = table;