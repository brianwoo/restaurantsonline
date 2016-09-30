var express = require('express');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');

// load the routes modules
var categoryModule = require("./routes_modules/cuisineCategoryModule");

//var Restaurant = require("../models/restaurant");

var router = express.Router();
router.use(bodyParser.json());


/*************************
* Cuisine Categories Routes
**************************/
router.route('/')

.get(function(req,res,next) {
   
   categoryModule.findAll(req, res, next);
});




module.exports = router;