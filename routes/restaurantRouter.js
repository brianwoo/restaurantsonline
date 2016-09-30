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
* Restaurant Routes
**************************/
restaurantRouter.route('/')

.get(function(req,res,next) {
   
   restaurantModule.findAll(req, res, next);
});


restaurantRouter.route('/:rId')

.get(function(req,res,next) {
   
   restaurantModule.findById(req, res, next);
});


/*************************
* Restaurant's TimeSlot Routes
**************************/
restaurantRouter.route('/:rId/timeslots')

.get(function(req,res,next) {
   
   timeslotModule.findByNumOfPeople(req, res, next);
   //console.log("timeslots")
});


/*************************
* Restaurant's Menu Category Routes
**************************/
restaurantRouter.route('/:rId/menu/categories')

.get(function(req,res,next) {
   
   foodCategoryModule.findAll(req, res, next);
   //console.log("menu categories")
});


/*************************
* Restaurant's Menu Routes
**************************/
restaurantRouter.route('/:rId/menu')

.get(function(req,res,next) {
   
   //menuModule.findAll(req, res, next);
   menuModule.findAll(req, res, next);
   //console.log("menu")
});


/*************************
* Restaurant's Reservation Routes
**************************/
restaurantRouter.route('/:rId/reservations')

/*
.get(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   reservationModule.findAll(req, res, next);
   //console.log("GET reservations")
})
*/

.post(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   reservationModule.reserve(req, res, next);
   //console.log("POST reservations")
});


/*************************
* Restaurant's modify Reservation Routes
**************************/
/*
restaurantRouter.route('/:rId/reservations/:rsId')

.put(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   reservationModule.modifyStatus(req, res, next);
   //timeslotModule.findById(req, res, next);
   //console.log("PUT reservations")
});
*/


/*************************
* Restaurant's Orders Routes
**************************/

restaurantRouter.route('/:rId/orders')


.post(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   orderModule.order(req, res, next);
   //console.log("POST orders")
})

/*
.get(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   orderModule.findAll(req, res, next);
   //console.log("GET orders")
});
*/


/*************************
* Restaurant's modify Orders Routes
**************************/
/*
restaurantRouter.route('/:rId/orders/:oid')

.put(Verify.verifyOrdinaryUser, function(req,res,next) {
   
   orderModule.modifyStatus(req, res, next);
   //console.log("PUT orders")
});
*/



restaurantRouter.route('/:rId/testing')

.get(function(req,res,next) {
   
   console.log("testing");
   
   try {
      var err = {};
      err.status = 403;
      err.message = "testing failure condition";
      
      throw err;
      
      console.log("after throw");
   }
   catch (e) {
      next(e);
      
      console.log("after next");
   }

   
   
   //next(err);
   
   //console.log("after next");
   
});



module.exports = restaurantRouter;
