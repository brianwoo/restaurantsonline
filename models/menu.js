// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Will add the Currency type to the Mongoose Schema types
require("mongoose-currency").loadType(mongoose);
var Currency = mongoose.Types.Currency;


var menuSchema = new Schema({
    
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    
    foodCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodCategory'
    },
        
    dishName: {
        type: String,
        required: true,
        notEmpty: true
    },
    

    dishDesc: {
        type: String,
        required: true,
        notEmpty: true
    },    

    dishPrice: {
        type: Currency,
        required: true,
        notEmpty: true
    },
   
    seqNum: {
        type: Number,
        required: true,
        notEmpty: true
    },   
    
}, {
    timestamps: true
});



menuSchema.virtual('dishPriceCurrency').get(function() {
   
  //console.log("converting number 3");
  return (this.dishPrice / 100).toFixed(2);
});

menuSchema.set("toJSON", {virtuals: true});


// the schema is useless so far
// we need to create a model using it
var Menu = mongoose.model('Menu', menuSchema);

// make this available to our Node applications
module.exports = Menu;