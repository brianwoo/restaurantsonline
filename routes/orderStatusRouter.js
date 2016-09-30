var express = require('express');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
var Verify = require('./verify');

// load the routes modules
var restaurantModule = require("./routes_modules/restaurantModule");
var timeslotModule = require("./routes_modules/timeslotModule");
var foodCategoryModule = require("./routes_modules/foodCategoryModule");
var menuModule = require("./routes_modules/menuModule");
var reservationModule = require("./routes_modules/reservationModule");
var orderModule = require("./routes_modules/orderModule");

//var Restaurant = require("../models/restaurant");

var orderStatusRouter = express.Router();
orderStatusRouter.use(bodyParser.json());


/*************************
* Restaurant's Orders Routes
**************************/
orderStatusRouter.route('/')

.get(function(req,res,next) {
   
   orderModule.getAllOrderStatuses(req, res, next);
   //console.log("GET order statuses")
});


module.exports = orderStatusRouter;
