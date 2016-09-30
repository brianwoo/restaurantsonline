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

var restaurantRouter = express.Router();
restaurantRouter.use(bodyParser.json());


/*************************
* Restaurant's Orders Routes
**************************/
restaurantRouter.route('/')

/*
.post(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   orderModule.order(req, res, next);
   //console.log("POST orders")
})
*/

.get(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   orderModule.findAll(req, res, next);
   //console.log("GET orders")
});


/*************************
* Restaurant's modify Orders Routes
**************************/
restaurantRouter.route('/:oid')

.put(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   orderModule.modifyStatus(req, res, next);
   //console.log("PUT orders")
});



module.exports = restaurantRouter;
