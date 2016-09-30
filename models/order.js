// grab the things we need
var mongoose = require('mongoose');

// Will add the Currency type to the Mongoose Schema types
require("mongoose-currency").loadType(mongoose);
var Currency = mongoose.Types.Currency;

var Schema = mongoose.Schema;

var menuItemSchema = new Schema({
    
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
   
    numOfOrders: {
        type: Number,
        required: true,
        notEmpty: true
    } 
});


var orderSchema = new Schema({
    
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
        
    menuItems: [menuItemSchema],
   
    specialReq: {
        type: String
    },
   
    status: {
        type: String,
        required: true,
        notEmpty: true
    }
    
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var Order = mongoose.model('Order', orderSchema);

// make this available to our Node applications
module.exports = Order;