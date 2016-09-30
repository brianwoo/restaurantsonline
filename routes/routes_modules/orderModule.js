"use strict";

//var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Order = require("../../models/order");
var Gcm = require("./cloudMessagingModule");
var Timeslot = require("./timeslotModule");
var DateOnly = require('mongoose-dateonly')(mongoose);


var orderStatus = {
   INPROGRESS: "In Progress",
   READY: "Ready for pickup",
   COMPLETED: "Completed",
   ORDERED: "Ordered"
};


var order = {
   
   
   getAllOrderStatuses: function(req, res, next) {
      
      var orderStatusArray = [];
      
      for (var key in orderStatus) {
         if (Object.prototype.hasOwnProperty.call(orderStatus, key)) {
            orderStatusArray.push(orderStatus[key]);
         }
      }
      
      res.json(orderStatusArray);
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
         searchCriteria.user = req.decoded._doc._id;
      }
            
      Order.find(searchCriteria)
      .populate("restaurant", "name address lat lon")
      .populate("menuItems.menuItem", "dishName")
      .populate("user", "firstname lastname")
      .sort({updatedAt: -1})
      .exec(function (err, obj) {
            if (err) { next(err); return; }
         
            res.json(obj);
          
      });
   },
   
   
   modifyStatus: function(req, res, next) {
      
      var managerId = req.decoded._doc._id;
      var managesRestaurant = req.decoded._doc.managesRestaurant;
      var isRestaurantMgr = req.decoded._doc.restaurantMgr;
      //var restaurant = req.params.rId;
      var order = req.params.oid;
      var statusToSet = req.body.orderStatus;
      
      try {
         
         console.log("man="+managesRestaurant, "newStatus=", statusToSet);
         
         if (!isRestaurantMgr) {
            var err = {}; 
            err.status=403;
            err.message = "You are not allow to manage this restaurant";
            throw err;
         }
         
         //console.log("here 1");
         
         var validated = false;
         var orderStatusKeys = Object.keys(orderStatus);
         for (var i=0; i < orderStatusKeys.length; i++) {
            
            var eachKey = orderStatusKeys[i];
            if (statusToSet == orderStatus[eachKey]) {
               validated = true;
               break;
            }
         }
         
         //console.log("here 2");
         
         if (validated) {
            
            //var query = {order: order};
            var update = {$set: {status: statusToSet}};
            var options = {new: true};
            
            Order.findOneAndUpdate(
               {_id: order, restaurant: managesRestaurant}, 
               update, 
               options)
            .populate("restaurant")
            .populate("user")
            .exec(function(err, obj) {

               if ((err) || (obj == null)) {
                  
                  var errMsg;
                  if (err)
                     errmsg = err;
                  else
                     errMsg = "Unable to find your order";
                  
                  var err = {};
                  err.status=400;
                  err.message = errMsg;
                  next(err);
               }
               else {
                  console.log("Status Changed = " + statusToSet);
                  //console.log("new object = " + obj);
                  Gcm.sendMsg(obj.user.devices, 
                              "Status updated on your order!", 
                              "Hi " + obj.user.firstname + 
                              ", " + obj.restaurant.name + " has changed your order (" + 
                              convertDateTime(obj.createdAt) + ") status to " + obj.status);                  
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
         next(e);
      }
      
   },
   
   
   
   order: function(req, res, next) {
      
      var user = req.decoded._doc._id;
      var restaurant = req.params.rId;
      var menuItems = req.body.menuItems;
      var specialReq = req.body.specialReq;
      
      try {
         
         if (restaurant == undefined) {
            var err = {}; 
            err.status=400;
            err.message = "restaurant cannot be undefined";
            throw err;
         }
         
         if (menuItems == null || menuItems.length == 0) {
            var err = {}; 
            err.status=400;
            err.message = "no menuItems entered!";
            throw err;
         }         
         
         var newOrder = { 
            restaurant: restaurant,
            user: user,
            menuItems: menuItems,
            specialReq: specialReq,
            status: orderStatus.ORDERED
         };

         Order.create(newOrder, function(err,obj) {

            if (err) {
               var err = {}; 
               err.status=400;
               err.message = "Unable to create an new order";
               next(err);               
            }
            else {
               console.log('order created! ' + obj);    
               res.json(obj);
            }
         }); 
      }
      catch (e) {
         next(e);
      }      
   },
   
};


module.exports = order;


/********************
* Convert DateTime
*********************/
function convertDateTime(dateObj) {
      
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      //var dateObj = new Date(dateStr);
      
      var hours = dateObj.getHours();
      //it is pm if hours from 12 onwards
      var suffix = (hours >= 12)? 'pm' : 'am';

      //only -12 from hours if it is greater than 12 (if not back at mid night)
      hours = (hours > 12)? hours -12 : hours;

      //if 00 then it is 12 am
      hours = (hours == '00')? 12 : hours;
      
      var min = dateObj.getMinutes();
      if (min < 10) 
         min = "0" + min;
   
      var year = dateObj.getFullYear();
      var month = months[dateObj.getMonth()];
      var date = dateObj.getDate();
      
      return month + " " + date + ", " + year + " " + hours + ":" + min + suffix;
}