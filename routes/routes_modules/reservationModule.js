"use strict";

//var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Reservation = require("../../models/reservation");
var Gcm = require("./cloudMessagingModule");
var Timeslot = require("./timeslotModule");
var DateOnly = require('mongoose-dateonly')(mongoose);


var reservationStatus = {
   SEATED: "Seated",
   COMPLETED: "Completed",
   RESERVED: "Reserved"
};



var reservation = {

   
   getAllReservationStatuses: function(req, res, next) {
      
      var statusArray = [];
      
      for (var key in reservationStatus) {
         if (Object.prototype.hasOwnProperty.call(reservationStatus, key)) {
            statusArray.push(reservationStatus[key]);
         }
      }
      
      res.json(statusArray);
   },   
   
   
   findAll: function(req, res, next) {
   
      /*
      console.log("RestaurantMgr=" + JSON.stringify(req.decoded._doc.restaurantMgr));
      console.log("managesRestaurant=" + JSON.stringify(req.decoded._doc.managesRestaurant));
      console.log("userId=" + JSON.stringify(req.decoded._doc._id));
      */
      
      var searchCriteria = {};
      if (req.decoded._doc.restaurantMgr) {
         searchCriteria.restaurant = req.decoded._doc.managesRestaurant;
      }
      else {
         searchCriteria.bookedBy = req.decoded._doc._id;
      }
            
      Reservation.find(searchCriteria)
      .populate("bookedBy", "firstname lastname devices")
      .populate("timeSlot")
      .populate("restaurant", "lat lon name")
      .populate("table", "tableNum")
      .sort({date: -1})
      .exec(function (err, obj) {
            if (err) { next(err); return; }
         
            res.json(obj);
          
      });
   },
   
   
   modifyStatus: function(req, res, next) {
      
      var managerId = req.decoded._doc._id;
      var managesRestaurant = req.decoded._doc.managesRestaurant;
      var isRestaurantMgr = req.decoded._doc.restaurantMgr;
      var reservation = req.params.rsId;
      var statusToSet = req.body.reservationStatus;
      
      try {
         
         console.log("man="+managesRestaurant + " , rest=" + managesRestaurant);
         
         if (!isRestaurantMgr) {
            var err = {}; 
            err.status=403;
            err.message = "You are not allow to manage this restaurant";
            throw err;            
         }
         
         //console.log("here 1");
         
         var validated = false;
         var reservationStatusKeys = Object.keys(reservationStatus);
         for (var i=0; i < reservationStatusKeys.length; i++) {
            
            var eachKey = reservationStatusKeys[i];
            if (statusToSet == reservationStatus[eachKey]) {
               validated = true;
               break;
            }
         }
         
         //console.log("here 2");
         
         if (validated) {
            
            //var query = {reservation: reservation};
            var update = {$set: {status: statusToSet}};
            var options = {new: true};
            
            Reservation.findOneAndUpdate(
               {_id: reservation, restaurant: managesRestaurant}, 
               update, 
               options)
            .populate("bookedBy")
            .populate("restaurant")
            .populate("timeSlot")
            .exec(function(err, obj) {
               if ((err) || (obj == null)) {
                  
                  var errMsg;
                  if (err)
                     errmsg = err;
                  else
                     errMsg = "Unable to find your reservation";
                  
                  var err = {};
                  err.status=400;
                  err.message = errMsg;
                  next(err);
               }
               else {
                  console.log("Status Changed = " + statusToSet);
                  Gcm.sendMsg(obj.bookedBy.devices, 
                              "Status updated on your reservation!", 
                              "Hi " + obj.bookedBy.firstname + 
                              ", " + obj.restaurant.name + " has changed your reservation (" + 
                              formatDate(obj.date) + " @ " + obj.timeSlot.from + 
                              ") status to " + obj.status);
                  res.json(obj); 
               }
               
            });
         }
         else {
            var err = {};
            err.status=400;
            err.message = "Invalid status to set=" + statusToSet;
            throw err;            
         }
      }
      catch (e) {
         
         console.error("ERROR modifyStatus: " + e);
         res.json(e);
      }
      
   },
   
   
   
   reserve: function(req, res, next) {
      
      var bookedBy = req.decoded._doc._id;
      var restaurant = req.params.rId;
      var nPeople = req.body.nPeople;
      var date = req.body.date;
      var timeslot = req.body.timeslot;
      var specialReq = req.body.specialReq;
      
      // Callback method for to create the reservation after 
      // verification.
      var callback = function(timeslotAvailable) {
         
         try {
            console.log("isAvailable=" + JSON.stringify(timeslotAvailable));

            //console.log("here 2");

            if (!timeslotAvailable.isAvail) {
               //console.log("here 2.5");
               
               var err = {};
               err.status=400;
               err.message = "timeslot is not available";
               throw err;
            }

            //console.log("here 3");

            var newReservation = { 
               restaurant: restaurant,
               table: timeslotAvailable.table,
               date: new DateOnly(date),
               bookedBy: bookedBy,
               timeSlot: timeslot,
               numPeople: nPeople,
               specialReq: specialReq,
               status: reservationStatus.RESERVED
            };


            //console.log("here 4");

            Reservation.create(newReservation, function(err,obj) {
               
               if (err) { next(err); return; }
               
               console.log('reservation created! ' + obj);    
               res.json(obj);
               
            });
            
         }
         catch(e) {
            var err = {};
            err.status=400;
            err.message = e;
            next(err);
         }
      };
      
      
      Timeslot.verifyTimeslotAvailable(restaurant, 
                                       nPeople, 
                                       date, 
                                       timeslot,
                                       callback);
   },
   
};


module.exports = reservation;



function formatDate(dateObj) {
   
   var dd = dateObj.getDate();
   var mm = dateObj.getMonth() + 1;
   var yyyy = dateObj.getFullYear();
   
   /*
   if (dd < 10) {
      dd='0'+dd;
   } 

   if(mm < 10) {
      mm='0'+mm;
   }
   */
   
   return mm+ '/' + dd + '/' + yyyy;
}
