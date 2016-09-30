var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.route('/')


/* GET users listing. */
.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    
    User.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });    
});


router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
    req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        
        if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        
        user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      console.log('User in users: ', user);
        
      var token = Verify.getToken(user);
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        restaurantMgr: user.restaurantMgr
      });
    });
      
  })(req,res,next);
});


router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

//Verify.verifyOrdinaryUser, 

router.route('/addDevice')
   
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
   
   try {
      console.log("here addDevice userId=", req.body);

      var update = {$addToSet: {devices: req.body.device}};
      var options = {new: true};

      User.findOneAndUpdate({
         _id: req.decoded._doc._id
      }, 
      update, 
      options,
      function (err, obj) {

         if ((err) || (obj == null)) {

            var errMsg;
            if (err)
               errMsg = err;
            else
               errMsg = "Unable to add device to user profile";

            var err = {};
            err.status = 400;
            err.message = errMsg;
            next(err);

         } else {
            console.log("Device added!");
            res.json(obj);
         }
      });
   }
   catch (err) {
      console.log("Error:" , err);
      res.status(400).json({message: err.toString()});
   }
   
});




router.route('/deleteDevice')
   
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
   
   try {
      console.log("here deleteDevice userId=", req.body);

      var update = {$pull: {devices: req.body.device}};
      var options = {new: true};

      User.findOneAndUpdate({
         _id: req.decoded._doc._id
      }, 
      update, 
      options,
      function (err, obj) {

         if ((err) || (obj == null)) {

            var errMsg;
            if (err)
               errMsg = err;
            else
               errMsg = "Unable to delete device from user profile";

            var err = {};
            err.status = 400;
            err.message = errMsg;
            next(err);

         } else {
            console.log("Device deleted!");
            res.json(obj);
         }
      });
   }
   catch (err) {
      console.log("Error:" , err);
      res.status(400).json({message: err.toString()});
   }
});


/*
router.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

router.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
              var token = Verify.getToken(user);
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});
*/

module.exports = router;