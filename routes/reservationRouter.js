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

var reservationRouter = express.Router();
reservationRouter.use(bodyParser.json());


/*************************
* Restaurant's Reservation Routes
**************************/
reservationRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   reservationModule.findAll(req, res, next);
   //console.log("GET reservations")
})

/*
.post(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   reservationModule.reserve(req, res, next);
   //console.log("POST reservations")
});
*/


/*************************
* Restaurant's modify Reservation Routes
**************************/
reservationRouter.route('/:rsId')

.put(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   reservationModule.modifyStatus(req, res, next);
   //timeslotModule.findById(req, res, next);
   //console.log("PUT reservations")
});



module.exports = reservationRouter;
