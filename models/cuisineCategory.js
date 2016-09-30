// grab the things we need
var mongoose = require('mongoose');

// Will add the Currency type to the Mongoose Schema types
require("mongoose-currency").loadType(mongoose);
var Currency = mongoose.Types.Currency;

var Schema = mongoose.Schema;

var cusineCategorySchema = new Schema({
    
    categoryDesc: {
        type: String,
        required: true,
        notEmpty: true
    }
    
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var CuisineCategory = mongoose.model('CuisineCategory', cusineCategorySchema);

// make this available to our Node applications
module.exports = CuisineCategory;