//var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var DateOnly = require('mongoose-dateonly')(mongoose);

var timeslotModel = require("../../models/timeSlot");
var tableModel = require("../../models/table");
var reservationModel = require("../../models/reservation");

var MAX_NUM_TIMESLOTS = 48;


/*************************************
* Compute Available Timeslots
**************************************/
function computeAvailableTimeSlots(tables, resInfo) {
   
   var timeSlotMap = {};
   var timeSlotsAvailable = [];
   
   var numTables = tables.length;
   
   // if there is no table available, return right away.
   if (numTables === 0)
      return timeSlotsAvailable;   
   
   // Grouping all the booked timeslots together
   for (var i=0; i < resInfo.length; i++) {
      
      var key = resInfo[i].timeSlot.timeSlot;
      
      //console.log("key=" + key);
      if (key in timeSlotMap)
         timeSlotMap[key] += 1;
      else
         timeSlotMap[key] = 1;
   }
   
   // Remove the timeslots that are fully booked by all tables.
   for (var i=1; i <= MAX_NUM_TIMESLOTS; i++) {
               
      if ((timeSlotMap.hasOwnProperty(i) && timeSlotMap[i] < numTables) ||
         (!timeSlotMap.hasOwnProperty(i))) {
         
         timeSlotsAvailable.push(i);
      }
   }
   
   return timeSlotsAvailable;
}

/******************************************
// Find the tables that can fit the number of people
******************************************/
function findTablesCanFit(input) {
   return new Promise(function(resolve, reject) {
      
      console.log("nPeople=" + input.nPeople + 
                  ", restaurantId=" + input.restaurantId + 
                  ", timeslot=" + input.timeslot);

      //console.log(restaurantId, nPeople, targetDate);
      //console.log("here 1");

      // Find the tables that can fit the number of people
      tableModel.find()
      .select("_id")
      .lte('fitNumPeopleMin', input.nPeople)
      .gte('fitNumPeopleMax', input.nPeople)
      .where('restaurant', input.restaurantId)
      .exec(function (err, obj) {
         if (err) { next(err); reject(err); return; }

         if (obj.length == 0) {
            //res.json([]);
            reject("No tables found that can fit " + 
                   input.nPeople);
         }
         else {
            // setup returnVal to pass down the chain.
            var returnVal = {
               tablesThatCanFit: obj,
               date: input.date,
               timeslot: input.timeslot,
               restaurantId: input.restaurantId,
               nPeople: input.nPeople
            };
            resolve(returnVal);
         }
      });            
   });
};

/******************************************
// Verify whether timeslot is available
******************************************/
function isTimeslotAvailable(input) {
   return new Promise(function(resolve, reject){
      
      var tablesThatCanFit = input.tablesThatCanFit;
      var bookedDate = input.date;
      var timeslot = input.timeslot;
      
      var criteria = {$or: []};
      
      console.log("tablesThatCanFit=" + tablesThatCanFit);
      
      for (var i=0; i < tablesThatCanFit.length; i++) {
         var condition = { $and: [{table: tablesThatCanFit[i]}, 
                                  {date: bookedDate}, 
                                  {timeSlot: timeslot}] };
         
         console.log("condition=" + JSON.stringify(condition));
         
         criteria.$or.push(condition);
      }
      
      console.log("criteria = " + JSON.stringify(criteria));
      
      // Find all the reservations that are booked against 
      // these tables
      reservationModel.find(criteria)
         .select("table timeSlot")
         .exec(function (err, obj) {
            if (err) {
               console.error(err);
               res.json([]);
               return;
            }
   
            //console.log("timeslot NOT avail=" + JSON.stringify(obj));
            var isAvailable = (obj.length < tablesThatCanFit.length);
         
            console.log("timeslot available? " + isAvailable);
         
            // if there is no booking at all for the 
            // specific tables, timeslot and restaurant.  We can
            // book right away.
            if ((isAvailable) && (obj.length == 0)) {
            
               var result = {
                  isAvail: true,
                  //timeslot: obj[j].timeSlot,
                  table: tablesThatCanFit[0]._id
               };
                        
               console.log("result=" + JSON.stringify(result));
               return resolve(result);
            }
         
            // else, some tablesThatCanFit were booked, then
            // we need to check to determine which ones are available
            // then reserve with one of them.
            else if (isAvailable) {
               for (var i=0; i < tablesThatCanFit.length; i++) {
                                    
                  var eachTable = tablesThatCanFit[i];
                  
                  //console.log("eachTable=" + JSON.stringify(eachTable));
                  
                  for (var j=0; j < obj.length; j++) {
                     
                     console.log("Comparing eachTable=" + eachTable._id + 
                                 ", obj table=" + JSON.stringify(obj[j].table));
                     
                     // this table is available
                     if (eachTable._id.toString() !== obj[j].table.toString()) {
                        
                        var result = {
                           isAvail: true,
                           //timeslot: obj[j].timeSlot,
                           table: eachTable._id
                        };
                        
                        console.log("result=" + JSON.stringify(result));
                        return resolve(result);
                     }
                  }
               }
            }
            else {
               var result = { isAvail: false };
               return resolve(result);
            }
         
            
            //resolve(result);
            //return (obj.length >= tablesThatCanFit.length);
         });    
   });
};


