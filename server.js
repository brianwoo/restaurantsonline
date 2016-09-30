#!/bin/env node
//  OpenShift sample Node application
var https = require("https");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs      = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var logger = require('morgan');


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
       
        if (typeof process.env.OPENSHIFT_NODEJS_PORT === "undefined") {
           self.secport = 8443;
        }
        else {
           self.secport = 443;   
        }
       
        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "0.0.0.0";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
       /*
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./public/index.html');
        */
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };
/* 
        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(path.join(__dirname, 'public') + '/index.html');
        };
        */
              
    };
   
    function redirectSec(req, res, next) {
       if (req.headers['x-forwarded-proto'] == 'http') {
          //console.log("REDIRECTING TO HTTPS");
          res.redirect('https://' + req.headers.host + req.path);
       } else {
          //console.log("NEXT");
          return next();
       }
    }   
   

    // Create REST Resources
    var createRestResources = function(app) {
       
       var users = require('./routes/users');
       var restaurantRouter = require('./routes/restaurantRouter');
       var cuisineCategoryRouter = require('./routes/cuisineCategoryRouter');       
       var orderRouter = require('./routes/orderRouter');       
       var reservationRouter = require('./routes/reservationRouter');       
       var orderStatusRouter = require('./routes/orderStatusRouter');       
       var reservationStatusRouter = require('./routes/reservationStatusRouter');   
       
       app.use(logger('dev'));
       app.use(bodyParser.json());
       app.use(bodyParser.urlencoded({ extended: false }));
       app.use(cookieParser());       
       
       // passport config
       app.use(passport.initialize());
       
       app.use('/', redirectSec, express.static(path.join(__dirname, 'public')));
       app.use('/bower_components',  express.static(path.join(__dirname, 'bower_components')));
       
       app.use('/api/users', users);
       app.use('/api/restaurants', restaurantRouter);
       app.use('/api/cuisinecategories', cuisineCategoryRouter);
       app.use('/api/orders', orderRouter);
       app.use('/api/reservations', reservationRouter);
       app.use('/api/orderstatuses', orderStatusRouter);
       app.use('/api/reservationstatuses', reservationStatusRouter);
       
       // error handler to handle runtime issues.
       app.use(function(err, req, res, next){
          console.error("Error:", err);
          res.status(err.status || 400);
          res.json({
             message: err.message,
             error: {}
          });
       });
       
    };
   
   

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        
        // Connect to MongoDB through Mongoose
        mongoose.connect(config.mongoUrl);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            // we're connected!
            console.log("Connected correctly to database server");
        });
        
        self.createRoutes();
        self.app = express();
       
        // Secure traffic only (on dev system)
        if (typeof process.env.OPENSHIFT_NODEJS_PORT === "undefined") {

           self.app.all('*', function(req, res, next){

              //console.log('req start: ',req.secure, req.hostname, req.url, self.port);
              if (req.secure) {
                  return next();
              };
              res.redirect('https://'+req.hostname+':'+self.secport+req.url);
           }); 
           
           //  Add handlers for the app (from the routes).
           for (var r in self.routes) {
              self.app.get(r, self.routes[r]);
           //self.app.get(r, redirectSec, self.routes[r]);
           }
        }
        else {  // on Prod system (openshift)
               
           //  Add handlers for the app (from the routes).
           for (var r in self.routes) {
              //self.app.get(r, self.routes[r]);
              self.app.get(r, redirectSec, self.routes[r]);
           }
        }
       
        // Create REST Resources
        createRestResources(self.app);
       
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
       
        // Secure traffic only (on dev system)
        if (typeof process.env.OPENSHIFT_NODEJS_PORT === "undefined") {
            var credentials = {
               key: fs.readFileSync('./private/private.key'),
               cert: fs.readFileSync('./private/certificate.pem')
            };
       
            https.createServer(credentials, self.app).listen (
               self.secport, self.ipaddress, function() {
                  console.log('%s: Node server started on %s:%d ...',
                  Date(Date.now() ), self.ipaddress, self.secport);
            }); 
        }
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

