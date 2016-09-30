// grab the things we need
var mongoose = require('mongoose');

// Will add the Currency type to the Mongoose Schema types
require("mongoose-currency").loadType(mongoose);
var Currency = mongoose.Types.Currency;

var Schema = mongoose.Schema;

var businessHoursType = new Schema({
    open: {type: String, required: true, notEmpty: true},
    close: {type: String, required: true, notEmpty: true}
});

var costType = new Schema({
    high: {type: Number, required: true, notEmpty: true},
    low: {type: Number, required: true, notEmpty: true}
});


var restaurantSchema = new Schema({
    
    name: {
        type: String,
        required: true,
        notEmpty: true
    },

    address: {
        type: String,
        required: true,
        notEmpty: true
    },    
    
   
    lat: {
        type: Number,
        required: true,
        notEmpty: true
    },    

    lon: {
        type: Number,
        required: true,
        notEmpty: true
    },    
    
    cuisineDesc:  [{
        type: String,
        required: true,
        notEmpty: true
    }],    
     
    cost:  costType,
    
    paymentOptions:  [{
        type: String,
        required: true,
        notEmpty: true
    }],     

    website: {
        type: String
    },    
    
    phone: {
        type: String,
        required: true,
        notEmpty: true        
    }, 
        
    description: {
        type: String,
        required: true,
        notEmpty: true        
    },
    
    photos:  [{
        type: String
    }],     

    mainPhoto: {
       type: String,
       required: true,
       notEmpty: true
    },
    
    businessHours: {
        monday: businessHoursType,
        tuesday: businessHoursType,
        wednesday: businessHoursType,
        thursday: businessHoursType,
        friday: businessHoursType,
        saturday: businessHoursType,
        sunday: businessHoursType
    },
    
    cuisineCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CuisineCategory'
    },
    
    
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var restaurant = mongoose.model('Restaurant', restaurantSchema);

// make this available to our Node applications
module.exports = restaurant;