/*********************************
* Public methods
**********************************/
var timeslot = {
  
   findAvailableTimeSlot: computeAvailableTimeSlots,
   
   
   verifyTimeslotAvailable: function(restaurantId, nPeople, date, timeslot, callback) {
      
      var input = {
         restaurantId: restaurantId,
         nPeople: nPeople,
         date: date,
         timeslot: timeslot
      };
      
      findTablesCanFit(input)
      .then(isTimeslotAvailable)
      .then(function(result) {
         callback(result);
      })
      .catch(function(err) {
         return false;
      });
      
      
      //console.log("isAvailable=" + isAvailable);
      //return isAvailable;
   },
   
   
   
   findByNumOfPeople: function(req, res, next) {

            
      var restaurantId = req.params.rId;
      var nPeople = req.query.nPeople;
      var targetDate = req.query.date;
      
      if (nPeople == null) {
         console.log("Missing nPeople in query param");
         res.status(400);
         res.json("Missing nPeople in query param");
         return;
      }
         
      if (targetDate == null) {
         console.log("Missing date in query param");
         res.status(400);
         res.json("Missing date in query param");
         return;
      }      
      
      console.log("targetDate=" + targetDate);
      
      /******************************************
      // Find the tables that can fit the number of people
      ******************************************/
      /*
      function findTablesCanFit(input) {
         return new Promise(function(resolve, reject) {
         
            //console.log(restaurantId, nPeople, targetDate);
            console.log("here 1");
      
            // Find the tables that can fit the number of people
            tableModel.find()
            .select("_id")
            .lte('fitNumPeopleMin', nPeople)
            .gte('fitNumPeopleMax', nPeople)
            .where('restaurant', restaurantId)
            .exec(function (err, obj) {
               if (err) {
                  console.error(err);
                  res.json([]);
               }

               if (obj.length == 0) {
                  res.json([]);
                  reject("No tables found that can fit " + 
                         nPeople);
               }
               else {
                  // setup returnVal to pass down the chain.
                  var returnVal = {
                     tablesThatCanFit: obj,
                  };
                  resolve(returnVal);
               }
            });            
         });
      };
      */
      
      /******************************************
      // Find the tables that can fit the number of people
      ******************************************/      
      function findReservationsByTables(input) {
         return new Promise(function(resolve, reject) {
            
            var tables = input.tablesThatCanFit;
            
            console.log("tablesThatCanFit = " + tables);
            
            var date1 = new DateOnly(targetDate);
            
            console.log("here 2");

            // Find all the reservations that are booked against 
            // these tables
            reservationModel.find()
               .populate("timeSlot")
               .select("table timeSlot")
               .in('table', tables)
               .where('date', date1)
               .exec(function (err, obj) {
                  if (err) {
                     console.error(err);
                     res.json([]);
                  }

                  // setup returnVal to pass down the chain.
                  input.allReservations = obj;
               
                  //console.log("allReservations=" + input.allReservations);
               
                  //input.tablesThatCanFit = tables;
                  resolve(input);
               });                   
         });
      };      

      /******************************************
      // Compute Available Time Slots by tables and reservation info
      ******************************************/  
      function _computeAvailableTimeSlots(input) {
         return new Promise(function(resolve, reject) {
            
            var tables = input.tablesThatCanFit;
            var resInfo= input.allReservations;
            
            console.log("here 3 tablesThatCanFit = " + tables);
            
            var availTimeSlots = computeAvailableTimeSlots(tables, resInfo);
            resolve(availTimeSlots);
         });
      };
      
      /******************************************
      // pass the outputs from two previously made queries
      ******************************************/  
      function findTimeslotInfo(availTimeSlots) {
         return new Promise(function(resolve, reject) {
            
            console.log("here 4, targetDate=", targetDate);
            
            timeslotModel.find()
            .in('timeSlot', availTimeSlots)
            .sort({'timeSlot': 1})
            .exec(function (err, obj) {
               if (err) {
                  console.error(err);
                  res.json([]);
                  return;
               }

               res.json(obj);
            });
                             
         });
      };
      
      
      // Find the timeslots that are available 
      // with Promise.
      var input = {
         nPeople: nPeople,
         restaurantId: restaurantId
      };
      
      findTablesCanFit(input)
      .then(findReservationsByTables)
      .then(_computeAvailableTimeSlots)
      .then(findTimeslotInfo)
      .catch(function(err) {
         res.status(400);
         console.log("err = " + err);
         res.json([]);
      });  
      
   }

};


module.exports = timeslot;