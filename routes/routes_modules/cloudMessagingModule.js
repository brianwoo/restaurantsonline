//var bodyParser = require('body-parser');
//var mongoose = require('mongoose');

//var CuisineCategory = require("../../models/cuisineCategory");
var config = require("../../config.js");
var gcm = require("node-gcm");

/*
var message = new gcm.Message({
    data: { message: 'msg1', title: "this is title 2", icon: "@drawable/btn_star_big_on"},
    notification: {title: "this is title 3", body: "body text", icon: "@drawable/btn_star_big_on"}
});
*/

var cloudMessaging = {
  
   sendMsg: function(devices, title, message) {
   
      if (devices == null || devices.length == 0) {
         console.log("device list is empty");
         return;   
      }
            
      var message = new gcm.Message({
         data: {message1: message, 
                title1: title, 
                icon: "ic_stat_restaurants_online",
                'content-available': 1
               }
      });
      
      // Set up the sender with you API key, prepare your recipients' registration tokens.
      var sender = new gcm.Sender(config.gcmSenderId);

      sender.send(message, { registrationTokens: devices }, function (err, response) {
         if(err) console.error(err);
         else    console.log(response);
      });
   }
};


module.exports = cloudMessaging;

